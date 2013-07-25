/**
 * Command palette for the game editor
 *
 * @module palette
 * @class palette
 */

E.palette = (function() {
	"use strict";

	var map = E.map;

	var palette = {};

	palette.tools = {
		wall: {
			type: 'terrain',
			tilesetIndex: 1
		},
		floor: {
			type: 'terrain',
			tilesetIndex: 0
		},
		exit: {
			type: 'terrain',
			tilesetIndex: 2
		},
		player: {
			type: 'entity',
			/**
			 * Player tool
			 *
			 * @method tools.player.click
			 * @return palette
			 */
			click: function(tileIndex) {
				var coords = map.getTileCentre(tileIndex);
				map.playerStart = {
					x: coords.x,
					y: coords.y
				};
				E.game.reset();
				return palette;
			}
		},
		removeActor: {
			type: 'eraser',
			targetType: 'actor',
			/**
			 * Remove actor tool
			 *
			 * @method tools.removeActor.click
			 * @return palette
			 */
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
				return palette;
			}
		},
		baddy: {
			type: 'entity',
			/**
			 * Baddy tool
			 *
			 * @method tools.baddy.click
			 * @return palette
			 */
			click: function(tileIndex) {
				var baddy = map.getTileCentre(tileIndex);
				baddy.type = 'baddy';
				map.actors.push(baddy);
				map.init();
				E.game.update = true;
				return palette;
			}
		}
	};

	palette.currentTool = 'wall';

	/**
	 * Displays the command palette
	 *
	 * @method show
	 * @return this
	 */
	palette.show = function() {
		$('#palette').show();
		return this;
	};

	/**
	 * Hides the command palette
	 *
	 * @method hide
	 * @return this
	 */
	palette.hide = function() {
		$('#palette').hide();
		return this;
	};

	/**
	 * Initialises the command palette
	 *
	 * Includes a generic event handler for using the currently selected tool
	 *
	 * @method init
	 * @return this
	 */
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
				E.screen.update();
			}
		});
		return this;
	};

	/*
	 * Event handlers
	 *
	 * Event handlers bound after dom loaded
	 */
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
				$('#saveMap').text('Save');
			}
		}, '#saveMap');
	});

	return palette;
})();