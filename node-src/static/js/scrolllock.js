"use strict";

// Safari
NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.map = Array.prototype.map;
NodeList.prototype.filter = Array.prototype.filter;

// Chrome, Firefox
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.map = Array.prototype.map;
HTMLCollection.prototype.filter = Array.prototype.filter;

$(document).ready (function () {
	function getElementLockHeight (el) {
		var lockTarget = el.getAttribute ("data-lock-to"), lockHeight = 0;
		if (lockTarget) {
			lockTarget = $(lockTarget)[0]; // Fetch the lock target
			if (lockTarget) // Does it exists?
				lockHeight = lockTarget.getBoundingClientRect ().height;
		}
		return lockHeight;
	}
	var getComputedStyle = function (el) {
		return el.currentStyle || window.getComputedStyle (el);
	};
	function getStylePx (str) { return +str.replace ("px", ""); }

	// Fetching scroll locks
	var locks = document.getElementsByClassName ("scroll-lock");

	// Adding filler div
	var groups = {};
	locks.forEach (function (el) {
		var group = el.getAttribute ("data-lock-group") || "default";
		groups[group] = groups[group] || [];
		groups[group].push (el);

		var style = getComputedStyle (el);
		var div = document.createElement ("div");
		div.classList.add ("hidden");
		div.classList.add ("lock-filler"); // Useless, just to clarify stuff

		// Sizing
		div.style.marginTop = style.marginTop;
		div.style.marginBottom = style.marginBottom;
		div.style.height = "" + el.getBoundingClientRect ().height + "px";

		el.parentElement.insertBefore (div, el.nextElementSibling);
		el.filler = div;	// Dirty, but it works
	});

	document.addEventListener ("scroll", function () {
		for (var group in groups) {
			if (groups.hasOwnProperty (group)) {
				var locks = groups[group];
				var lockHeights = locks.map (getElementLockHeight),
					isLocked = locks.map (function (el) { return el.classList.contains ("locked"); }),
					x = isLocked.map ((function (locks) { return function (is, i) {
						var el = is ? locks[i].filler : locks[i];
						return el.getBoundingClientRect ().top - getStylePx (getComputedStyle (el).marginTop);
					}})(locks));
				locks.forEach (function (el, i) {
					// Locking
					if (x[i] > lockHeights[i]) {
						if (isLocked[i]) {
							el.classList.remove ("locked");
							el.filler.classList.add ("hidden");
							el.style.transform = "";
						}
					}
					else {
						if (!isLocked[i]) {
							el.classList.add ("locked");
							el.filler.classList.remove ("hidden");
							el.style.top = "" + lockHeights[i] + "px";
						}
					}
					// Pushing above by the bottom element
					if (isLocked[i] && i < locks.length - 1) {
						var style = getComputedStyle (el);
						var height = el.getBoundingClientRect ().height + getStylePx (style.marginTop) + getStylePx (style.marginBottom);
						var pos = getStylePx (getComputedStyle (el).top);
						if (x[i + 1] < pos + height)
							el.style.transform = "translateY(" + (x[i+1] - pos - height) + "px)";
						else
							el.style.transform = "";
					}
				});
			}
		}
	});
});
