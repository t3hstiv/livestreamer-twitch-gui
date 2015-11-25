import {
	get,
	computed,
	run,
	inject,
	Service
} from "Ember";
import nwGui from "nwjs/nwGui";
import Parameter from "utils/Parameter";
import ParameterCustom from "utils/ParameterCustom";
import Substitution from "utils/Substitution";
import resolvePath from "utils/resolvePath";
import which from "utils/fs/which";
import stat from "utils/fs/stat";
import CP from "commonjs!child_process";
import PATH from "commonjs!path";


var { readOnly } = computed;
var { next } = run;
var { service } = inject;

var platform = process.platform;
var isWin = platform === "win32";

function checkExec( stat ) {
	return stat.isFile() && ( isWin || ( stat.mode & 73 ) > 0 );
}

function launch( exec, params ) {
	return new Promise(function( resolve, reject ) {
		var spawn = CP.spawn( exec, params, { detached: true } );
		spawn.on( "error", reject );
		next( resolve );
	});
}


export default Service.extend({
	metadata: service(),
	settings: service(),
	auth: service(),

	chatMethods: readOnly( "metadata.config.chat-methods" ),

	/**
	 * @param channel
	 * @returns {Promise}
	 */
	open: function( channel ) {
		var url  = get( this, "metadata.config.twitch-chat-url" );
		var name = get( channel, "id" );

		if ( !url || !name ) {
			return Promise.reject( new Error( "Missing URL or channel name" ) );
		}

		url = url.replace( "{channel}", name );

		var method   = get( this, "settings.chat_method" );
		var command  = get( this, "settings.chat_command" ).trim();

		switch ( method ) {
			case "default":
			case "browser":
				return this._openDefaultBrowser( url );
			case "irc":
				return this._openIRC( channel );
			case "chromium":
			case "chrome":
				return this._openPredefined( command, method, url );
			case "msie":
				return this._openMSIE( url );
			case "chatty":
				return this._openChatty( command, name );
			case "custom":
				return this._openCustom( command, name, url );
			default:
				return Promise.reject( new Error( "Invalid chat method" ) );
		}
	},


	_openDefaultBrowser: function( url ) {
		return new Promise(function( resolve ) {
			nwGui.Shell.openExternal( url );
			next( resolve );
		});
	},


	_openIRC: function() {
		return Promise.reject( new Error( "Not yet implemented" ) );
	},


	_openPredefined: function( command, key, url ) {
		var methods  = get( this, "chatMethods" );
		var data     = methods[ key ];
		var args     = data[ "args" ];
		var exec     = data[ "exec" ][ platform ];
		var fallback = data[ "fallback" ][ platform ];

		// validate command and use fallback paths if needed
		return this._validatePredefined( command, exec, fallback )
			.then(function( exec ) {
				var params = Parameter.getParameters(
					{ args: args, url : url },
					[ new ParameterCustom( null, "args", true ) ],
					[ new Substitution( "url", "url" ) ]
				);

				return launch( exec, params );
			});
	},

	_validatePredefined: function( command, executables, fallbacks ) {
		// user has set a custom executable path
		if ( command.length ) {
			// validate command:
			// check if the command's executable name is equal to one of the given ones
			var exec = PATH.basename( command );
			return executables.indexOf( exec ) !== -1
				? which( command, checkExec )
				: Promise.reject( new Error( "Invalid command" ) );

		} else {
			// look for matching executables inside the $PATH variable first
			return executables.reduce(function( chain, exec ) {
				return chain.catch(function() {
					// check file
					return which( exec, checkExec );
				});
			}, Promise.reject() )
				.catch( function() {
					// or look for matching executables in a list of fallback paths
					return fallbacks.reduce(function( chain, fallback ) {
						return chain.catch(function() {
							// resolve env variables
							fallback = resolvePath( fallback );
							// append each executable to the current path
							return executables.reduce(function( chain, exec ) {
								return chain.catch(function() {
									var file = PATH.join( fallback, exec );
									// check file (absolute path)
									return which( file, checkExec );
								});
							}, Promise.reject() );
						});
					}, Promise.reject() );
				});
		}
	},


	_openMSIE: function( url ) {
		var data   = get( this, "chatMethods.msie" );
		var args   = data[ "args" ];
		var exec   = data[ "exec" ];
		var script = data[ "script" ];

		// the script needs to be inside the application's folder
		var dir    = PATH.dirname( process.execPath );
		var file   = PATH.join( dir, script );

		return stat( file )
			.then(function() {
				var params = Parameter.getParameters(
					{
						args  : args,
						script: file,
						url   : url
					},
					[
						new ParameterCustom( null, "args", true )
					],
					[
						new Substitution( "url", "url" ),
						new Substitution( "script", "script" )
					]
				);

				return launch( exec, params );
			});
	},


	_openChatty: function( chatty, channel ) {
		var token      = get( this, "auth.session.access_token" );
		var user       = get( this, "auth.session.user_name" );
		var data       = get( this, "chatMethods.chatty" );
		var javaArgs   = data[ "args" ];
		var javaExec   = data[ "exec" ][ platform ];
		var fbPaths    = data[ "fallback" ][ platform ];
		var args       = data[ "chatty-args" ];
		var chattyFb   = data[ "chatty-fallback" ];

		// object containing all the required data
		var obj = {
			args,
			chatty,
			user,
			token,
			channel
		};
		// just a single custom parameter, so a string can be defined in package.json
		var parameters = [
			new ParameterCustom( null, "args", true )
		];
		// custom parameter substitutions
		var substitutions = [
			new Substitution( "user", "user" ),
			new Substitution( "token", "token" ),
			new Substitution( "channel", "channel" )
		];

		// if no chatty jar has been set
		if ( !chatty || !chatty.trim().length ) {
			// check for chatty startscript in $PATH
			return which( chattyFb, checkExec )
				.then(function() {
					var params = Parameter.getParameters( obj, parameters, substitutions );
					return launch( chattyFb, params );
				});
		}

		return which( javaExec, checkExec )
			.catch(function() {
				// java executable fallback paths
				return fbPaths.reduce(function( chain, fallback ) {
					return chain.catch(function() {
						// resolve env variables
						fallback = resolvePath( fallback );
						// append executable name to fallback path
						var file = PATH.join( fallback, javaExec );
						return which( file, checkExec );
					});
				}, Promise.reject() );
			})
			.then(function( exec ) {
				// check for existing chatty .jar file (and return java executable)
				return stat( chatty )
					.then(function() {
						return exec;
					});
			})
			.then(function( exec ) {
				obj.args = `${ javaArgs } ${ obj.args }`;
				substitutions.push( new Substitution( "chatty", "chatty" ) );

				var params = Parameter.getParameters( obj, parameters, substitutions );
				return launch( exec, params );
			});
	},


	_openCustom: function( command, channel, url ) {
		var token  = get( this, "auth.session.access_token" );
		var user   = get( this, "auth.session.user_name" );
		var params = Parameter.getParameters(
			{
				command,
				channel,
				url,
				user,
				token
			},
			[
				new ParameterCustom( null, "command", true )
			],
			[
				new Substitution( "url", "url" ),
				new Substitution( "user", "user" ),
				new Substitution( "token", "token" ),
				new Substitution( "channel", "channel" )
			]
		);
		var exec = params.shift();

		return which( exec, checkExec )
			.then(function() {
				return launch( exec, params );
			});
	}
});
