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
		saveMap: {
			panel: 'file',
			html: '<div id="saveMap" class="save paletteTool">Save</div>'
		},
		exitMap: {
			panel: 'file',
			html: '<div class="back paletteTool">Exit</div>'
		},
		wall: {
			panel: 'tools',
			tilesetIndex: 1
		},
		floor: {
			panel: 'tools',
			tilesetIndex: 0
		},
		exit: {
			panel: 'tools',
			tilesetIndex: 2
		},
		player: {
			panel: 'tools',
			/**
			 * Player tool
			 *
			 * @method tools.player.click
			 * @return palette
			 */
			click: function(tileIndex) {
				var player = map.getTileCentre(tileIndex);
				player.type = 'player';
				map.actors.push(player);
				E.game.reset();
				return palette;
			}
		},
		removeActor: {
			panel: 'tools',
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
						E.game.reset();
						break;
					}
				}
				return palette;
			}
		},
		baddy: {
			panel: 'tools',
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
				E.game.reset();
				return palette;
			}
		},
		select: {
			panel: 'tools',
			/**
			 * Selects a map tile or entity
			 *
			 * @method tools.select.click
			 * @return palette
			 */
			click: function(tileIndex) {
				var selectedEntity, properties = {};
				palette.selected = {};
				E.entities.instances.some(function(entity, index) {
					if (map.getTileIndex(entity) === tileIndex) {
						palette.selected.entity = entity;
						selectedEntity = entity;
						return true;
					}
				});
				palette.selected.tileIndex = tileIndex;
				if (selectedEntity) {
					properties = {
						type: selectedEntity.type,
						x: selectedEntity.x,
						y: selectedEntity.y,
						maxRange: selectedEntity.maxRange,
						mode: selectedEntity.mode,
						entityId: selectedEntity.entityId,
						dirX: selectedEntity.direction.x,
						dirY: selectedEntity.direction.y
					};
				}
				palette.setProperties(properties);
				E.game.update = true;
				return palette;
			},

			/**
			 * Highlights the selected tile
			 *
			 * @method tools.select.render
			 * @return palette
			 */
			render: function() {
				if (palette.selected && palette.selected.tileIndex !== undefined) {
					map.highlightTile(palette.selected.tileIndex, 'orange');
				}
				return palette;
			}
		},
		rotate: {
			panel: 'tools',
			/**
			 * rotates the selected object
			 *
			 * @method tools.rotate.click
			 * @return palette
			 */
			click: function(tileIndex) {
				if (palette.selected && palette.selected.entity !== undefined) {
					var mouse = E.input.mouseState,
						diff = E.vector.subtract(palette.selected.entity, mouse),
						xAxis = {x:1, y:0},
						angle = E.vector.angle(xAxis, diff, true);
					palette.selected.entity.direction = E.vector.angleToVector(angle);
					E.game.update = true;
					return palette;
				}
				else {
					alert('Please select an entity first');
				}
			},

			/**
			 * Draws a line from the selected entity to the current mouse cursor position
			 *
			 * @method tools.rotate.render
			 * @return palette
			 */
			render: function() {
				if (palette.selected && palette.selected.entity !== undefined) {
					E.graphics.vectors.line(palette.selected.entity, E.input.mouseState);
				}
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
	 * Changes the current tool
	 *
	 * @method changeTool
	 * @return this
	 */
	palette.changeTool = function(toolName) {
		palette.prevTool = palette.currentTool;
		$('.paletteTool').removeClass('selected');
		$('#'+toolName).addClass('selected');
		palette.currentTool = toolName;
		return this;
	};

	/**
	 * Makes the previously current tool the active one
	 *
	 * @method relinquishTool
	 * @return this
	 */
	palette.relinquishTool = function() {
		palette.changeTool(palette.prevTool);
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
		var template = $('#paletteTemplate').text().trim(),
			compiled = _.template(template),
			tools = {
				file: {},
				tools: {}
			};
		for (var toolName in palette.tools) {
			switch (palette.tools[toolName].panel) {
				case 'file':
					tools.file[toolName] = palette.tools[toolName];
					break;
				case 'tools':
					tools.tools[toolName] = palette.tools[toolName];
					break;
				default:
					throw new Error('The panel "'+palette.tools[toolName].panel+'" for the '+toolName+' tool does not exist');
			}
		}
		$('#palette').html(compiled(tools));
		palette.show();
		$('#'+palette.currentTool).addClass('selected');
		$('#gameCanvas').on({
			click: function() {
				var tileIndex = map.getTileIndex(E.input.mouseState),
					tilesetIndex;
				if (typeof palette.tools[palette.currentTool].click === 'function') {
					palette.tools[palette.currentTool].click(tileIndex);
				}
				else if (typeof palette.tools[palette.currentTool].html !== 'string') {
					tilesetIndex = palette.tools[palette.currentTool].tilesetIndex;
					map.data[tileIndex] = tilesetIndex;
					E.game.reset();
				}
				E.screen.update();
			}
		});
		return this;
	};

	/**
	 * Sets the properties that are to be displayed in the properties panel
	 *
	 * @method setProperties
	 * @param properties {object} The properties to be set. Note that all properties must be primatives (not objects)
	 * @return this
	 */
	palette.setProperties = function(properties) {
		var template = $('#palettePropertiesTemplate').text().trim(),
			compiled = _.template(template),
			propObj = {
				properties: properties
			};
		$('#propertiesPanel').html(compiled(propObj));
		return this;
	};

	/**
	 * Carries out rendering actions on behalf of palette tools
	 *
	 * @method render
	 * @return this
	 */
	palette.render = function() {
		if (palette.selected) {
			palette.tools.select.render();
		}
		if (palette.currentTool && palette.currentTool !== 'select' && typeof palette.tools[palette.currentTool].render === 'function') {
			palette.tools[palette.currentTool].render();
		}
		return this;
	};

	/*
	 * Event handlers
	 *
	 * Event handlers bound after dom loaded
	 */
	$(function() {
		$('#palette').on('click', '.paletteTool', function() {
			var toolName = $(this).attr('id');
			palette.changeTool(toolName);
		});
		$('#palette').on('click', '#saveMap', function() {
			map.save();
		});
	});

	return palette;
})();