var timer = {};

timer.start = function(goalFPS) {
	timer.interval = 1000 / goalFPS;
	timer.time = new Date().getTime();
	timer.goalFPS = goalFPS;
	timer.FPS = goalFPS;
	timer.coeff = 1;
};

timer.process = function() {
	var newTime = new Date().getTime();
	timer.interval = newTime - timer.time;
	timer.time = newTime;
	timer.FPS = 1000 / timer.interval;
	timer.coeff = timer.goalFPS / timer.FPS;
};