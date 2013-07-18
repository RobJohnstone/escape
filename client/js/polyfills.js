/**
 * Polyfills module
 *
 * @module polyfills
 * @class polyfills
 */

/**
 * [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame)
 *
 * Note that in this implementation the frame rate will not be exactly 60 due to the browser being single threaded.
 * TODO: There is a fix for this - google it
 *
 * @method requestAnimationFrame
 */
window.requestAnimationFrame = (function(){
	return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
})();