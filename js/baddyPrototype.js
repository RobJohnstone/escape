var baddyPrototype = $.extend(Object.create(actorPrototype), {
	firerId: (function() {
		var counter=-1; 
		return (function() {
			return counter++;
		})();
	})(),
	target: {x: 0, y: 0},
	process: function() {
		if (player.health <= 0) this.mode = 'watch';
		else {
			if (this.baddySeePlayer()) {
				this.targetTile = map.getTileIndex(player.x, player.y);
				this.target = map.getTileCentre(this.targetTile);
				this.target.direction = player.direction;
				this.targetDistance = Math.sqrt(this.target.x * this.target.x + this.target.y * this.target.y);
				this.fire(player.x, player.y);
				if(this.targetDistance > this.idealRange) {
					this.mode = 'chase';
				}
				else {
					this.mode = 'attack';
				}
			}
			switch (this.mode) {
				case 'attack':
					var dx = this.target.x - this.x,
						dy = this.y - this.target.y;
					this.direction = (dy < 0 ? Math.PI : 0) + Math.atan(dx/dy);
					if (player.health > 0 && !this.baddySeePlayer()) {
						this.mode = 'chase';
					}
					break;
				case 'chase':
					var distanceSquared = Math.pow(this.target.x - this.x, 2) + Math.pow(this.target.y - this.y, 2);
					if (distanceSquared < this.speed * this.speed) {
						this.x = this.target.x;
						this.y = this.target.y;
						this.mode = 'watch';
						this.direction = this.target.direction;
					}
					else {
						this.moveTo(this.target.x, this.target.y);
					}
					break;
			}
		}
	},
	baddySeePlayer: function() {
		if (vector.distance(this.x, this.y, player.x, player.y) > this.maxRange) return false;
		return map.lineTraversable(this.x, this.y, player.x, player.y);
	}
});