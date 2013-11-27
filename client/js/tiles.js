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
	 * @param tilesetName {String} The name of the tileset
	 * @return this
	 */
	tiles.load = function(tilesetName, tileWidth, tileHeight, callback) {
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		E.assetLoader.load('tileset', function(result) {
			this.tilesetImage = result.image;
			this.tileset = result.tileset;
			callback();
		}.bind(this), tilesetName);
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