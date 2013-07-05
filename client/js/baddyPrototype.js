E.baddyPrototype = (function() {
	"use strict";

	var baddyPrototype = E.actorPrototype.extend();

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
				this.targetTile = E.map.getTileIndex(player);
				this.target = $.extend({}, player, E.map.getTileCentre(this.targetTile));
				this.target.direction = E.vector.clone(player.direction);
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
					this.direction = E.vector.subtract(this, this.target);
					if (player.health > 0 && !this.baddySeePlayer()) {
						this.mode = 'chase';
					}
					break;
				case 'chase':
					distance = E.vector.distance(this, this.target);
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
					velocity = E.vector.setLength(this.direction, this.speed);
					if (!this.move(velocity)) { // if path is blocked
						this.mode = 'returnToStation';
					}
					break;
				case 'returnToStation':
					distance = E.vector.distance(this, this.initial);
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
		this.direction = E.vector.reverse(projectile.speed);
	};

	baddyPrototype.baddySeePlayer = function() {
		var targetVector = E.vector.subtract(this, player);
		if (E.vector.mag(targetVector) > this.maxRange || E.vector.dot(this.direction, targetVector) < 0) return false;
		return E.map.lineTraversable(this, player);
	};
	return baddyPrototype;
})();