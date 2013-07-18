/**
 * Keeps track of the time between frames
 *
 * TODO: expand with functionality to set custom timers
 *
 * @module timer
 * @class timer
 */

E.timer = (function() {
	"use strict";

	var timer = {};

	/**
	 * Starts the timer
	 *
	 * @method start
	 * @return this
	 */
	timer.start = function(goalFPS) {
		timer.interval = 1000 / goalFPS;
		timer.time = new Date().getTime();
		timer.goalFPS = goalFPS;
		timer.FPS = goalFPS;
		timer.coeff = 1;
		return this;
	};

	/**
	 * updates the timer
	 *
	 * @method process
	 * @return this
	 */
	timer.process = function() {
		var newTime = new Date().getTime();
		timer.interval = newTime - timer.time;
		timer.time = newTime;
		timer.FPS = 1000 / timer.interval;
		timer.coeff = timer.goalFPS / timer.FPS;
		return this;
	};

	return timer;
})();