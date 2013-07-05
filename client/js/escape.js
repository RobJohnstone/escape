var E = {};

E.game = (function() {
	"use strict";

	var game = {
		mode: 'pause'
	};

	game.init = function() {
		E.graphics.init('fullscreen', '');
		E.map.load('test', '', 64, 64, game.start);
	};

	game.start = function() {
		game.resume();
	};

	game.resume = function() {
		game.mode = 'play';
		E.input.start('play');
		E.timer.start(60);
		game.animationFrame = window.requestAnimationFrame(game.play);
	};

	game.play = function() {
		if (game.mode === 'play' || game.mode === 'over') {
			E.timer.process();
			E.entities.process();
			E.map.position(player);
			if (game.mode === 'over') {
				E.graphics.writeText('Game over!', 20, 30);
			}
			game.info();
			E.graphics.render();
			E.input.process();
			if (player.health <= 0 && game.mode === 'play') {
				game.over();
			}
			game.animationFrame = window.requestAnimationFrame(game.play);
		}
		else if (game.mode === 'pause') {
			E.graphics.writeText('Game paused. Press space to resume.', 20, 30);
			E.graphics.renderText();
		}
	};

	game.info = function() {
		E.graphics.writeText('FPS: '+Math.round(E.timer.FPS), E.graphics.gameCanvas.width - 150, 30);
		E.graphics.writeText('map.offset.x: '+E.map.offset.x, E.graphics.gameCanvas.width - 150, 50);
		E.graphics.writeText('map.offset.y: '+E.map.offset.y, E.graphics.gameCanvas.width - 150, 70);
		E.graphics.writeText('player.x: '+player.x, E.graphics.gameCanvas.width - 150, 90);
		E.graphics.writeText('player.y: '+player.y, E.graphics.gameCanvas.width - 150, 110);
		E.graphics.writeText('player.direction.x: '+player.direction.x, E.graphics.gameCanvas.width - 150, 130);
		E.graphics.writeText('player.direction.y: '+player.direction.y, E.graphics.gameCanvas.width - 150, 150);
		E.graphics.writeText('player.direction angle: '+E.vector.angle(player.direction), E.graphics.gameCanvas.width - 200, 170);
		E.graphics.writeText('tile index: '+E.map.getTileIndex(player), E.graphics.gameCanvas.width - 150, 190);
	};

	game.pause = function() {
		game.mode = 'pause';
		E.input.start('pause');
		E.graphics.renderText();
	};

	game.over = function() {
		game.mode = 'over';
		E.input.start('over');
	};

	game.reset = function() {
		E.entities.instances = [];
		cancelAnimationFrame(game.animationFrame);
		game.init();
	};

	game.end = function() {
		game.pause();
		E.input.stop();
	};

	$(function() {
		game.init();
	});

	return game;
})();