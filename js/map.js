var map = {
	offset: {
		x: 0,
		y: 0
	}
};

map.init = function(mapObj) {
	$.extend(true, map, mapObj);
	tiles.init('', map.tileWidth, map.tileHeight);
	map.pathGrid = [];
	var i = 0;
	for (var row=0; row<map.rows; row++) {
		map.pathGrid.push([]);
		for (var col=0; col<map.columns; col++) {
			map.pathGrid[row].push(!tiles.tileset[map.data[i]].passable); // need to modify to check if tile is passable rather than this hack
			i++;
		}
	}
	for (i=0; i<map.actors.length; i++) {
		actors.create(map.actors[i]);
	}
	window.player = actorPrototype.create($.extend({ // deliberately make global (when I namespace the code later this would belong to the namespace)
		width: 32,
		height: 32,
		colour: 'green',
		speed: 5,
		direction: {x: 1, y: 0},
		invulnerable: true
	}, map.playerStart));
	if (!graphics.clipping) {
		graphics.resizeCanvas('game', map.tileWidth * map.columns, map.tileHeight * map.rows);
	}
};

map.load = function(mapName, tileSource, tileWidth, tileHeight, onLoad) {
	$.ajax({
		url: '/maps/'+mapName+'.json',
		type: 'get',
		success: function(mapObj) {
			map.init(mapObj);
			if (typeof onLoad === 'function') {
				onLoad();
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('map loading error: ');
			console.log(textStatus);
		}
	});
};

map.save = function() {
	$.ajax({
		url: '/maps/'+map.name+'.json',
		type: 'post',
		data: JSON.stringify(map),
		success: function(result) {
			console.log('map saved');
		}
	});
};

map.render = function() {
	var floor = Math.floor,
		ceil = Math.ceil,
		rowStart = floor(-map.offset.y / tiles.tileHeight),
		rowEnd = ceil((graphics.gameCanvas.height - map.offset.y) / tiles.tileHeight),
		colStart = floor(-map.offset.x / tiles.tileWidth),
		colEnd = ceil((graphics.gameCanvas.width - map.offset.x) / tiles.tileWidth);
	for (var row=rowStart; row<rowEnd; row++) {
		for (var col=colStart; col<colEnd; col++) {
			var x = map.offset.x + (col * tiles.tileWidth),
				y = map.offset.y + (row * tiles.tileHeight);
			tiles.renderTile(map.data[row*map.columns + col], x, y);
		}
	}
};

map.position = function(position) {
	map.offset = {
		x: Math.round(graphics.gameCanvas.width / 2) - position.x,
		y: Math.round(graphics.gameCanvas.height / 2) - position.y
	};
	if (map.offset.x > 0) map.offset.x = 0;
	if (map.offset.y > 0) map.offset.y = 0;
	if (map.offset.x < graphics.gameCanvas.width-(map.columns * tiles.tileWidth)) map.offset.x = graphics.gameCanvas.width-(map.columns * tiles.tileWidth);
	if (map.offset.y < graphics.gameCanvas.height-(map.rows * tiles.tileHeight)) map.offset.y = graphics.gameCanvas.height-(map.rows * tiles.tileHeight);
};

map.getTileIndex = function(position) {
	var col = Math.floor(position.x / tiles.tileWidth),
		row = Math.floor(position.y / tiles.tileHeight);
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

map.lineTraversable = function(start, end, resolution) {
	var diff = vector.subtract(start, end),
		distance = vector.mag(diff),
		vel = vector.normalise(diff),
		pos = vector.clone(start),
		tile,
		endTile = map.getTileIndex(end);
	for (var i=0; i<distance; i++) {
		pos = vector.add(pos, vel);
		tile = map.getTileIndex(pos);
		if (tile === endTile) {
			return true;
		}
		if (map.data[tile] === undefined || !tiles.tileset[map.data[tile]].passable) {
			return false;
		}
	}
	return true;
};

map.highlightTile = function(tile) {
	if (graphics.gameCanvas) {
		var tileCentre = map.getTileCentre(tile);
		graphics.vectors.command(function() {
			graphics.gameContext.strokeStyle = 'white';
			graphics.gameContext.strokeRect(Math.round(tileCentre.x-tiles.tileWidth/2)+0.5, Math.round(tileCentre.y-tiles.tileHeight/2)+0.5, tiles.tileWidth, tiles.tileHeight);
		});
	}
};

map.highlightMouseTile = function() {
	map.highlightTile(map.getTileIndex(input.mouseState));
};