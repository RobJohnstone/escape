/**
 * Editor Tools
 *
 * Each tools requires a label {String} and may contain any of the following methods
 *
 * execute: invoked when a command is clicked. Does not change the current tool. E.g. save
 * select: invoked when a command is clicked. Will also result in the tool being made the current tool
 * use: invoked when clicking on the map. If this tool is the current tool then this method will be invoked
 * render: renders the map overlay for this tool if is the currently selected tool
 *
 * @module edit
 * @class tools
 */

E.edit.tools = (function() {
	"use strict";

	var tools = {},
		map = E.map;

	/**
	 * Saves the map
	 */
	tools.save = {
		label: 'Save',
		execute: function() {
			map.save();
			E.screen.save();
		}
	};

	/**
	 * Quits the editor and goes back to the map screen
	 */
	tools.exit = {
		label: 'Exit',
		execute: E.screen.previous
	};

	/**
	 * Sets the player start location
	 * If one already exists, the old one is removed
	 */
	tools.player = {
		label: 'Player',
		select: function() {},
		use: function(tileIndex) {
			var actors = E.map.mapObj.actors;
			var player = map.getTileCentre(tileIndex);
			player.type = 'player';
			actors = actors.filter(function(actor) {
				return actor.type !== 'player';
			});
			actors.push(player);
			E.map.mapObj.actors = actors;
			E.map.init();
			E.game.update = true;
		}
	};

	/**
	 * Removes an actor from the map
	 */
	tools.removeActor = {
		label: 'Remove actor',
		select: function() {},
		use: function(tileIndex) {
			var coords = map.getTileCentre(tileIndex),
				mapObj = E.map.mapObj;
			for (var i=0; i<mapObj.actors.length; i++) {
				if (mapObj.actors[i].x === coords.x && mapObj.actors[i].y === coords.y) {
					mapObj.actors.splice(i, 1);
					E.map.init();
					E.game.update = true;
					break;
				}
			}
		}
	};

	/**
	 * Adds a baddy to the map
	 */
	tools.baddy = {
		label: 'Baddy',
		select: function() {},
		use: function(tileIndex) {
			var baddy = map.getTileCentre(tileIndex);
			baddy.type = 'baddy';
			E.map.mapObj.actors.push(baddy);
			E.map.init();
			E.game.update = true;
		}
	};

	/**
	 * Selects both the entity and the tile at the mouse cursors location
	 */
	tools.select = {
		label: 'Select',
		select: function() {},
		use: function(tileIndex) {
			palette.selected = {};
			E.entities.instances.some(function(entity, index) {
				if (map.getTileIndex(entity) === tileIndex) {
					palette.selected.entity = entity;
					return true;
				}
			});
			palette.selected.tileIndex = tileIndex;
			E.game.update = true;
		},
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
		}
	};

	/**
	 * Rotates the selected entity
	 */
	tools.rotate = {
		label: 'Rotate',
		select: function() {
			if (!palette.selected || !palette.selected.entity) {
				alert('Please select an entity first');
			}
		},
		use: function(tileIndex) {
			if (palette.selected && palette.selected.entity !== undefined) {
				var mouse = E.input.mouseState,
					diff = E.vector.subtract(palette.selected.entity, mouse),
					xAxis = {x:1, y:0},
					angle = E.vector.angle(xAxis, diff, true);
				palette.selected.entity.direction = E.vector.angleToVector(angle);
				E.game.update = true;
			}
		},
		render: function() {
			if (palette.selected && palette.selected.entity !== undefined) {
				E.graphics.vectors.line(palette.selected.entity, E.input.mouseState, 'orange');
			}
		}
	};

	/**
	 * Expands the size of the map
	 */
	tools.expand = {
		label: 'Expand',
		select: function() {},
		use: function(tileIndex) {
			var delta = {};
			delta[map.sideClosestToCursor()] = 1;
			map.resize(delta);
			E.game.update = true;
		},
		render: function() {
			var cursorStyles = {
				top: 'n-resize',
				right: 'e-resize',
				bottom: 's-resize',
				left: 'w-resize'
			}, side = map.sideClosestToCursor();
			E.input.setMouseCursor(cursorStyles[side]);
		}
	};

	/**
	 * Reduces the size of the map
	 */
	tools.reduce = {
		label: 'Reduce',
		select: function() {},
		use: function(tileIndex) {
			var delta = {};
			delta[map.sideClosestToCursor()] = -1;
			map.resize(delta);
			E.game.update = true;
		},
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
		}
	};

	/**
	 * Sets the patrol route for an actor
	 * If one already exists then it is deleted rather than edited
	 */
	tools.patrol = {
		label: 'Patrol',
		select: function() {
			if (palette.selected && palette.selected.entity) {
				// clear existing patrol route
				var entity = palette.selected.entity;
				entity.patrolRoute = [map.getTileIndex(entity)];
				E.game.update = true;
			}
			else {
				alert('Please select an entity first');
			}
		},
		use: function(tileIndex) {
			if (palette.selected && palette.selected.entity !== undefined) {
				var entity = palette.selected.entity;
				if (entity.patrolRoute === undefined) {
					entity.patrolRoute = [map.getTileIndex(entity)];
				}
				entity.patrolRoute.push(map.getTileIndex(E.input.mouseState));
				entity.mode = 'patrol';
				E.game.update = true;
			}
		},
		render: function() {
			var entity = palette.selected && palette.selected.entity,
			lineStart,
			lineEnd;
			if (palette.selected && palette.selected.entity !== undefined) {
				entity.renderPatrolRoute();
				lineStart = map.getTileCentre(entity.patrolRoute.slice(-1)[0]);
				lineEnd = map.getTileCentre(map.getTileIndex(E.input.mouseState));
				E.graphics.vectors.line(lineStart, lineEnd, 'red', true);
			}
		}
	};

	return tools;

})();