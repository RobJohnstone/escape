/**
 * ESCAPE
 *
 * The game entry point code and loop 
 *
 * @module game
 */

var E = {}; // global namespace object

/**
 * @class game
 */
E.game = (function() {
	"use strict";

	var game = {
		mode: 'pause'
	};

	/**
	 * Initialise all required modules
	 *
	 * @method init
	 * @return this
	 */
	game.init = function() {
		E.graphics.init('fullscreen', '');
		E.map.load('test', 64, 64, game.start);
		return this;
	};

	/**
	 * Start the game
	 *
	 * @method start
	 * @return this
	 */
	game.start = function() {
		game.resume();
	};

	/**
	 * Resume the game (either from scratch of from paused)
	 * Starts all required modules and starts the game loop
	 *
	 * @method resume
	 * @return this
	 */
	game.resume = function() {
		game.mode = 'play';
		E.input.start('play');
		E.timer.start(60);
		game.animationFrame = window.requestAnimationFrame(game.play);
	};

	/**
	 * The body of the game loop
	 *
	 * @method play
	 * @return this
	 */
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
		return this;
	};

	/**
	 * Displays debugging info and stats on the screen
	 *
	 * @method info
	 * @return this
	 */
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
		return this;
	};

	/**
	 * Pauses the game
	 *
	 * @method pause
	 * @return this
	 */
	game.pause = function() {
		game.mode = 'pause';
		E.input.start('pause');
		E.graphics.renderText();
		return this;
	};

	/**
	 * Action to take when the game is over
	 *
	 * @method over
	 * @return this
	 */
	game.over = function() {
		game.mode = 'over';
		E.input.start('over');
		return this;
	};

	/**
	 * Resets game state in order to allow a new game to start
	 *
	 * @method reset
	 * @return this
	 */
	game.reset = function() {
		E.entities.instances = [];
		cancelAnimationFrame(game.animationFrame);
		game.init();
		return this;
	};

	/**
	 * End the game
	 *
	 * @method end 
	 * @return this
	 */
	game.end = function() {
		game.pause();
		E.input.stop();
		return this;
	};

	/**
	 * Code entry point
	 */
	$(function() {
		game.init();
	});

	return game;
})();