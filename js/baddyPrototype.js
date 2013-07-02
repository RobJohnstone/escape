var baddyPrototype = actorPrototype.create();

baddyPrototype.firerId = (function() {
	var counter=-1;
	return (function() {
		return counter++;
	})();
})();

baddyPrototype.target = {x: 0, y: 0};

baddyPrototype.process = function() {
	var distance, velocity;
	if (player.health <= 0) this.mode = 'watch';
	else {
		if (this.baddySeePlayer()) {
			this.targetTile = map.getTileIndex(player);
			/*this.target = map.getTileCentre(this.targetTile);*/
			this.target = $.extend({}, player, map.getTileCentre(this.targetTile));
			this.target.direction = vector.clone(player.direction);
			//this.targetDistance = vector.distance(this, this.target);
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
				distance = vector.distance(this, this.target);
				if (distance < this.speed) {
					this.x = this.target.x;
					this.y = this.target.y;
					this.mode = 'search';
					this.direction = this.target.direction;
				}
				else {
					this.moveTo(this.target);
				}
				break;
			case 'search':
				velocity = vector.setLength(this.direction, this.speed);
				if (!this.move(velocity)) { // if path is blocked
					this.mode = 'returnToStation';
				}
				break;
			case 'returnToStation':
				distance = vector.distance(this, this.initial);
				if (distance < this.speed) {
					this.x = this.initial.x;
					this.y = this.initial.y;
					this.mode = 'watch';
					this.direction = this.initial.direction;
				}
				else {
					this.moveTo(this.initial);
				}
				break;
		}
	}
};

baddyPrototype.hitHandler = function(projectile) {
	this.direction = vector.reverse(projectile.speed);
};

baddyPrototype.baddySeePlayer = function() {
	var targetVector = vector.subtract(this, player);
	if (vector.mag(targetVector) > this.maxRange || vector.dot(this.direction, targetVector) < 0) return false;
	return map.lineTraversable(this, player);
};