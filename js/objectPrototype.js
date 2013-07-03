/*
 * Extend Object.prototype with helper methods to simplify inheritance
 */

(function(Object) { // pass in Object as an argument to prevent minification bugs
	/* extend - return a new object inheriting from the previous one 
	 * @param propertiesObject an object that contains properties to add to the new object (overwriting previous ones with the same name)
	 * The reason to use this over Object.create is that to pass in properties to the new object, Object.create requires property descriptors as its
	 * second argument rather than a straightforward object
	 */
	var extend = function(propertiesObject) {
		var propertyDescriptors = {};
		if (propertiesObject) {
			for (var property in propertiesObject) {
				propertyDescriptors[property] = {value: propertiesObject[property], writable: true, configurable: true, enumerable: true};
			}
		}
		return Object.create(this, propertyDescriptors);
	};
	/* create - create a new object based on this prototype, modify according to the passed in parameters and run the init method if available
	 * @param propertiesObject an object that contains properties to add to the new object
	 * [@param] Any other parameters are passed to the init function
	 */
	var create = function(propertiesObject) {
		var object = this.extend(propertiesObject);
		var initArgs = [];
		for (var i=1; i<arguments.length; i++) {
			initArgs.push(arguments[i]);
		}
		if (typeof object.init === "function") object.init.apply(object, initArgs);
		return object;
	};

	/* Add the methods to Object.prototype in this way to ensure that they are not enumerable and therefore don't cause issues with 
	 * third party code (normal assignment to Object.prototype caused havoc with jQuery) 
	 */
	Object.defineProperties(Object.prototype, {
		extend: {
			value: extend
		},
		create: {
			value: create
		}
	});
})(Object);