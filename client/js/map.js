var E = E || {};

/**
 * Map module. Objects and methods concerning the map
 *
 * @module map
 * @class map
 */
E.map = (function() {
	"use strict";

	var map = {
		offset: {
			x: 0,
			y: 0
		}
	};

	var _mapTemplate = {
		name: '',
		description: '',
		columns: 0,
		rows: 0,
		tileWidth: 0,
		tileHeight: 0,
		tileset: 'tileset',
		width: 0,
		height: 0,
		data: [],
		actors: []
	};

	/**
	 * Loads the assets required by the map
	 *
	 * @param mapObj {object} information about the map loaded from file
	 * @return this
	 */
	map.load = function(mapObj) {
		map.mapObj = mapObj;
		if (mapObj.tileset) {
			E.tiles.load(mapObj.tileset, mapObj.tileWidth, mapObj.tileHeight, map.init.bind(null, mapObj));
		}
		else {
			throw new Exception('map does not specify tileset');
		}
		return this;
	};

	/**
	 * initialise the map based on a loaded map object
	 *
	 * @method init
	 * @param mapObj {object} information about the map loaded from file (optional)
	 * @return this
	 */
	map.init = function() {
		var mapObj = map.mapObj,
			template = $('#mapScreenTemplate').text().trim(),
			compiled = _.template(template);
		if (mapObj) {
			map.actors = [];
			$.extend(true, map, mapObj);
		}
		map.pathGrid = [];
		var i = 0;
		for (var row=0; row<map.rows; row++) {
			map.pathGrid.push([]);
			for (var col=0; col<map.columns; col++) {
				map.pathGrid[row].push(!map.getTileObj(i).passable);
				i++;
			}
		}
		E.entities.instances = [];
		if (map.actors) {
			for (i=0; i<map.actors.length; i++) {
				var actor = E.actors.create(map.actors[i]);
				if (actor.type === 'player') {
					E.player = actor;
				}
			}
		}
		$('#mapScreen').html(compiled(map));
		return this;
	};

	/**
	 * Creates a new blank map object
	 *
	 * @method new
	 * @param mapName {string} The filename of the new map minus the json extension
	 * @param cols {number} The number of columns in the map (defaults to 50)
	 * @param rows {number} The number of rows in the map (defaults to 50)
	 * @return mapObj {object}
	 */
	map.newMap = function(mapName, cols, rows) {
		cols = cols || 50;
		rows = rows || 50;
		var mapObj = _mapTemplate.clone();
		mapObj.name = mapName;
		mapObj.columns = cols;
		mapObj.rows = rows;
		mapObj.tileWidth = 64;
		mapObj.tileHeight = 64;
		mapObj.width = 64*cols;
		mapObj.height = 64*rows;
		for (var i=0, len=cols*rows; i<len; i++) {
			mapObj.data[i] = 0;
		}
		return mapObj;
	};

	/**
	 * Updates map values
	 *
	 * @method update
	 * @param field {string} The field to update (either the property name or a the id of a form element associated with that property)
	 * @param value {any} The new value
	 * @return this
	 */
	map.update = function(field, value) {
		if (field.substr(0, 3) === 'map') {
			field = field.substr(3);
			field = field.charAt(0).toLowerCase() + field.slice(1);
		}
		map[field] = value;
		return this;
	};

	/**
	 * Saves the map on the server (this should only be allowed on the dev server)
	 *
	 * @method save
	 * @return this
	 */
	map.save = function() {
		map.mapObj = {
			name: map.name,
			description: map.description,
			columns: map.columns,
			rows: map.rows,
			tileWidth: map.tileWidth,
			tileHeight: map.tileHeight,
			tileset: map.tileset,
			actors: E.entities.instances.filter(function(entity) {
				return entity.abbr; // ensure only actors and not other entities
			}).map(function(entity) {
				return entity.abbr();
			}),
			data: map.data
		};
		$.ajax({
			url: '/maps/'+map.name,
			type: 'post',
			data: {data: JSON.stringify(map.mapObj)}
		});
		// save updated map in asset cache
		E.assetLoader.addToCache('/maps/'+map.name, map.mapObj);

		return this;
	};

	/**
	 * renders the map
	 *
	 * @method render
	 * @return this
	 */
	map.render = function() {
		var floor = Math.floor,
			ceil = Math.ceil,
			rowStart = floor(-map.offset.y / E.tiles.tileHeight),
			rowEnd = ceil((E.graphics.gameCanvas.height - map.offset.y) / E.tiles.tileHeight),
			colStart = floor(-map.offset.x / E.tiles.tileWidth),
			colEnd = ceil((E.graphics.gameCanvas.width - map.offset.x) / E.tiles.tileWidth);
		for (var row=rowStart; row<rowEnd; row++) {
			for (var col=colStart; col<colEnd; col++) {
				var x = map.offset.x + (col * E.tiles.tileWidth),
					y = map.offset.y + (row * E.tiles.tileHeight);
				E.tiles.renderTile(map.data[row*map.columns + col], x, y);
			}
		}
		return this;
	};

	/**
	 * Checks that a position is within the bounds of the map
	 *
	 * @method checkWithinBounds
	 * @param pos {vector} the position to test
	 * @return {boolean} true if the position is within the bounds of the map, false otherwise
	 */
	map.checkWithinBounds = function(pos) {
		if (pos.x < 0 || pos.x > map.width || pos.y < 0 || pos.y > map.height)
			return false;
		else
			return true;
	};

	/**
	 * Gets the tile object for the tile index
	 *
	 * @method getTileObj
	 * @return this
	 */
	map.getTileObj = function(tileIndex) {
		var tile = map.data[tileIndex];
		if (tile === undefined) {
			return false;
		}
		else return E.tiles.tileset[tile];
	};

	/**
	 * Checks that a particular tile is passable
	 *
	 * @method isPassable
	 * @param tileIndex {number} the index of the tile within the E.tiles.tiles array
	 * @return {boolean} true if the tile is passable, false otherwise
	 */
	map.isPassable = function(tileIndex) {
		return map.getTileObj(tileIndex).passable;
	};

	/** Checks if an entity is about to collide with an impassable tile on the map and, if so, returns a more appropriate vector
	 *
	 * @method collisionAdjust
	 * @param entity {entity} the entity that is moving
	 * @param v {vector} the desired movement vector of the entity
	 * @return {vector} an allowable movement vector
	 */
	map.collisionAdjust = function(entity, v) {
		var cornerCollisions, testV,
			magnitude = E.vector.mag(v),
			testVectors = [v];
		// if v doesn't work then we're going try the individual x and y components of v scaled to the appropriate length
		if (v.x) testVectors.push(E.vector.setLength({x: v.x, y: 0}, magnitude));
		if (v.y) testVectors.push(E.vector.setLength({x: 0, y: v.y}, magnitude));
		// and if they don't work we are blocked and so stay where we are
		testVectors.push({x:0, y:0});

		for (var i=0; i<testVectors.length; i++) {
			testV = testVectors[i];
			cornerCollisions = cornersCollide(entity, testV);
			if (cornerCollisions.length === 0) {
				return testV;
			}
			else if (cornerCollisions.length === 1) { // nudge around the corner as it's clear what the player is trying to do
				return nudge(testV, cornerCollisions[0], entity);
			}
		}

		/* Returns true if the point collides with an impassable tile on the map */
		function pointCollides(point, v) {
			var testPos = E.vector.round(E.vector.add(point, v));
			var testTile = map.getTileIndex(testPos);
			return !map.isPassable(testTile);
		}

		/* Returns the number of corners of the entity's bounding box that collide with impassable tiles on the map */
		function cornersCollide(entity, v) {
			var collisions = [],
				corners = {
					topLeft: {x: entity.x-entity.halfWidth, y: entity.y-entity.halfHeight},
					topRight: {x: entity.x+entity.halfWidth, y: entity.y-entity.halfHeight},
					bottomRight: {x: entity.x+entity.halfWidth, y: entity.y+entity.halfHeight},
					bottomLeft: {x: entity.x-entity.halfWidth, y: entity.y+entity.halfHeight}
				};
			for (var corner in corners) {
				if (pointCollides(corners[corner], v)) collisions.push(corner);
			}
			return collisions;
		}

		/* Returns a vector that will steer the entity away from a collision if only one of it's corners has collided with impassable tiles on the map */
		function nudge(v, collidingCorner, entity) {
			var sideLength = Math.sqrt(entity.halfWidth * entity.halfWidth + entity.halfHeight * entity.halfHeight),
				cornerVectors = {
					topLeft: {x:-1, y:-1},
					topRight: {x:1, y:-1},
					bottomRight: {x:1, y:1},
					bottomLeft: {x:-1, y:1}
				},
				cornerVector = cornerVectors[collidingCorner],
				nudgeVector = E.vector.subtract(cornerVector, {x:0, y:0});
			return E.vector.setLength(nudgeVector, E.vector.mag(nudgeVector) * sideLength / 2);
		}
	};

	/**
	 * Scrolls the map so that it is looking at the passed position
	 *
	 * @method position
	 * @param position {vector} The position to look at
	 * @return this
	 */
	map.position = function(position) {
		map.offset = {
			x: Math.round(E.graphics.gameCanvas.width / 2) - position.x,
			y: Math.round(E.graphics.gameCanvas.height / 2) - position.y
		};
		if (map.offset.x > 0) map.offset.x = 0;
		if (map.offset.y > 0) map.offset.y = 0;
		if (map.offset.x < E.graphics.gameCanvas.width-(map.columns * E.tiles.tileWidth)) map.offset.x = E.graphics.gameCanvas.width-(map.columns * E.tiles.tileWidth);
		if (map.offset.y < E.graphics.gameCanvas.height-(map.rows * E.tiles.tileHeight)) map.offset.y = E.graphics.gameCanvas.height-(map.rows * E.tiles.tileHeight);
		return this;
	};

	/* TODO: All these get methods should be memoized but there also needs to be a means of resetting them when a new map is loaded. The same is true of .isPassable above */
	/**
	 * Returns the index of the tile corresponding to the passed postion
	 *
	 * @method getTileIndex
	 * @param position {vector} the position to test
	 * @return {number} the index of the appropriate tile or undefined if there is no tile at that position
	 */
	map.getTileIndex = function(position) {
		if(map.checkWithinBounds(position)) {
			var col = Math.floor(position.x / E.tiles.tileWidth),
				row = Math.floor(position.y / E.tiles.tileHeight);
			return (row * map.columns) + col;
		}
		else return undefined;
	};

	/**
	 * Returns a vector indicating the position of the centre of the tile
	 *
	 * @method getTileCentre
	 * @param tile {number} The tile to consider. If an object is passed it will try to determine the tile based on the x and y properties of the object
	 * @return {vector} The postion of the centre of the tile
	 */
	map.getTileCentre = function(tile) {
		if (Object.prototype.toString.call(tile) === '[object Array]') {
			tile = map.getTileFromCoords(tile);
		}
		var col = tile % map.columns,
			row = Math.floor(tile / map.columns);
		return ({
			x: (col * E.tiles.tileWidth) + (E.tiles.tileWidth / 2),
			y: (row * E.tiles.tileHeight) + (E.tiles.tileHeight / 2)
		});
	};

	/**
	 * Converts a tile index into 2d coordinates within the tiles array
	 *
	 * @method getTileCoords
	 * @param tile {number} The tile index
	 * @return {array} The first element is the x coordinate, the second the y coordinate
	 */
	map.getTileCoords = function(tile) {
		if (Object.prototype.toString.call(tile) === '[object Array]') { // check if 2d coords rather than straight tile no
			tile = tile[0] + tile[1] * map.columns;
		}
		return [tile % map.columns, Math.floor(tile / map.columns)];
	};

	/**
	 * Converts 2d tile coords (not pixel coords) into a tile index
	 *
	 * @method getTileFromCoords
	 * @param x {number} The x coord of the tile
	 * @param y {number} The y coord of the tile
	 * @return {number} The tile index
	 */
	map.getTileFromCoords = function(x, y) {
		if (Object.prototype.toString.call(x) === '[object Array]') {
			y = x[1];
			x = x[0];
		}
		return (y * map.columns) + x;
	};

	/**
	 * Checks if a line between two points can pass unimpeeded by the map
	 * Note that this does not check for collisions with entities
	 *
	 * @method lineTraversable
	 * @param start {vector} The start location
	 * @param end {vector} The end location
	 * @return {boolean} True if there are no impassable tiles between the start and end points, false otherwise
	 */
	map.lineTraversable = function(start, end) {
		var diff = E.vector.subtract(start, end),
			distance = E.vector.mag(diff),
			vel = E.vector.normalise(diff),
			pos = E.vector.clone(start),
			tile,
			endTile = map.getTileIndex(end);
		for (var i=0; i<distance; i++) {
			pos = E.vector.add(pos, vel);
			tile = map.getTileIndex(pos);
			if (tile === endTile) {
				return true;
			}
			if (!map.getTileObj(tile).passable) {
				return false;
			}
		}
		return true;
	};

	/**
	 * Higlights the tile indicated
	 *
	 * @method highlightTile
	 * @param tileIndex {number} The tileIndex of the tile to highlight
	 * @return this
	 */
	map.highlightTile = function(tileIndex, colour) {
		if (E.graphics.gameCanvas) {
			var tileCentre = map.getTileCentre(tileIndex);
			colour = colour || 'white';
			E.graphics.vectors.rect({
				x: tileCentre.x-E.tiles.tileWidth/2,
				y: tileCentre.y-E.tiles.tileHeight/2
			}, {
				x: E.tiles.tileWidth,
				y: E.tiles.tileHeight
			}, colour);
		}
		return this;
	};

	/**
	 * highlights the tile under the mouse cursor
	 *
	 * @method highlightMouseTile
	 * @return this
	 */
	map.highlightMouseTile = function() {
		map.highlightTile(map.getTileIndex(E.input.mouseState));
		return this;
	};

	/**
	 * Resizes the map
	 *
	 * @method resize
	 * @param delta {object} The four properties (top, right, bottom, left) indicate how many columns/rows to add. Negative numbers shrink the map
	 * @return this
	 */
	map.resize = function(delta) {
		var index;
		delta.top = delta.top || 0;
		delta.right = delta.right || 0;
		delta.bottom = delta.bottom || 0;
		delta.left = delta.left || 0;
		if (delta.top) {
			map.rows += delta.top;
			if (delta.top > 0) {
				map.data = _blankRows(delta.top).concat(map.data);
			}
			else if (delta.top < 0) {
				map.data.splice(0, map.columns);
			}
		}
		if (delta.right) {
			map.columns += delta.right;
			if (delta.right > 0) {
				for (index=map.columns; index<map.data.length; index+= map.columns) {
					map.data.splice(index, 0, 0);
				}
			}
			else if (delta.right < 0) {
				for (index=map.columns; index<map.data.length; index+= map.columns) {
					map.data.splice(index, 1);
				}
			}
		}
		if (delta.bottom) {
			map.rows += delta.bottom;
			if (delta.bottom > 0) {
				map.data = map.data.concat(_blankRows(delta.bottom));
			}
			else if (delta.bottom < 0) {
				map.data.splice(-map.columns, map.columns);
			}
		}
		if (delta.left) {
			map.columns += delta.left;
			if (delta.left > 0) {
				for (index=0; index<map.data.length; index+= map.columns) {
					map.data.splice(index, 0, 0);
				}
			}
			else if (delta.left < 0) {
				for (index=0; index<map.data.length; index+= map.columns) {
					map.data.splice(index, 1);
				}
			}
		}

		var tempEntities = [];

		E.entities.instances.forEach(function(entity, index) {
			entity.x = entity.x + (delta.left * map.tileWidth);
			entity.y = entity.y + (delta.top * map.tileHeight);
			if (map.checkWithinBounds(entity)) {
				tempEntities.push(entity);
			}
		});

		E.entities.instances = tempEntities;

		if (!E.graphics.clipping) {
			E.graphics.resizeCanvas('game', map.columns * map.tileWidth, map.rows * map.tileHeight);
		}
		return this;

		function _blankRows(numRows) {
			var newData = new Array(map.columns * numRows);
			for (var i=0; i<newData.length; i++) {
				newData[i] = 0;
			}
			return newData;
		}
	};

	/**
	 * Returns a string indicating the side of the map closest to the mouse cursor
	 *
	 * @method sideClosestToCursor
	 * @return {string}
	 */
	map.sideClosestToCursor = function() {
		var mapWidth, mapHeight, mapCentre, diff, angle, quadrant,
			quadrants = ['top', 'right', 'bottom', 'left'];
		mapWidth = map.tileWidth * map.columns;
		mapHeight = map.tileHeight * map.rows;
		mapCentre = {x: mapWidth/2, y: mapHeight/2};
		diff = E.vector.subtract(mapCentre, E.input.mouseState);
		diff = { // adjust for the fact that the map is unlikely to be perfectly square
			x: diff.x / mapWidth,
			y: diff.y / mapHeight
		};
		angle = E.vector.angle({x: mapCentre.x/mapWidth, y: mapCentre.y/mapHeight}, diff, true);
		quadrant = Math.floor(angle * 2 / Math.PI) + 2;
		return quadrants[quadrant];
	};

	return map;
})();