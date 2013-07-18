/**
* entities object contains code for tracking, processing and rendering entities
*
* @module entities
* @class entities
*/

E.entities = (function() {
	"use strict";

	var entities = {};

	entities.instances = [];

	/**
	 *	Calls the process() method for each tracked entity and clears up entities that have been marked for removal
	 *
	 * @method process
	 * @return this
	 */
	entities.process = function() {
		var currentInstances = [];
		for (var i=0; i<entities.instances.length; i++) {
			entities.instances[i].process();
			if (!entities.instances[i].remove) {
				currentInstances.push(entities.instances[i]);
			}
		}
		entities.instances = currentInstances;
		return this;
	};

	/**
	 * Calls the render method for each tracked entity
	 *
	 * @method render
	 * @return this
	 */
	entities.render = function() {
		for (var i=0; i<entities.instances.length; i++) {
			entities.instances[i].render();
		}
		return this;
	};

	return entities;
})();

/**
 * Prototype for all entities
 *
 * For more information on how Escape uses inheritance see objectPrototype.js
 *
 * @class entityPrototype
 */
E.entityPrototype = (function() {
	"use strict";

	var entityPrototype = {}.extend({
		hittable: false,
		/**
		 * initialise entity
		 *
		 * @method init
		 * @return this
		 */
		init: (function() {
			if (counter === undefined) {
				var counter=0;
			}
			return function(params) {
				$.extend(this, params);
				this.entityId = counter++;
				this.halfWidth = this.width / 2;
				this.halfHeight = this.height / 2;
				E.entities.instances.push(this);
				return this;
			};
		})(),
		/**
		 * Placeholder function to be overridden
		 * Invoked once per game loop
		 *
		 * @method process
		 * @return this
		 */
		process: function() {
			return this;
		}
	});

	return entityPrototype;
})();