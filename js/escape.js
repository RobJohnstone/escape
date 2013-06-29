var game = {
	mode: 'pause'
};

game.init = function() {
	graphics.init('fullscreen', '');
	map.load('test', '', 64, 64, game.start);
};

game.start = function() {
	game.resume();
};

game.resume = function() {
	game.mode = 'play';
	input.start('play');
	timer.start(60);
	game.animationFrame = window.requestAnimationFrame(game.play);
};

game.play = function() {
	if (game.mode === 'play' || game.mode === 'over') {
		timer.process();
		entities.process();
		map.position(player);
		if (game.mode === 'over') {
			graphics.writeText('Game over!', 20, 30);
		}
		game.info();
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

game.info = function() {
	graphics.writeText('FPS: '+Math.round(timer.FPS), graphics.gameCanvas.width - 150, 30);
	graphics.writeText('map.offset.x: '+map.offset.x, graphics.gameCanvas.width - 150, 50);
	graphics.writeText('map.offset.y: '+map.offset.y, graphics.gameCanvas.width - 150, 70);
	graphics.writeText('player.x: '+player.x, graphics.gameCanvas.width - 150, 90);
	graphics.writeText('player.y: '+player.y, graphics.gameCanvas.width - 150, 110);
	graphics.writeText('player.direction.x: '+player.direction.x, graphics.gameCanvas.width - 150, 130);
	graphics.writeText('player.direction.y: '+player.direction.y, graphics.gameCanvas.width - 150, 150);
	graphics.writeText('player.direction angle: '+vector.angle(player.direction), graphics.gameCanvas.width - 200, 170);
	graphics.writeText('tile index: '+map.getTileIndex(player), graphics.gameCanvas.width - 150, 190);
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
	cancelAnimationFrame(game.animationFrame);
	game.init();
};

game.end = function() {
	game.pause();
	input.stop();
};

$(function() {
	game.init();
});