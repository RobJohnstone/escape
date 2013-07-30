/**
 * Utility methods that do not really belong any where else
 *
 * @module util
 * @class util
 */

var util = (function() {
	"use strict";

	return {
		/**
		 * Takes a string and returns the value of the global variable with that name
		 *
		 * To avoid global cluttering this method understands '.' syntax to follow the namespace/object chain
		 * The only usage envisaged so far is the loading of variable names from JSON. Any other usage probably means 
		 * we're doing something wrong. Even the json example may mean that but I've not yet thought of a better way!	
		 *
		 * @method valFromString
		 * @return value {any}
		 */
		valFromString: function(name) {
			var value = window,
				names = name.split('.');
			for (var i=0; i<names.length; i++) {
				value = value[names[i]];
			}
			return value;
		},

		/**
		 * Moves an array element from one index to another
		 *
		 * @param arr {array} The array to modify
		 * @param currentIndex {number} The index the element currently occupies
		 * @param newIndex {number} The new index for the element to occupy
		 * @return {array} The array
		 */
		moveArrayElement: function(array, currentIndex, newIndex) {
			if (newIndex >= 0 && newIndex < array.length) {
				array.splice(newIndex, 0, array.splice(currentIndex, 1)[0]);
			}
			return array;
		},

		/**
		 * Detect whether the current tab has lost focus (only works in some modern browsers)
		 *
		 * @method onVisibilityChange
		 * @param callback
		 * @return this
		 */
		onVisibilityChange: function(callback) {
			if (document.hidden === undefined) {
				if (document.webkitHidden !== undefined) {
					document.addEventListener("webkitvisibilitychange", function() {
						if (typeof callback === 'function') {
							callback();
						}
						else {
							throw new Error('Callback passed to util.onVisibilityChange should be a function');
						}
					});
				}
			}
			else {
				document.addEventListener("visibilitychange", function() {
					if (typeof callback === 'function') {
						callback();
					}
					else {
						throw new Error('Callback passed to util.onVisibilityChange should be a function');
					}
				});
			}
		}
	};
})();