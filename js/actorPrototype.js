E.actorPrototype = (function () {
	"use strict";

	var map = E.map;

	var actorPrototype = E.entityPrototype.extend();

	actorPrototype.entityType = 'actor';
	actorPrototype.hittable = true;
	actorPrototype.health = 100;
	actorPrototype.weapon = 'gun';
	actorPrototype.move = function(v) {
		var tile = map.getTileIndex(this),
			tileLeft = tile - 1,
			tileUp = tile - map.columns,
			tileRight = tile + 1,
			tileDown = tile + map.columns,
			tileLeftUp = tileUp - 1,
			tileRightUp = tileUp + 1,
			tileRightDown = tileDown + 1,
			tileLeftDown = tileDown - 1,
			distance, ratio, test,
			tiles = E.tiles,
			timer = E.timer,
			vector = E.vector,
			blocked = false;
		// normalise velocity
		v = vector.setLength(v, this.speed * timer.coeff);
		// move
		test = vector.add(this, v);
		// check on map
		if (test.x - this.halfWidth < 0) test.x = this.halfWidth;
		if (test.x + this.halfWidth > map.width) test.x = map.width - this.halfWidth;
		if (test.y - this.halfHeight < 0) test.y = this.halfHeight;
		if (test.y + this.halfHeight > map.height) test.y = map.height - this.halfHeight;
		// check not moving into an impassable tile
		if (v.x < 0 && test.x - this.halfWidth < (tile % map.columns) * tiles.tileWidth) {
			if (map.data[tileLeft] !== undefined && !tiles.tileset[map.data[tileLeft]].passable) {
				test.x = this.halfWidth + (tile % map.columns) * tiles.tileWidth;
				test.y = this.y + (v.y ? (v.y / Math.abs(v.y)) : 0) * Math.round(this.speed * timer.coeff);
			}
			else if (map.data[tileLeftUp] !== undefined && !tiles.tileset[map.data[tileLeftUp]].passable && test.y - this.halfHeight < Math.floor(tile / map.rows) * tiles.tileHeight) {
				test.y = this.halfHeight + Math.floor(tile / map.rows) * tiles.tileHeight;
			}
			else if (map.data[tileLeftDown] !== undefined && !tiles.tileset[map.data[tileLeftDown]].passable && test.y + this.halfHeight > Math.floor(tileDown / map.rows) * tiles.tileHeight) {
				test.y = -this.halfHeight + Math.floor(tileDown / map.rows) * tiles.tileHeight;
			}
		}
		else if (v.x > 0 && test.x + this.halfWidth > (tileRight % map.columns) * tiles.tileWidth) {
			if (map.data[tileRight] !== undefined && !tiles.tileset[map.data[tileRight]].passable) {
				test.x = -this.halfWidth + (tileRight % map.columns) * tiles.tileWidth;
				test.y = this.y + (v.y ? (v.y / Math.abs(v.y)) : 0) * Math.round(this.speed * timer.coeff);
			}
			else if (map.data[tileRightUp] !== undefined && !tiles.tileset[map.data[tileRightUp]].passable && test.y - this.halfHeight < Math.floor(tile / map.rows) * tiles.tileHeight) {
				test.y = this.halfHeight + Math.floor(tile / map.rows) * tiles.tileHeight;
			}
			else if (map.data[tileRightDown] !== undefined && !tiles.tileset[map.data[tileRightDown]].passable && test.y + this.halfHeight > Math.floor(tileDown / map.rows) * tiles.tileHeight) {
				test.y = -this.halfHeight + Math.floor(tileDown / map.rows) * tiles.tileHeight;
			}
		}
		if (v.y < 0 && test.y - this.halfHeight < Math.floor(tile / map.rows) * tiles.tileHeight) {
			if (map.data[tileUp] !== undefined && !tiles.tileset[map.data[tileUp]].passable) {
				test.y = this.halfHeight + Math.floor(tile / map.rows) * tiles.tileHeight;
				test.x = this.x + (v.x ? (v.x / Math.abs(v.x)) : 0) * Math.round(this.speed * timer.coeff);
			}
			else if (map.data[tileLeftUp] !== undefined && !tiles.tileset[map.data[tileLeftUp]].passable && test.x - this.halfWidth < Math.floor(tile % map.columns) * tiles.tileWidth) {
				test.x = this.halfWidth + Math.floor(tile % map.columns) * tiles.tileWidth;
			}
			else if (map.data[tileRightUp] !== undefined && !tiles.tileset[map.data[tileRightUp]].passable && test.x + this.halfWidth > Math.floor(tileRight % map.columns) * tiles.tileWidth) {
				test.x = -this.halfWidth + Math.floor(tileRight % map.columns) * tiles.tileWidth;
			}
		}
		else if (v.y > 0 && test.y + this.halfHeight > Math.floor(tileDown / map.rows) * tiles.tileHeight) {
			if (map.data[tileDown] !== undefined && !tiles.tileset[map.data[tileDown]].passable) {
				test.y = -this.halfHeight + Math.floor(tileDown / map.rows) * tiles.tileHeight;
				test.x = this.x + (v.x ? (v.x / Math.abs(v.x)) : 0) * Math.round(this.speed * timer.coeff);
			}
			else if (map.data[tileLeftDown] !== undefined && !tiles.tileset[map.data[tileLeftDown]].passable && test.x - this.halfWidth < Math.floor(tile % map.columns) * tiles.tileWidth) {
				test.x = this.halfWidth + Math.floor(tile % map.columns) * tiles.tileWidth;
			}
			else if (map.data[tileRightDown] !== undefined && !tiles.tileset[map.data[tileRightDown]].passable && test.x + this.halfWidth > Math.floor(tileRight % map.columns) * tiles.tileWidth) {
				test.x = -this.halfWidth + Math.floor(tileRight % map.columns) * tiles.tileWidth;
			}
		}
		this.direction = vector.normalise(vector.subtract(this, test));
		// check if blocked
		if (this.x === test.x && this.y === test.y) {
			blocked = true;
		}
		// save position
		this.x = Math.round(test.x);
		this.y = Math.round(test.y);
		return !blocked;
	};

	actorPrototype.moveTowards = function(position) {
		var targetVector = E.vector.subtract(this, position);
		targetVector = E.vector.setLength(targetVector, this.speed);
		this.move(targetVector);
	};

	actorPrototype.moveTo = function(position) {
		/* uses A* */
		var start = map.getTileCoords(map.getTileIndex(this)),
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
		E.graphics.writeText(this.health, this.x - this.halfWidth + map.offset.x, this.y + map.offset.y);
	};

	return actorPrototype;
})();