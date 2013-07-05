/*
 * Prototype for all actors. Inherits from entity prototype
 *
 * For more information on how Escape uses inheritance see objectPrototype.js
 */

E.actorPrototype = (function () {
	"use strict";

	var actorPrototype = E.entityPrototype.extend();

	actorPrototype.entityType = 'actor';
	actorPrototype.hittable = true;
	actorPrototype.health = 100;
	actorPrototype.weapon = 'gun';

	/**
	 * Moves the actor in the direction indicated by vector v. If this would result in a collision with the map
	 * then a more sensible vector is chosen and the actor moves that way instead
	 *
	 * @param v the movement vector
	 * @return blocked true if the actor was unable to move. This is useful for the AI
	 */
	actorPrototype.move = function(v) {
		var newPos,
			vector = E.vector,
			blocked = false;
		// set length of v to correct value given actor's speed and the current frame rate
		v = vector.setLength(v, this.speed * E.timer.coeff);
		v = E.map.collisionAdjust(this, v);
		// move
		newPos = E.vector.round(vector.add(this, v));
		this.direction = vector.mag(v) ? vector.normalise(v) : this.direction;
		// check if actor was completely blocked
		if (this.x === newPos.x && this.y === newPos.y) {
			blocked = true;
		}
		// save position
		this.x = newPos.x;
		this.y = newPos.y;

		return !blocked; // useful for AI
	};

	/**
	 * Moves actor towards the position indicated, taking into account the actor's speed
	 * Movement is attempted "as the crow flies" with no route selection
	 * 
	 * @param position the location to move towards
	 * @return this
	 */
	actorPrototype.moveTowards = function(position) {
		var targetVector = E.vector.subtract(this, position);
		targetVector = E.vector.setLength(targetVector, this.speed);
		this.move(targetVector);
		return this;
	};

	/**
	 * Moves actor towards the position indicated, while performing sensible route selection
	 * Route selection algorithm is A*
	 *
	 * @param position the location to move to
	 * @return this
	 */
	actorPrototype.moveTo = function(position) {
		var map = E.map,
			start = map.getTileCoords(map.getTileIndex(this)),
			end = map.getTileCoords(map.getTileIndex(position)),
			path = aStar(map.pathGrid, start, end, 'Euclidean');
		if (path.length > 1) {
			this.moveTowards(map.getTileCentre(path[1]));
		}
		else if (path.length === 1) {
			this.moveTowards(map.getTileCentre(path[0]));
		}
		return this;
	};

	/**
	 * handles being hit by a projectile, including effect on health and action to take upon death
	 *
	 * @param projectile The object that is doing the hitting. Should inherit from projectilePrototype
	 * @return this;
	 */
	actorPrototype.hit = function(projectile) {
		if (!this.invulnerable) {
			this.health -= projectile.damage;
			if (this.health <= 0) {
				this.remove = true;
			}
		}
		if (typeof this.hitHandler === 'function') { 
			this.hitHandler(projectile); // the AI reaction to being hit
		}
		return this;
	};

	/**
	 * Fires the actor's weapon
	 *
	 * @param target The location that is to be aimed at
	 * @return this
	 */
	actorPrototype.fire = function(target) {
		var weapon = E.weapons[this.weapon],
			projectileSpeed = weapon.projectileSpeed,
			targetVector = E.vector.subtract(this, target),
			speed = E.vector.setLength(targetVector, projectileSpeed),
			firer = this,
			projectile;
		if (this.lastFired === undefined || this.lastFired < E.timer.time - weapon.reloadTime) {
			projectile = E.projectilePrototype.create({
				'x': this.x,
				'y': this.y,
				'width': 4,
				'height': 4,
				'colour': 'yellow',
				speed: speed,
				'firerId': firer.entityId,
				'damage': weapon.damage
			});
			this.lastFired = E.timer.time;
		}
		this.direction = E.vector.normalise(targetVector);
		return this;
	};

	/*
	 * Renders the actor. This is placeholder code until the bitmap graphics code has been written
	 *
	 * @return this
	 */
	actorPrototype.render = function() {
		/* Placeholder code */
		E.graphics.gameContext.save();
		E.graphics.gameContext.translate(E.map.offset.x, E.map.offset.y);
		E.graphics.gameContext.translate(this.x, this.y);
		E.graphics.gameContext.rotate(-E.vector.angle(this.direction, {x:0, y:-1}, true));
		E.graphics.gameContext.beginPath();
		E.graphics.gameContext.moveTo(-this.halfWidth, this.halfHeight);
		E.graphics.gameContext.lineTo(0, -this.halfHeight);
		E.graphics.gameContext.lineTo(this.halfWidth, this.halfHeight);
		E.graphics.gameContext.fillStyle = this.colour;
		E.graphics.gameContext.fill();
		E.graphics.gameContext.restore();
		E.graphics.writeText(this.health, this.x - this.halfWidth + E.map.offset.x, this.y + E.map.offset.y);
		return this;
	};

	return actorPrototype;
})();