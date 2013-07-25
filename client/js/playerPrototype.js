/**
 * Prototype for the player. Inherits from actor prototype
 *
 * For more information on how Escape uses inheritance see objectPrototype.js
 *
 * @module playerPrototype
 * @class playerPrototype
 * @extends actorPrototype
 */
E.playerPrototype = (function() {
	"use strict";

	return E.actorPrototype.extend({
		width: 32,
		height: 32,
		colour: 'green',
		speed: 5,
		direction: {x: 1, y: 0},
		invulnerable: true,
		/**
		 * Actions to be taken each frame for the player
		 *
		 * @method process
		 * @return this
		 */
		process: function() {
			var tileIndex = E.map.getTileIndex(this);
			if (E.map.getTileObj(tileIndex).exit) {
				//E.game.mapComplete();
				E.game.mode = 'mapComplete';
			}
			return this;
		}
	});
})();