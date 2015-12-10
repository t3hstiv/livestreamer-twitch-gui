import FromNowHelper from "helpers/-FromNowHelper";


var second = 1000;
var minute = 60 * second;
var hour   = 60 * minute;
var day    = 24 * hour;

function formatMinutes( diff, short ) {
	var minutes     = Math.floor( diff / minute );
	var leadingZero = !short && minutes < 10 ? "0" : "";
	return `${ leadingZero }${ minutes.toFixed( 0 ) }m`;
}

function formatHours( diff, short ) {
	var hours     = Math.floor( diff / hour ).toFixed( 0 );
	var remaining = diff % hour;
	var minutes   = !short && remaining > minute ? formatMinutes( remaining, true ) : "";
	return `${ hours }h${ minutes }`;
}

function formatDays( diff ) {
	var days      = Math.floor( diff / day ).toFixed( 0 );
	var remaining = diff % day;
	var hours     = remaining > hour ? formatHours( remaining, true ) : "";
	return `${ days }d${ hours }`;
}


export default FromNowHelper.extend({
	_compute: function( params ) {
		var diff = +new Date() - params[0];
		return diff < minute
			? "just now"
			: diff < hour
				? formatMinutes( diff )
				: diff < day
					? formatHours( diff )
					: formatDays( diff );
	}
});
