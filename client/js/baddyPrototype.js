var E = E || {};

/**
 * Prototype for all baddies. Inherits from actor prototype
 *
 * For more information on how Escape uses inheritance see objectPrototype.js
 *
 * @module baddyPrototype
 * @class baddyPrototype
 * @extends actorPrototype
 */
E.baddyPrototype = (function() {
	"use strict";

	var baddyPrototype = E.actorPrototype.extend();

	baddyPrototype.target = {x: 0, y: 0}; // note that currently all baddies share the same target as objects are passed by reference. This is fine as there's only one player. If it becomes necessary to change this it is probably best done in Object.prototype.extend()
	baddyPrototype.alertState = 0;

	/**
	 * Defines the action to be taken by baddies each frame
	 *
	 * @method process
	 * @return this
	 */
	baddyPrototype.process = function() {
		this.speed = this.speed || this.runVel;
		if (E.player.health <= 0) this.mode = 'watch';
		else if (this.baddySeePlayer()) {
			this.setTarget(E.player);
			this.fire(E.player);
			if(this.targetDistance > this.idealRange) {
				this.mode = 'chase';
			}
			else {
				this.mode = 'attack';
			}
		}
		this.processOrders();
		return this;
	};

	/**
	 * Determines whether or not the baddy is alert and therefore how quickly he reacts
	 *
	 * @return {boolean} true is alert, false otherwise
	 */
	baddyPrototype.alert = function() {
		if (this.alertState >= 1) {
			return true;
		}
		else {
			this.alertState += 0.2 / E.timer.FPS;
			return false;
		}
	};

	/**
	 * Takes the current orders and calls the appropriate function in the appropriate context
	 *
	 * @method processOrders
	 * @param orders string indicating the current orders
	 * @return this
	 */
	baddyPrototype.processOrders = function() {
		this.orders[this.mode].call(this);
		return this;
	};

	baddyPrototype.orders = {};

	/**
	 * The baddy's default state. Currently does nothing
	 *
	 * @method orders.watch
	 * @return baddyPrototype
	 */
	baddyPrototype.orders.watch = function() {
		return baddyPrototype;
	};

	/**
	 * Baddy attacks its target. If the baddy can no longer see the target it gives chase
	 *
	 * @method orders.attack
	 * @return baddyPrototype
	 */
	baddyPrototype.orders.attack = function() {
		this.direction = E.vector.subtract(this, this.target);
		if (E.player.health > 0 && !this.baddySeePlayer()) {
			this.mode = 'chase';
		}
		return baddyPrototype;
	};

	/**
	 * Baddy chases after target based upon its last known location
	 * If the baddy gets to this location and still cannot see the player
	 * it goes into search mode
	 *
	 * @method orders.chase
	 * @return baddyPrototype
	 */
	baddyPrototype.orders.chase = function() {
		var distance = E.vector.distance(this, this.target);
		this.run();
		if (distance < this.speed) {
			this.x = this.target.x;
			this.y = this.target.y;
			this.mode = 'search';
			this.direction = this.target.direction;
		}
		else {
			this.moveTo(this.target);
		}
		return baddyPrototype;
	};

	/**
	 * The baddy searches for the target by heading off in the direction the target
	 * was last seen moving
	 *
	 * @method orders.search
	 * @return baddyPrototype
	 */
	baddyPrototype.orders.search = function() {
		var velocity = E.vector.setLength(this.direction, this.speed);
		this.walk();
		if (!this.move(velocity)) { // if path is blocked
			this.mode = 'returnToStation';
		}
		return baddyPrototype;
	};

	/**
	 * The baddy returns to its start location. It then enters watch mode
	 *
	 * @method orders.returnToStation
	 * @return baddyPrototype
	 */
	baddyPrototype.orders.returnToStation = function() {
		var distance = E.vector.distance(this, this.initial);
		this.walk();
		if (distance < this.speed) {
			this.x = this.initial.x;
			this.y = this.initial.y;
			this.mode = this.initial.mode;
			this.direction = this.initial.direction;
		}
		else {
			this.moveTo(this.initial);
		}
		return baddyPrototype;
	};

	/**
	 * The baddy goes to its current waypoint, then reverts to its original orders
	 *
	 * @method orders.goto
	 * @return baddyPrototype
	 */
	baddyPrototype.orders.goto = function() {
		var to = E.map.getTileCentre(this.patrolRoute[this.currentWaypoint]),
			distance = E.vector.distance(this, to);
		if (distance < this.speed) {
			this.x = to.x;
			this.y = to.y;
			this.mode = this.initial.mode;
		}
		else {
			this.moveTo(to);
		}
		return baddyPrototype;
	};

	/**
	 * The baddy patrols between a series of waypoints. When the baddy gets to the end, he returns directly to the first way point and starts again
	 *
	 * @method orders.patrol
	 * @return baddyPrototype
	 */
	baddyPrototype.orders.patrol = function() {
		if (!this.patrolRoute) {
			throw new Error('This baddy does not have a patrol route specified');
		}
		this.walk();
		this.currentWaypoint = (this.currentWaypoint === undefined) ? 0 : this.currentWaypoint + 1;
		if (this.currentWaypoint >= this.patrolRoute.length) {
			this.currentWaypoint = 0;
			this.mode = 'returnToStation';
		}
		else {
			this.mode = 'goto';
		}
		return baddyPrototype;
	};

	/**
	 * The baddy's reaction to being hit
	 *
	 * @method hitHandler
	 * @param projectile the object the baddy has been hit by
	 * @return this
	 */
	baddyPrototype.hitHandler = function(projectile) {
		if (!this.remove) {
			this.direction = E.vector.reverse(projectile.speed);
		}
		return this;
	};

	/**
	 * Checks if the baddy can see the player
	 *
	 * @method baddySeePlayer
	 * @return boolean
	 */
	baddyPrototype.baddySeePlayer = function() {
		var targetVector = E.vector.subtract(this, E.player);
		if (E.vector.mag(targetVector) > this.maxRange || E.vector.dot(this.direction, targetVector) < 0) return false;
		return E.map.lineTraversable(this, E.player);
	};

	/**
	 * sets the baddy's target and other target related information
	 *
	 * @method setTarget
	 * @return this
	 */
	baddyPrototype.setTarget = function(target) {
		this.targetTile = E.map.getTileIndex(target);
		this.target = $.extend({}, target, E.map.getTileCentre(this.targetTile));
		this.target.direction = E.vector.clone(target.direction);
		return this;
	};

	/**
	 * Renders the current patrol route
	 *
	 * @method renderPatrolRoute
	 * @return this
	 */
	baddyPrototype.renderPatrolRoute = function() {
		var route = this.patrolRoute;
		if (route) {
			for (var i=0, len=route.length-1; i<len; i++) {
				E.graphics.vectors.line(E.map.getTileCentre(route[i]), E.map.getTileCentre(route[i+1]), 'red', true);
			}
		}
		return this;
	};

	/**
	 * Makes the baddy walk rather than run
	 *
	 * @method walk
	 * @return this
	 */
	baddyPrototype.walk = function() {
		this.speed = this.walkVel;
		return this;
	};

	/**
	 * Makes the baddy run rather than walk
	 *
	 * @method run
	 * @return this;
	 */
	baddyPrototype.run = function() {
		this.speed = this.runVel;
		return this;
	};

	return baddyPrototype;
})();