var game = {
	mode: 'pause'
};

game.init = function() {
	console.log('game.init()');
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
	console.log('game.play');
	if (game.mode === 'play' || game.mode === 'over') {
		timer.process();
		entities.process();
		map.position(player.x, player.y);
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
	graphics.writeText('map.xOffset: '+map.xOffset, graphics.gameCanvas.width - 150, 50);
	graphics.writeText('map.yOffset: '+map.yOffset, graphics.gameCanvas.width - 150, 70);
	graphics.writeText('player.x: '+player.x, graphics.gameCanvas.width - 150, 90);
	graphics.writeText('player.y: '+player.y, graphics.gameCanvas.width - 150, 110);
	graphics.writeText('tile index: '+map.getTileIndex(player.x, player.y), graphics.gameCanvas.width - 150, 130);
};

game.pause = function() {
	console.log('game.pause()');
	game.mode = 'pause';
	input.start('pause');
	graphics.renderText();
};

game.over = function() {
	console.log('game.over()');
	game.mode = 'over';
	input.start('over');
};

game.reset = function() {
	console.log('game.reset()');
	entities.instances = [];
	cancelAnimationFrame(game.animationFrame);
	game.init();
};

game.end = function() {
	console.log('game.end()');
	game.pause();
	input.stop();
};

$(function() {
	game.init();
});