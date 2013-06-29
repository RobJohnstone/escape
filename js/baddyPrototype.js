var baddyPrototype = Object.create(actorPrototype);

baddyPrototype.firerId = (function() {
	var counter=-1;
	return (function() {
		return counter++;
	})();
})();

baddyPrototype.target = {x: 0, y: 0};

baddyPrototype.process = function() {
	if (player.health <= 0) this.mode = 'watch';
	else {
		if (this.baddySeePlayer()) {
			this.targetTile = map.getTileIndex(player);
			this.target = map.getTileCentre(this.targetTile);
			this.target.direction = vector.clone(player.direction);
			this.targetDistance = vector.distance(this, this.target);
			this.fire(player);
			if(this.targetDistance > this.idealRange) {
				this.mode = 'chase';
			}
			else {
				this.mode = 'attack';
			}
		}
		switch (this.mode) {
			case 'watch':
				// currently do nothing
				break;
			case 'attack':
				this.direction = vector.subtract(this, this.target);
				if (player.health > 0 && !this.baddySeePlayer()) {
					this.mode = 'chase';
				}
				break;
			case 'chase':
				if (this.targetDistance < this.speed) {
					this.x = this.target.x;
					this.y = this.target.y;
					this.mode = 'watch';
					this.direction = this.target.direction;
				}
				else {
					this.moveTo(this.target);
				}
				break;
		}
	}
};

baddyPrototype.baddySeePlayer = function() {
	var targetVector = vector.subtract(this, player);
	if (vector.mag(targetVector) > this.maxRange || vector.dot(this.direction, targetVector) < 0) return false;
	return map.lineTraversable(this, player);
};