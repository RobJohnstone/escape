var E = {};

E.game = (function() {
	"use strict";

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

	game.init = function(mapName) {
		game.mode = 'edit';
		E.graphics.init(800, 600, false);
		E.map.load(mapName, '', 64, 64, game.start);
		E.palette.init();
	};

	game.start = function() {
		E.input.start('edit');
		game.update = true;
		game.animationFrame = window.requestAnimationFrame(game.main);
	};

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
	};

	game.info = (function() {
		var create = true;
		return function() {
			if (create) {
				$('#gameContainer').append('<div id="info"></div>');
				create = false;
			}
			$('#info').html('<p>'+game.info.items.join('<br />')+'</p>');
			game.info.items = [];
		};
	})();

	game.info.items = [];

	game.info.add = function(name, value) {
		if (arguments.length === 1) game.info.items.push(name+': '+E.util.valFromString(name));
		else if (arguments.length === 2) game.info.items.push(name+': '+value);
	};

	return game;
})();