var E = E || {};

/**
 * Definitions for all the actor types in the game. Also includes a factory method (create)
 * to create an actor of that type
 *
 * @module actors
 * @class actors
 */

E.actors = (function() {
	"use strict";

	return {
		/**
		 * Creates an actor of the specified type
		 *
		 * @method create
		 * @param actor {object} The object to extend with the actor definition. The type property 
		 * of actor determines which definition to use.
		 * @return {object} An actor object
		 */
		create: function(actor) {
			var actorDefinition = $.extend({}, this[actor.type]);
			$.extend(actorDefinition, actor);
			actorDefinition.initial = $.extend({}, actorDefinition);
			return E[actorDefinition.prototype].create(actorDefinition);
		},
		player: {
			prototype: 'playerPrototype',
			width: 32,
			height: 32,
			colour: 'green',
			speed: 5,
			direction: {x: 1, y: 0},
			invulnerable: false
		},
		baddy: {
			prototype: 'baddyPrototype',
			width: 32,
			height: 32,
			colour: 'red',
			maxRange: 500,
			mode: 'watch',
			idealRange: 500,
			speed: 5,
			direction: {x: 1, y: 0}
		}
	};
})();