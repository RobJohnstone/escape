var graphics = {};

graphics.init = function(width, height, pixelDensity) {
	/* not yet added support for pixel density to functions that need to translate between screen and canvas coords
	   (e.g. in input.js) */
	if (!pixelDensity) pixelDensity = 1;
	graphics.pixelDensity = pixelDensity;
	if (width === 'fullscreen') {
		graphics.fullscreen = true;
		width = (window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||800);
		height = (window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||600);
	}
	pixelWidth = width * pixelDensity;
	pixelHeight = height * pixelDensity;
	$('#gameContainer').html('<canvas id="gameCanvas" class="defaultBorder" width="'+ pixelWidth +'px" height="' + pixelHeight +'px">Your broswer does not support the "canvas element". To play this game you will need a more modern browser.</canvas>');
	$('#gameCanvas').css({width: +width+'px', height: height+'px'});

	graphics.gameCanvas = document.getElementById('gameCanvas');
	graphics.gameContext = graphics.gameCanvas.getContext('2d');
	graphics.canvasWidth = pixelWidth;
	graphics.canvasHeight = pixelHeight;
};

graphics.textQueue = [];

graphics.writeText = function(string, x, y) {
	graphics.textQueue.push({string: string, x: x, y: y});
};

graphics.writeTextNow = function(string, x, y) {
	var fillStyle = graphics.gameContext.fillStyle,
		strokeStyle = graphics.gameContext.strokeStyle,
		font = graphics.gameContext.font;
	graphics.gameContext.fillStyle = 'white';
	graphics.gameContext.strokeStyle = 'black';
	graphics.gameContext.font = '12pt Arial';
	graphics.gameContext.strokeText(string, x, y);
	graphics.gameContext.fillText(string, x, y);
	graphics.gameContext.fillStyle = fillStyle;
	graphics.gameContext.strokeStyle = strokeStyle;
	graphics.gameContext.font = font;
};

graphics.renderText = function() {
	graphics.textQueue.forEach(function(item) {
		graphics.writeTextNow(item.string, item.x, item.y);
	});
	graphics.textQueue = [];
};

graphics.render = function() {
	graphics.gameContext.fillStyle = 'black';
	graphics.gameContext.fillRect(0, 0, graphics.canvasWidth, graphics.canvasHeight);
	map.render();
	entities.render();
	graphics.writeText('FPS: '+Math.round(timer.FPS), graphics.canvasWidth - 150, 30);
	graphics.writeText('map.xOffset: '+map.xOffset, graphics.canvasWidth - 150, 50);
	graphics.writeText('map.yOffset: '+map.yOffset, graphics.canvasWidth - 150, 70);
	graphics.writeText('player.x: '+player.x, graphics.canvasWidth - 150, 90);
	graphics.writeText('player.y: '+player.y, graphics.canvasWidth - 150, 110);
	graphics.writeText('tile index: '+map.getTileIndex(player.x, player.y), graphics.canvasWidth - 150, 130);
	graphics.renderText();
};