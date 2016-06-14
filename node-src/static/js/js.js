"use strict";

var debug = document.getElementById("debug");
$(document).ready (function () {
	// Right timeline positioning
	var vfrise = document.getElementById ("vfrise");
	vfrise.style.marginTop = "-" + (vfrise.getBoundingClientRect ().height / 2) + "px";

	function onScreenPercentage (el) {
		var bounds = el.getBoundingClientRect ();
		return (Math.min (Math.max (bounds.bottom, 0), window.innerHeight) - Math.max (Math.min (bounds.top, window.innerHeight), 0)) / bounds.height;
	}

	var events = document.getElementsByClassName ("event-row").map (function (el) {
		return {row: el, li: document.getElementById (el.id.replace ("row", "li"))};
	});

	events.forEach (function (evt) {
		var addHover = function () {
			evt.li.classList.add ("hover");
			evt.row.classList.add ("hover");
		};
		var remHover = function () {
			evt.li.classList.remove ("hover");
			evt.row.classList.remove ("hover");
		};
		evt.li.onmouseenter = evt.row.onmouseenter = addHover;
		evt.li.onmouseleave = evt.row.onmouseleave = remHover;
	});

	document.addEventListener ("scroll", function () {
		events.forEach (function (evt) {
			evt.li.style.backgroundColor = "rgba(237, 97, 103, " + (onScreenPercentage (evt.row) * 0.75) + ")";
		})
	});

	$('[data-toggle="popover"]').popover();
});