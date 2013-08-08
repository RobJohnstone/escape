var E = E || {};

/**
 * Prototype for all projectiles. Inherits from entity prototype
 *
 * For more information on how Escape uses inheritance see objectPrototype.js
 *
 * @module projectilePrototype
 * @class projectilePrototype
 * @extends entityPrototype
 */

E.projectilePrototype = (function() {
	"use strict";

	var projectilePrototype = E.entityPrototype.extend();
	projectilePrototype.entityType = 'projectile';

	/**
	 * Carries out the processing required by a projectile each frame
	 *
	 * @method process
	 * @return this
	 */
	projectilePrototype.process = function() {
		this.move();
		return this;
	};

	/**
	 * Moves the projectile testing for collisions and calling the appropriate hit handlers
	 *
	 * @method move
	 * @return this
	 */
	projectilePrototype.move = function() {
		var tile,
			projectile = this;
		this.x += this.speed.x * E.timer.coeff;
		this.y += this.speed.y * E.timer.coeff;
		// check for collisions with tiles
		tile = E.map.getTileIndex(this);
		if (!E.map.getTileObj(tile).passable) {
			this.remove = true;
		}
		// check for collisions with actors
		E.entities.instances.forEach(function(entity) {
			if (entity.entityType !== 'projectile' && entity.entityId !== projectile.firerId && entity.x - entity.halfWidth < projectile.x && entity.x + entity.halfWidth >projectile.x && entity.y - entity.halfHeight < projectile.y && entity.y + entity.halfHeight >projectile.y) {
				projectile.remove = true;
				if (typeof entity.hit === 'function') {
					entity.hit(projectile);
				}
			}
		});
		return this;
	};

	/**
	 * Renders the projectile
	 *
	 * Placeholder graphics TODO: replace with bitmaps
	 *
	 * @method render
	 * @return this
	 */
	projectilePrototype.render = function() {
		E.graphics.vectors.circleNow(this, this.halfWidth, 'yellow', true);
		return this;
	};

	return projectilePrototype;
})();