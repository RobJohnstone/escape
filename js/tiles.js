var tiles = {};

tiles.init = function(source, tileWidth, tileHeight) {
	tiles.tileWidth = tileWidth;
	tiles.tileHeight = tileHeight;
	tiles.tileset = [{
						colour: 'black',
						passable: true
					 },
					 {
					 	colour: 'blue',
					 	passable: false
					 }];
};

tiles.renderTile = function(tile, x, y) {
	graphics.gameContext.fillStyle = tiles.tileset[tile].colour;
	graphics.gameContext.fillRect(x, y, tiles.tileWidth, tiles.tileHeight);
};