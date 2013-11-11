var E = E || {};

/**
 * Tiles module.
 *
 * Handles all functionality associated with map tiles
 * If you're looking for something and can't find it then try the map module
 *
 * @module tiles
 * @class tiles
 */

E.tiles = (function() {
	"use strict";

	var tiles = {};

	/**
	 * Loads the tile assets
	 *
	 * @param imageUrl {String} The url of the image file
	 * @return this
	 */
	tiles.load = function(url, tileWidth, tileHeight, callback) {
		E.assetLoader.load('image', function() {
			tiles.init(tileWidth, tileHeight);
			callback();
		}, 'assets/images/tileset.png');
	};

	/**
	 * Sets tile dimensions and passability
	 *
	 * @method init
	 * @return this
	 */
	tiles.init = function(tileWidth, tileHeight) {
		tiles.tilesetImage = E.assetLoader.getFromCache('assets/images/tileset.png');
		tiles.tileWidth = tileWidth;
		tiles.tileHeight = tileHeight;
		tiles.tileset = [{ // floor
							colour: 'black',
							passable: true
						},
						{ // wall
							colour: 'blue',
							passable: false
						},
						{ // exit
							colour: 'yellow',
							passable: true,
							exit: true
						}];
		return this;
	};

	/**
	 * Renders a tile
	 *
	 * Placeholder code TODO: wrap canvas call in a graphics module facade
	 *
	 * @method renderTile
	 * @return this
	 */
	tiles.renderTile = function(tile, x, y) {
		E.graphics.gameContext.drawImage(tiles.tilesetImage, tile*tiles.tileWidth, 0, tiles.tileWidth, tiles.tileHeight, x, y, tiles.tileWidth, tiles.tileHeight);
		return this;
	};

	return tiles;
})();