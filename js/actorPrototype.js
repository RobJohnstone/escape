/*
 * Prototype for all actors. Inherits from entity prototype
 */
E.actorPrototype = (function () {
	"use strict";

	var actorPrototype = E.entityPrototype.extend();

	actorPrototype.entityType = 'actor';
	actorPrototype.hittable = true;
	actorPrototype.health = 100;
	actorPrototype.weapon = 'gun';

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

	actorPrototype.moveTowards = function(position) {
		var targetVector = E.vector.subtract(this, position);
		targetVector = E.vector.setLength(targetVector, this.speed);
		this.move(targetVector);
	};

	actorPrototype.moveTo = function(position) {
		/* uses A* */
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
	};

	actorPrototype.hit = function(projectile) {
		if (!this.invulnerable) {
			this.health -= projectile.damage;
			if (this.health <= 0) {
				this.remove = true;
			}
		}
		if (typeof this.hitHandler === 'function') {
			this.hitHandler(projectile);
		}
	};

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
	};

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
	};

	return actorPrototype;
})();