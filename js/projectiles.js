var projectilePrototype  = $.extend({}, entityPrototype, {
	entityType: 'projectile',
	process: function() {
		this.move();
	},
	move: function() {
		var tile;
		this.x += this.xSpeed * timer.coeff;
		this.y += this.ySpeed * timer.coeff;
		// check for collisions with tiles
		tile = map.getTileIndex(this.x, this.y);
		if (map.data[tile] !== undefined && !tiles.tileset[map.data[tile]].passable) {
			this.remove = true;
		}
		// check for collisions with actors
		entities.instances.forEach(function(entity) {
			if (entity.entityType !== 'projectile' && entity.entityId !== this.firerId && entity.x - entity.halfWidth < this.x && entity.x + entity.halfWidth >this.x && entity.y - entity.halfHeight < this.y && entity.y + entity.halfHeight >this.y) {
				this.remove = true;
				if (typeof entity.hit === 'function') {
					entity.hit(this);
				}
				else {
					console.log('projectile hit entity with no hit function defined');
					console.dir(entity);
				}
			}
		});
	}
});