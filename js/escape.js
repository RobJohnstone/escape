if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = window.mozRequestAnimationFrame;
}

var game = {
	mode: 'pause'
};

game.init = function() {
	graphics.init('fullscreen', '');
	map.load('test', '', 64, 64, game.start);
};

game.start = function() {
	console.log('game.start()');
	game.resume();
};

game.resume = function() {
	console.log('game.resume()');
	game.mode = 'play';
	input.start('play');
	timer.start(60);
	game.animationFrame = window.requestAnimationFrame(game.play);
};

game.play = function() {
	if (game.mode === 'play' || game.mode === 'over') {
		timer.process();
		entities.process();
		map.position(player.x, player.y);
		if (game.mode === 'over') {
			graphics.writeText('Game over!', 20, 30);
		}
		graphics.render();
		input.process();
		if (player.health <= 0 && game.mode === 'play') {
			game.over();
		}
		game.animationFrame = window.requestAnimationFrame(game.play);
	}
	else if (game.mode === 'pause') {
		graphics.writeText('Game paused. Press space to resume.', 20, 30);
		graphics.renderText();
	}
};

game.pause = function() {
	game.mode = 'pause';
	input.start('pause');
	graphics.renderText();
};

game.over = function() {
	game.mode = 'over';
	input.start('over');
};

game.reset = function() {
	entities.instances = [];
	game.init();
};

game.end = function() {
	game.pause();
	input.stop();
};

$(function() {
	game.init();
});