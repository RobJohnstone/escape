var projectilePrototype  = $.extend(Object.create(entityPrototype), {
	entityType: 'projectile',
	process: function() {
		this.move();
	},
	move: function() {
		var tile,
			projectile = this;
		this.x += this.xSpeed * timer.coeff;
		this.y += this.ySpeed * timer.coeff;
		// check for collisions with tiles
		tile = map.getTileIndex(this.x, this.y);
		if (map.data[tile] === undefined || !tiles.tileset[map.data[tile]].passable) {
			this.remove = true;
		}
		// check for collisions with actors
		entities.instances.forEach(function(entity) {
			if (entity.entityType !== 'projectile' && entity.entityId !== projectile.firerId && entity.x - entity.halfWidth < projectile.x && entity.x + entity.halfWidth >projectile.x && entity.y - entity.halfHeight < projectile.y && entity.y + entity.halfHeight >projectile.y) {
				projectile.remove = true;
				if (typeof entity.hit === 'function') {
					entity.hit(projectile);
				}
			}
		});
	},
	render: function() {
		var x = map.xOffset + this.x,
			y = map.yOffset + this.y;
		graphics.gameContext.beginPath();
		graphics.gameContext.arc(x, y, this.halfWidth, 0, 2 * Math.PI);
		graphics.gameContext.fillStyle = 'yellow';
		graphics.gameContext.fill();
	}
});