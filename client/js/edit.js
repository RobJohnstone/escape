/** 
 * Code for the game editor
 *
 * @module game
 */

var E = {}; // global namespace object

/**
 * @class game
 */
E.game = (function() {
	"use strict";

	/**
	 * Event handlers for map selection screen
	 */
	$(function() {
		$('#load').click(function() {
			var map = $('#mapName').val();
			if (map.length === 0) {
				alert('You have not entered a map name');
			}
			else {
				game.init(map);
			}
		});
		$('#mapName').focus().select().on({
			keyup: function(e) {
				if (e.which === 13) {
					$('#load').click();
				}
			}
		});
	});

	var game = {};

	/**
	 * Carries out all initialisation actions
	 *
	 * @method init
	 * @param mapName {string}
	 * @return this
	 */
	game.init = function(mapName) {
		game.mode = 'edit';
		E.graphics.init(800, 600, false);
		E.map.load(mapName, 64, 64, game.start);
		E.palette.init();
		return this;
	};

	/**
	 * Starts any modules that need starting and then begins the game loop
	 *
	 * @method start
	 * @return this
	 */
	game.start = function() {
		E.input.start('edit');
		game.update = true;
		game.animationFrame = window.requestAnimationFrame(game.main);
		return this;
	};

	/**
	 * The body of the game loop
	 *
	 * @method main
	 * @return this
	 */
	game.main = function() {
		E.input.process();
		game.info.add('E.input.mouseState.x');
		game.info.add('E.input.mouseState.y');
		game.info.add('tile', E.map.getTileIndex(E.input.mouseState));
		game.info();
		E.map.highlightMouseTile();
		if (game.update) {
			E.graphics.render();
			game.update = false;
		}
		game.animationFrame = window.requestAnimationFrame(game.main);
		return this;
	};

	/**
	 * A singleton DOM element. On first call creates the DOM element. On all calls populates the DOM element with the items
	 * in the game.info.items array.
	 *
	 * @method info
	 * @return game {object}
	 */
	game.info = (function() {
		var create = true;
		return function() {
			if (create) {
				$('#gameContainer').append('<div id="info"></div>');
				create = false;
			}
			$('#info').html('<p>'+game.info.items.join('<br />')+'</p>');
			game.info.items = [];
			return game;
		};
	})();

	game.info.items = [];

	/**
	 * Adds an item to the game.info.items array. 
	 * If one argument, adds the variable name and value
	 * If two, adds both separated by a colon
	 *
	 * @method info.add
	 * @param name {string} The name of the value to be displayed (basically a label)
	 * @param value {string} The value to be displayed. If not a string, it will be coerced into one
	 * @return game {object}
	 */
	game.info.add = function(name, value) {
		if (arguments.length === 1) game.info.items.push(name+': '+E.util.valFromString(name));
		else if (arguments.length === 2) game.info.items.push(name+': '+value);
		return game;
	};

	return game;
})();