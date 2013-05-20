var map = {};

map.init = function(mapData, tileSource, tileWidth, tileHeight) {
	map.xOffset = 0;
	map.yOffset = 0;
	map.columns = mapData.width;
	map.rows = mapData.height;
	map.width = map.columns * tileWidth;
	map.height = map.rows * tileHeight;
	tiles.init(tileSource, tileWidth, tileHeight);
	map.data = mapData.layers[0].data.map(function(elem) {
		return elem - 1; // account for the fact that the tiled map editor counts tiles from 1 rather than 0.
	});
	map.pathGrid = [];
	var i = 0;
	for (var row=0; row<map.rows; row++) {
		map.pathGrid.push([]);
		for (var col=0; col<map.columns; col++) {
			map.pathGrid[row].push(map.data[i]); // need to modify to check if tile is passable rather than this hack
			i++;
		}
	}
};

map.load = function(mapName, tileSource, tileWidth, tileHeight, onLoad) {
	console.log('map.load()');
	$.ajax({
		url: '../escape/maps/'+mapName+'.json',
		type: 'get',
		success: function(mapData) {
			map.init(mapData, tileSource, tileWidth, tileHeight);
			Object.create(baddyPrototype).init({
				x: 543,
				y: 351,
				width: 32,
				height: 32,
				colour: 'red',
				maxRange: 2000,
				mode: 'watch',
				idealRange: 1024,
				speed: 5,
				direction: Math.PI / 2
			});
			window.player = Object.create(actorPrototype).init({ // deliberately make global (when I namespace the code later this would belong to the namespace)
				x: 100,
				y: 100,
				width: 32,
				height: 32,
				colour: 'green',
				speed: 5,
				direction: Math.PI / 4,
				invulnerable: false
			});
			if (typeof onLoad === 'function') {
				onLoad();
			}
		}
	});
};

map.render = function() {
	var floor = Math.floor,
		ceil = Math.ceil,
		rowStart = floor(-map.yOffset / tiles.tileHeight),
		rowEnd = ceil((graphics.canvasHeight - map.yOffset) / tiles.tileHeight),
		colStart = floor(-map.xOffset / tiles.tileWidth),
		colEnd = ceil((graphics.canvasWidth - map.xOffset) / tiles.tileWidth);
	for (var row=rowStart; row<rowEnd; row++) {
		for (var col=colStart; col<colEnd; col++) {
			var x = map.xOffset + (col * tiles.tileWidth),
				y = map.yOffset + (row * tiles.tileHeight);
			tiles.renderTile(map.data[row*map.columns + col], x, y)
		}
	}
};

map.position = function(x, y) {
	map.xOffset = Math.round(graphics.canvasWidth / 2) - x;
	map.yOffset = Math.round(graphics.canvasHeight / 2) - y;
	if (map.xOffset > 0) map.xOffset = 0;
	if (map.yOffset > 0) map.yOffset = 0;
	if (map.xOffset < graphics.canvasWidth-(map.columns * tiles.tileWidth)) map.xOffset = graphics.canvasWidth-(map.columns * tiles.tileWidth);
	if (map.yOffset < graphics.canvasHeight-(map.rows * tiles.tileHeight)) map.yOffset = graphics.canvasHeight-(map.rows * tiles.tileHeight);
};

map.getTileIndex = function(x, y) {
	var col = Math.floor(x / tiles.tileWidth),
		row = Math.floor(y / tiles.tileHeight);
	return (row * map.columns) + col;
};

map.getTileCentre = function(tile) {
	if (Object.prototype.toString.call(tile) === '[object Array]') {
		tile = map.getTileFromCoords(tile);
	}
	var col = tile % map.columns,
		row = Math.floor(tile / map.columns);
	return ({
		x: (col * tiles.tileWidth) + (tiles.tileWidth / 2),
		y: (row * tiles.tileHeight) + (tiles.tileHeight / 2)
	});
};

map.getTileCoords = function(tile) {
	if (Object.prototype.toString.call(tile) === '[object Array]') { // check if 2d coords rather than straight tile no
		tile = tile[0] + tile[1] * map.columns;
	}
	return [tile % map.columns, Math.floor(tile / map.rows)];
};

map.getTileFromCoords = function(x, y) {
	if (Object.prototype.toString.call(x) === '[object Array]') {
		y = x[1];
		x = x[0];
	}
	return (y * map.columns) + x;
};

map.lineTraversable = function(startX, startY, endX, endY, resolution) {
	var dx = endX - startX,
		dy = endY - startY,
		sqrt = Math.sqrt,
		distance = sqrt(dx*dx + dy*dy),
		xSpeed = dx / distance,
		ySpeed = dy / distance,
		x = startX, 
		y = startY,
		tile,
		endTile = map.getTileIndex(endX, endY);
	for (var i=0; i<distance; i++) {
		x += xSpeed;
		y += ySpeed;
		tile = map.getTileIndex(x, y);
		if (tile === endTile) {
			return true;
		}
		if (map.data[tile] === undefined || !tiles.tileset[map.data[tile]].passable) {
			return false;
		}
	}
	return true;
};