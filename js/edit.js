var E = {};

E.game = (function() {
	"use strict";

	var map = E.map;

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
		map.load(mapName, '', 64, 64, game.start);
		E.palette.init();
	};

	game.start = function() {
		E.input.start('edit');
		game.update = true;
		game.animationFrame = window.requestAnimationFrame(game.main);
	};

	game.main = function() {
		E.input.process();
		game.info.add('input.mouseState.x');
		game.info.add('input.mouseState.y');
		game.info.add('tile', map.getTileIndex(E.input.mouseState));
		game.info();
		map.highlightMouseTile();
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

E.palette = (function() {
	"use strict";

	var palette = {};

	palette.updatedMap = function() {
		$('#saveMap').text('Save map*');
		map.updated = true;
	};

	palette.tools = {
		wall: {
			type: 'terrain',
			tilesetIndex: 1
		},
		floor: {
			type: 'terrain',
			tilesetIndex: 0
		},
		player: {
			type: 'entity',
			click: function() {
				console.log('player');
			}
		},
		removeActor: {
			type: 'eraser',
			targetType: 'actor',
			click: function(tileIndex) {
				var coords = map.getTileCentre(tileIndex);
				for (var i=0; i<map.actors.length; i++) {
					if (map.actors[i].x === coords.x && map.actors[i].y === coords.y) {
						map.actors.splice(i, 1);
						E.entities.instances = [];
						map.init();
						E.game.update = true;
					}
				}
			}
		},
		baddy: {
			type: 'entity',
			click: function(tileIndex) {
				var baddy = map.getTileCentre(tileIndex);
				baddy.type = 'baddy';
				map.actors.push(baddy);
				map.init();
				E.game.update = true;
			}
		}
	};

	palette.currentTool = 'wall';

	palette.show = function() {
		$('#palette').show();
	};

	palette.hide = function() {
		$('#palette').hide();
	};

	palette.init = function() {
		palette.show();
		palette.$ = $('#palette');
		for (var toolName in palette.tools) {
			palette.$.append('<p class="tool" id="'+toolName+'">'+toolName+'<p>');
		}
		$('#'+palette.currentTool).addClass('selected');
		$('#gameCanvas').on({
			click: function() {
				var tileIndex = map.getTileIndex(E.input.mouseState),
					tilesetIndex;
				if (typeof palette.tools[palette.currentTool].click === 'function') {
					palette.tools[palette.currentTool].click(tileIndex);
				}
				else {
					tilesetIndex = palette.tools[palette.currentTool].tilesetIndex;
					map.data[tileIndex] = tilesetIndex;
					E.game.update = true;
				}
				palette.updatedMap();
			}
		});
	};

	$(function() {
		$('#palette').on({
			click: function() {
				var toolName = $(this).attr('id');
				$('.tool').removeClass('selected');
				$('#'+toolName).addClass('selected');
				palette.currentTool = toolName;
			}
		}, '.tool');
		$('#palette').on({
			click: function() {
				map.save();
				$('#saveMap').text('Save map');
				map.updated = false;
			}
		}, '#saveMap');
	});

	map.updated = false;
	window.onbeforeunload = function() {
		if (map.updated) {
			return 'You have unsaved changes. Are you sure you wish to leave?';
		}
	};
	return palette;
})();