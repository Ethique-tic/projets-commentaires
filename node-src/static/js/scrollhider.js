"use strict";

$(document).ready (function () {
	var elements = document.getElementsByClassName ("scroll-hide")
		.filter (function (el) { return el.hasAttribute ("data-show-on"); })
		.map (function (el) {
			el.showTarget = $(el.getAttribute ("data-show-on"))[0];
			el.isHidden = true;
			return el;
		});

	function elementInViewport (el) {
		var bounds = el.getBoundingClientRect ();
		return (bounds.top < window.innerHeight && bounds.bottom > 0);
	}

	document.addEventListener ("scroll", function () {
		elements.forEach (function (el) {
			if (elementInViewport (el.showTarget) == el.isHidden) {
				el.isHidden = !elementInViewport (el.showTarget);
				if (el.isHidden) el.classList.remove ("shown");
				else el.classList.add ("shown");
			}
		});
	});
});
