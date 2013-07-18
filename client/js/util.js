/**
 * Utility methods that do not really belong any where else
 *
 * @module util
 * @class util
 */

E.util = (function() {
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
		}
	};
})();