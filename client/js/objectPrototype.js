/**
 * Extend Object.prototype with helper methods to simplify inheritance
 *
 * Escape uses prototypal style inheritance rather than the constructor / pseudo-classical 
 * approach used by many javascript developers. The "blueprints" for each type of object
 * are defined as objects in files named "<type>Prototype.js". A new object of that type can 
 * be created using "var newObj = <type>Prototype.create();". To create a new prototype based
 * upon a previous one use "var newPrototype = <type>Prototype.extend();"
 * 
 * It could be argued that extending Object.prototype in this way is an anti-pattern due to the
 * effect it could have on code written by those who are unaware that it has been extended. However,
 * the code below takes account of the most common types of conflict and employs suitable preventative
 * measures so this sort of problem should not occur. 
 *
 * @module objectPrototype
 * @class objectPrototype
 */

(function(Object) { // pass in Object as an argument to prevent minification bugs

	/**
	 * Return a new object inheriting from the previous one
	 *
	 * @method extend
	 * @param propertiesObject an object that contains properties to add to the new object (overwriting previous ones with the same name)
	 * The reason to use this over Object.create is that to pass in properties to the new object, Object.create requires property descriptors as its
	 * second argument rather than a straightforward object
	 * @return {object} The new object
	 */
	function extend(propertiesObject) {
		var propertyDescriptors = {};
		if (propertiesObject) {
			for (var property in propertiesObject) {
				propertyDescriptors[property] = {value: propertiesObject[property], writable: true, configurable: true, enumerable: true};
			}
		}
		return Object.create(this, propertyDescriptors);
	}

	/**
	 * Create a new object based on this prototype, modify according to the passed in parameters and run the init method if available
	 *
	 * @method create
	 * @param propertiesObject an object that contains properties to add to the new object
	 * @param [initObject]* Any other parameters are passed to the init function
	 * @return {object} The new object
	 */
	function create(propertiesObject) {
		var object = this.extend(propertiesObject);
		var initArgs = [];
		for (var i=1; i<arguments.length; i++) {
			initArgs.push(arguments[i]);
		}
		if (typeof object.init === "function") object.init.apply(object, initArgs);
		return object;
	}

	/**
	 * Creates a copy of an object rather than a reference to that object
	 * Note that it is not recursive and does not copy inherited properties
	 *
	 * @method clone
	 * @return {object} A new object identical to the original
	 */
	function clone() {
		var newObj = {};
		for (var property in this) {
			if (this.hasOwnProperty(property)) {
				newObj[property] = this[property];
			}
		}
		return newObj;
	}


	/* Add the methods to Object.prototype in this way to ensure that they are not enumerable and are therefore less likely to cause issues with 
	 * third party code (normal assignment to Object.prototype caused havoc with jQuery!) 
	 * 
	 * @private
	 * @method _addToObjectPrototype
	 * @param method {function} The method to add to Object.prototype
	 */
	function _addToObjectPrototype(method) {
		var propertyDescriptor = {};
		if (Object.prototype[method.name] === undefined) {
			Object.defineProperty(Object.prototype, method.name, {value: method, writable: true}); // enumerable if not defined defaults to false
		}
		else {
			throw "The method "+method.name+"already exists in Object.prototype";
		}
	}

	_addToObjectPrototype(extend);
	_addToObjectPrototype(create);
	_addToObjectPrototype(clone);
})(Object);