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
	 * @param mapName {string} the filename of the map minus the file extension
	 * @param start {boolean} Whether or not to start the game once the map has loaded (defaults to true)
	 * @return this
	 */
	game.init = function(mapName, start) {
		var callback = (start || start === undefined) ? game.start : null;
		E.graphics.init('fullscreen', '');
		E.map.load(mapName, callback);
		return this;
	};

	/**
	 * Start the game
	 *
	 * @method start
	 * @return this
	 */
	game.start = function() {
		if (!E.graphics.clipping) {
			E.graphics.resizeCanvas('game', map.tileWidth * map.columns, map.tileHeight * map.rows);
		}
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
			E.map.position(E.player);
			if (game.mode === 'over') {
				E.graphics.writeText('Game over!', 20, 30);
			}
			game.info();
			E.graphics.render();
			E.input.process();
			if (E.player.health <= 0 && game.mode === 'play') {
				game.over();
			}
			game.animationFrame = window.requestAnimationFrame(game.play);
		}
		else if (game.mode === 'pause') {
			//E.graphics.writeText('Game paused. Press space to resume.', 20, 30);
			E.graphics.renderText();
		}
		else if (game.mode === 'mapComplete') {
			game.mapComplete();
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
		E.graphics.writeText('player.x: '+E.player.x, E.graphics.gameCanvas.width - 150, 90);
		E.graphics.writeText('player.y: '+E.player.y, E.graphics.gameCanvas.width - 150, 110);
		E.graphics.writeText('player.direction.x: '+E.player.direction.x, E.graphics.gameCanvas.width - 150, 130);
		E.graphics.writeText('player.direction.y: '+E.player.direction.y, E.graphics.gameCanvas.width - 150, 150);
		E.graphics.writeText('player.direction angle: '+E.vector.angle(E.player.direction), E.graphics.gameCanvas.width - 200, 170);
		E.graphics.writeText('tile index: '+E.map.getTileIndex(E.player), E.graphics.gameCanvas.width - 150, 190);
		return this;
	};

	/**
	 * Pauses the game
	 *
	 * @method pause
	 * @return this
	 */
	game.pause = function(msg) {
		msg = msg || 'Game paused. Press space to resume.';
		game.mode = 'pause';
		E.input.start('pause');
		E.graphics.writeText(msg, 20, 30);
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
	 * Action to take when map complete
	 *
	 * @method mapComplete
	 * @return this
	 */
	game.mapComplete = function() {
		if (E.campaign.current < E.campaign.data.maps.length -1) {
			E.campaign.current++;
			game.reset(false);
			E.screen.change('mapScreen');
		}
		else {
			game.end('');
			E.screen.change('campaignSuccess');
		}
	};

	/**
	 * Resets game state in order to allow a new game to start
	 *
	 * @method reset
	 * @param start {boolean} Whether or not to start the game once the map has loaded (defaults to true)
	 * @return this
	 */
	game.reset = function(start) {
		E.entities.instances = [];
		cancelAnimationFrame(game.animationFrame);
		game.init(E.campaign.getCurrentmap(), start);
		return this;
	};

	/**
	 * End the game
	 *
	 * @method end 
	 * @return this
	 */
	game.end = function(msg) {
		msg = msg || 'The game has ended';
		game.pause(msg);
		E.input.stop();
		return this;
	};

	/*
	 * Code entry point
	 */
	$(function() {
		E.screen.init('campaignScreen');
		E.campaign.load('Escape', function() {
			game.init(E.campaign.getCurrentmap(), false);
		});

		// event handlers
		$('body').on('click', '#campaignStart', function() {
			E.screen.change('mapScreen');
		});
		$('body').on('click', '#playMap', function() {
			E.screen.change('gameContainer');
			game.start();
		});
	});
	util.onVisibilityChange(function() {
		E.game.pause();
	});

	return game;
})();