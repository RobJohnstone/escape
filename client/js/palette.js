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
			immediate: true,
			html: '<div id="saveMap" class="save paletteTool">Save</div>'
		},
		exitMap: {
			panel: 'file',
			immediate: true,
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
				palette.refresh();
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
				var entity;
				if (palette.selected) {
					entity = palette.selected.entity;
					if (palette.selected.tileIndex !== undefined) {
						map.highlightTile(palette.selected.tileIndex, 'orange');
						if (entity && entity.renderPatrolRoute) {
							entity.renderPatrolRoute();
						}
					}
				}
				return palette;
			}
		},
		rotate: {
			panel: 'tools',
			testPreconditions: function() {
				return !!(palette.selected && palette.selected.entity);
			},
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
		},
		expand: {
			panel: 'tools',
			/**
			 * Adds an extra row / column to the side of the map closest to the cursor
			 *
			 * @method tools.expand.click
			 * @return palette
			 */
			click: function() {
				var delta = {};
				delta[map.sideClosestToCursor()] = 1;
				map.resize(delta);
				E.game.update = true;
				return palette;
			},

			/**
			 * Sets the mouse cursor to an arrow indicating which side will be expanded
			 *
			 * @method tools.expand.render
			 * @return palette;
			 */
			render: function() {
				var cursorStyles = {
					top: 'n-resize',
					right: 'e-resize',
					bottom: 's-resize',
					left: 'w-resize'
				}, side = map.sideClosestToCursor();
				E.input.setMouseCursor(cursorStyles[side]);
				return palette;
			}
		},
		reduce: {
			panel: 'tools',
			/**
			 * Removes a row / column from the side of the map closest to the cursor
			 *
			 * @method tools.reduce.click
			 * @return palette
			 */
			click: function() {
				var delta = {};
				delta[map.sideClosestToCursor()] = -1;
				map.resize(delta);
				E.game.update = true;
				return palette;
			},

			/**
			 * Sets the mouse cursor to an arrow indicating which side will be expanded
			 *
			 * @method tools.reduce.render
			 * @return palette;
			 */
			render: function() {
				var cursorStyles = {
					top: 'n-resize',
					right: 'e-resize',
					bottom: 's-resize',
					left: 'w-resize'
				}, side = map.sideClosestToCursor();
				E.input.setMouseCursor(cursorStyles[side]);
				switch (side) {
					case 'top':
						E.graphics.vectors.rect({x: 0, y: 0}, {x: E.map.tileWidth * E.map.columns, y: E.map.tileHeight}, 'red');
						break;
					case 'right':
						E.graphics.vectors.rect({x: E.map.tileWidth * (E.map.columns-1), y: 0}, {x: E.map.tileWidth, y: E.map.tileHeight * E.map.rows}, 'red');
						break;
					case 'bottom':
						E.graphics.vectors.rect({x: 0, y: E.map.tileHeight * (E.map.rows-1)}, {x: E.map.tileWidth * E.map.columns, y: E.map.tileHeight}, 'red');
						break;
					case 'left':
						E.graphics.vectors.rect({x: 0, y: 0}, {x: E.map.tileWidth, y: E.map.tileHeight * E.map.rows}, 'red');
						break;
				}
				return palette;
			}
		},
		patrol: {
			panel: 'tools',
			testPreconditions: function() {
				return !!(palette.selected && palette.selected.entity && palette.selected.entity.renderPatrolRoute);
			},

			/**
			 * Initialises the patrol tool by clearing the currently selected entity's patrol route
			 *
			 * @method init
			 * @return palette
			 */
			init: function() {
				if (palette.selected && palette.selected.entity !== undefined) {
					var entity = palette.selected.entity;
					entity.patrolRoute = [map.getTileIndex(entity)];
					E.game.update = true;
				}
				return palette;		
			},

			/**
			 * Sets a patrol route for an actor
			 *
			 * @method tools.patrol.click
			 * @return palette
			 */
			click: function() {
				if (palette.selected && palette.selected.entity !== undefined) {
					var entity = palette.selected.entity;
					if (entity.patrolRoute === undefined) {
						entity.patrolRoute = [map.getTileIndex(entity)];
					}
					entity.patrolRoute.push(map.getTileIndex(E.input.mouseState));
					entity.mode = 'patrol';
					E.game.update = true;
					return palette;
				}
			},
			/**
			 * Displays the patrol route
			 *
			 * @method tools.patrol.render
			 * @return palette
			 */
			render: function() {
				var entity = palette.selected.entity,
					lineStart,
					lineEnd;
				if (palette.selected && palette.selected.entity !== undefined) {
					lineStart = map.getTileCentre(entity.patrolRoute.slice(-1)[0]);
					lineEnd = map.getTileCentre(map.getTileIndex(E.input.mouseState));
					E.graphics.vectors.line(lineStart, lineEnd, 'grey', true);
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
		var toolObj = palette.tools[toolName];
		if (typeof toolObj.init === 'function') {
			toolObj.init();
		}
		if (toolObj.immediate) {
			if (toolObj.click) toolObj.click();
			E.screen.update();
		}
		else {
			palette.prevTool = palette.currentTool;
			palette.currentTool = toolName;
			palette.refresh();
			$('.paletteTool').removeClass('selected');
			$('#'+toolName).addClass('selected');
		}
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
		palette.refresh();
		palette.show();
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

	/**
	 * refreshes the display of the palette
	 *
	 * @method refresh
	 * @return this
	 */
	palette.refresh = function() {
		var template = $('#paletteTemplate').text().trim(),
			compiled = _.template(template),
			tools = {
				file: {},
				tools: {}
			},
			testPreconditions;
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
			testPreconditions = palette.tools[toolName].testPreconditions; 
			if (typeof testPreconditions === 'function' && !testPreconditions()) {
				tools[palette.tools[toolName].panel][toolName].disabled = true;
			}
			else {
				tools[palette.tools[toolName].panel][toolName].disabled = false;
			}
		}
		$('#palette').html(compiled(tools));
		$('#'+palette.currentTool).addClass('selected');
		return this;
	};

	/*
	 * Event handlers
	 *
	 * Event handlers bound after dom loaded
	 */
	$(function() {
		$('#palette').on('click', '.paletteTool', function() {
			if (!$(this).hasClass('disabled')) {
				var toolName = $(this).attr('id');
				if (toolName) palette.changeTool(toolName);
			}
		});
		$('#palette').on('click', '#saveMap', function() {
			map.save();
		});
	});

	return palette;
})();