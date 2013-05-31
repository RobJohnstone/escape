var actorPrototype = $.extend(Object.create(entityPrototype), {
	entityType: 'actor',
	hittable: true,
	health: 100,
	weapon: 'gun',
	move: function(dx, dy) {
		var tile = map.getTileIndex(this.x, this.y),
			tileLeft = tile - 1,
			tileUp = tile - map.columns,
			tileRight = tile + 1,
			tileDown = tile + map.columns,
			tileLeftUp = tileUp - 1,
			tileRightUp = tileUp + 1,
			tileRightDown = tileDown + 1,
			tileLeftDown = tileDown - 1,
			distance, ratio, testX, testY;
		// normalise velocity
		distance = Math.sqrt(dx*dx + dy*dy);
		ratio = this.speed / distance;
		dx = dx * ratio;
		dy = dy * ratio;
		// move
		testX = this.x + (dx * timer.coeff);
		testY = this.y + (dy * timer.coeff);
		// check on map
		if (testX - this.halfWidth < 0) testX = this.halfWidth;
		if (testX + this.halfWidth > map.width) testX = map.width - this.halfWidth;
		if (testY - this.halfHeight < 0) testY = this.halfHeight;
		if (testY + this.halfHeight > map.height) testY = map.height - this.halfHeight;
		// check not moving into an impassable tile
		if (dx < 0 && testX - this.halfWidth < (tile % map.columns) * tiles.tileWidth) {
			if (map.data[tileLeft] !== undefined && !tiles.tileset[map.data[tileLeft]].passable) {
				testX = this.halfWidth + (tile % map.columns) * tiles.tileWidth;
				testY = testY + (dy ? (dy / Math.abs(dy)) : 0) * Math.round(this.speed * timer.coeff);	
			}
			else if (map.data[tileLeftUp] !== undefined && !tiles.tileset[map.data[tileLeftUp]].passable && testY - this.halfHeight < Math.floor(tile / map.rows) * tiles.tileHeight) {
				testY = this.halfHeight + Math.floor(tile / map.rows) * tiles.tileHeight;
			}
			else if (map.data[tileLeftDown] !== undefined && !tiles.tileset[map.data[tileLeftDown]].passable && testY + this.halfHeight > Math.floor(tileDown / map.rows) * tiles.tileHeight) {
				testY = -this.halfHeight + Math.floor(tileDown / map.rows) * tiles.tileHeight;
			}
		}
		else if (dx > 0 && testX + this.halfWidth > (tileRight % map.columns) * tiles.tileWidth) {
			if (map.data[tileRight] !== undefined && !tiles.tileset[map.data[tileRight]].passable) {
				testX = -this.halfWidth + (tileRight % map.columns) * tiles.tileWidth;
				testY = testY + (dy ? (dy / Math.abs(dy)) : 0) * Math.round(this.speed * timer.coeff);
			}
			else if (map.data[tileRightUp] !== undefined && !tiles.tileset[map.data[tileRightUp]].passable && testY - this.halfHeight < Math.floor(tile / map.rows) * tiles.tileHeight) {
				testY = this.halfHeight + Math.floor(tile / map.rows) * tiles.tileHeight;
			}
			else if (map.data[tileRightDown] !== undefined && !tiles.tileset[map.data[tileRightDown]].passable && testY + this.halfHeight > Math.floor(tileDown / map.rows) * tiles.tileHeight) {
				testY = -this.halfHeight + Math.floor(tileDown / map.rows) * tiles.tileHeight;
			}
		}
		if (dy < 0 && testY - this.halfHeight < Math.floor(tile / map.rows) * tiles.tileHeight) {
			if (map.data[tileUp] !== undefined && !tiles.tileset[map.data[tileUp]].passable) {
				testY = this.halfHeight + Math.floor(tile / map.rows) * tiles.tileHeight;
				testX = testX + (dx ? (dx / Math.abs(dx)) : 0) * Math.round(this.speed * timer.coeff);	
			}
			else if (map.data[tileLeftUp] !== undefined && !tiles.tileset[map.data[tileLeftUp]].passable && testX - this.halfWidth < Math.floor(tile % map.columns) * tiles.tileWidth) {
				testX = this.halfWidth + Math.floor(tile % map.columns) * tiles.tileWidth;
			}
			else if (map.data[tileRightUp] !== undefined && !tiles.tileset[map.data[tileRightUp]].passable && testX + this.halfWidth > Math.floor(tileRight % map.columns) * tiles.tileWidth) {
				testX = -this.halfWidth + Math.floor(tileRight % map.columns) * tiles.tileWidth;
			}
		}
		else if (dy > 0 && testY + this.halfHeight > Math.floor(tileDown / map.rows) * tiles.tileHeight) {
			if (map.data[tileDown] !== undefined && !tiles.tileset[map.data[tileDown]].passable) {
				testY = -this.halfHeight + Math.floor(tileDown / map.rows) * tiles.tileHeight;
				testX = testX + (dx ? (dx / Math.abs(dx)) : 0) * Math.round(this.speed * timer.coeff);
			}
			else if (map.data[tileLeftDown] !== undefined && !tiles.tileset[map.data[tileLeftDown]].passable && testX - this.halfWidth < Math.floor(tile % map.columns) * tiles.tileWidth) {
				testX = this.halfWidth + Math.floor(tile % map.columns) * tiles.tileWidth;
			}
			else if (map.data[tileRightDown] !== undefined && !tiles.tileset[map.data[tileRightDown]].passable && testX + this.halfWidth > Math.floor(tileRight % map.columns) * tiles.tileWidth) {
				testX = -this.halfWidth + Math.floor(tileRight % map.columns) * tiles.tileWidth;
			}
		}
		// calculate direction
		dx = testX - this.x;
		dy = this.y - testY;
		this.direction = (dy < 0 ? Math.PI : 0) + Math.atan(dx/dy);
		// save position
		this.x = Math.round(testX);
		this.y = Math.round(testY);
	},
	moveTowards: function(x, y) {
		if (Object.prototype.toString.call(x) === '[object Object]') {
			y = x.y;
			x = x.x;
		}
		var dx = x - this.x,
			dy = y - this.y,
			distance = Math.sqrt(dx*dx + dy*dy),
			ratio = distance / this.speed,
			x = dx / ratio,
			y = dy / ratio;
		this.move(x, y);
	},
	moveTo: function(x, y) {
		/* uses A* */
		var start = map.getTileCoords(map.getTileIndex(this.x, this.y)),
			end = map.getTileCoords(map.getTileIndex(x, y)),
			path = AStar(map.pathGrid, start, end, 'Euclidean');
		if (path.length > 1) {
			this.moveTowards(map.getTileCentre(path[1]));
		}
		else if (path.length === 1) {
			this.moveTowards(map.getTileCentre(path[0]));
		}
	},
	hit: function(projectile) {
		if (!this.invulnerable) {
			this.health -= projectile.damage;
			if (this.health <= 0) {
				this.remove = true;
			}
		}
		else console.log('not taking damage as this.invulnerable='+this.invulnerable);
	},
	fire: function(x, y) {
		var weapon = weapons[this.weapon],
			projectileSpeed = weapon.projectileSpeed,
			dx = x - this.x,
			dy = y - this.y,
			distance = Math.sqrt(dx*dx + dy*dy),
			ratio = projectileSpeed / distance,
			xSpeed = ratio * dx,
			ySpeed = ratio * dy,
			firer = this,
			projectile;
		if (this.lastFired === undefined || this.lastFired < timer.time - weapon.reloadTime) {
			projectile = Object.create(projectilePrototype);
			projectile.init({
				'x': this.x,
				'y': this.y,
				'width': 4,
				'height': 4,
				'colour': 'yellow',
				'xSpeed': xSpeed,
				'ySpeed': ySpeed,
				'firerId': firer.entityId,
				'damage': weapon.damage
			});
			this.lastFired = timer.time;
		}
		this.direction = (dy >= 0 ? Math.PI : 0) + Math.atan(dx/(-dy));
	},
	render: function() {
		graphics.gameContext.save();
		graphics.gameContext.translate(map.xOffset, map.yOffset);
		graphics.gameContext.translate(this.x, this.y);
		graphics.gameContext.rotate(this.direction);
		graphics.gameContext.beginPath();
		graphics.gameContext.moveTo(-this.halfWidth, this.halfHeight);
		graphics.gameContext.lineTo(0, -this.halfHeight);
		graphics.gameContext.lineTo(this.halfWidth, this.halfHeight);
		graphics.gameContext.fillStyle = this.colour;
		graphics.gameContext.fill();
		graphics.gameContext.restore()
		graphics.writeText(this.health, this.x - this.halfWidth + map.xOffset, this.y + map.yOffset);
	}
});