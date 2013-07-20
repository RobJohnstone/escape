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
	 * Sets tile dimensions and passability
	 *
	 * @method init
	 * @return this
	 */
	tiles.init = function(source, tileWidth, tileHeight) {
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
	 * Placeholder code TODO: Update with bitmap graphics
	 *
	 * @method renderTile
	 * @return this
	 */
	tiles.renderTile = function(tile, x, y) {
		E.graphics.gameContext.fillStyle = tiles.tileset[tile].colour;
		E.graphics.gameContext.fillRect(x, y, tiles.tileWidth, tiles.tileHeight);
		return this;
	};

	return tiles;
})();