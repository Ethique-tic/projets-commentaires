"use strict";

var frMonthToEn = {
	janvier: "january", fevrier: "february", "février": "february", mars: "march", avril: "april", mai: "may",
	juin: "june", juillet: "july", aout: "august", "août": "august", septembre: "september", octobre: "october",
	novembre: "november", decembre: "december", "décembre": "december",
	automne: "september"
};
var frMonthRegexp = [];
for (var m in frMonthToEn)
	if (frMonthToEn.hasOwnProperty (m))
		frMonthRegexp.push (m);
module.exports.frMonthToEn = frMonthToEn;
module.exports.frMonthRegexp = new RegExp (frMonthRegexp.join ("|"), "gi");
