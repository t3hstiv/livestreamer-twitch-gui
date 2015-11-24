import nwWindow from "nwjs/nwWindow";


export function removeAll() {
	var Cookies = nwWindow.cookies;
	Cookies.getAll( {}, function( cookies ) {
		[].forEach.call( cookies, function( c ) {
			Cookies.remove({
				url: "http" + ( c.secure ? "s" : "" ) + "://" + c.domain + c.path,
				name: c.name
			});
		});
	});
}
