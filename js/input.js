var input = {};

input.keyMap = {
	'80': 'pause',
	'27': 'quit',
	'65': 'left',
	'87': 'up',
	'68': 'right',
	'83': 'down',
	'73': 'invulnerable'
};

input.start = function(mode) {
	$(document).off();
	switch (mode) {
		case 'play':
			input.keyState = {
				'pause': 0,
				'quit': 0,
				'left': 0,
				'up': 0,
				'right': 0,
				'down': 0
			};
			$(document).on('keydown keyup', function(e) {
				var key = ''+e.which;
				if (input.keyMap[key] !== undefined) {
					if (input.keyMap[key] === 'invulnerable' && e.type === 'keydown') {
						player.invulnerable = !player.invulnerable;
					}
					input.keyState[input.keyMap[key]] = ((e.type === 'keydown') ? 1 : 0);
					return false;
				}
			});
			input.mouseState = {
				'left': 0,
				'middle': 0,
				'right': 0,
				'x': 0,
				'y': 0
			};
			$(document).on('mousedown mouseup', function(e) {
				switch(e.which) {
					case 1:
						input.mouseState.left = ((e.type === 'mousedown') ? 1 : 0);
						break;
					case 2:
						input.mouseState.middle = ((e.type === 'mousedown') ? 1 : 0);
						break;
					case 3:
						input.mouseState.right = ((e.type === 'mousedown') ? 1 : 0);
						break;
				}
			});
			$(document).on('mousemove', function(e) {
				var canvasOffset = $('#gameCanvas').offset();
				input.mouseState.x = e.pageX - canvasOffset.left;
				input.mouseState.y = e.pageY - canvasOffset.top ;
			});
			break;
		case 'pause':
			$(document).off();
			$(document).on('keydown', function(e) {
				if (e.which === 32) { // space 
					game.resume();
				}
				return false;
			});
			break;
		case 'over':
			$(document).off();
			$(document).on('keydown', function(e) {
				if (e.which === 32) { // space 
					game.reset();
				}
				return false;
			});
	}
};

input.process = function() {
	if (game.mode === 'play') {
		if (input.keyState.pause) {
			game.pause();
		}
		if (input.keyState.quit) {
			game.end();
			graphics.writeText('Game ended.', 20, 30);
		}
		var dx = 0, dy = 0;
		if (input.keyState.left) dx += -5;
		if (input.keyState.up) dy += -5;
		if (input.keyState.right) dx += 5;
		if (input.keyState.down) dy += 5;
		if (dx !== 0 || dy !== 0) player.move(dx, dy);
		if (input.mouseState.left) player.fire(input.mouseState.x - map.xOffset, input.mouseState.y - map.yOffset);
	}
};

input.stop = function() {
	$(document).off();
};