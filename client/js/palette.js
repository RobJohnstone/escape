E.palette = (function() {
	"use strict";

	var map = E.map;

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