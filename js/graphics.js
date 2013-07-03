E.graphics = (function() {
	"use strict";

	var graphics = {};

	graphics.init = function(width, height, clipping) {
		$('#gameContainer').html('');
		graphics.viewport = {
			width: $('#gameContainer').width(),
			height: $('#gameContainer').height()
		};
		if (width === 'fullscreen') {
			graphics.fullscreen = true;
			width = graphics.viewport.width;
			height = graphics.viewport.height;
		}
		graphics.initCanvas('game', width, height);
		graphics.clipping = (clipping === undefined) ? true : clipping;
	};

	graphics.initCanvas = function(name, width, height) {
		if (!width) width = 800;
		if (!height) height = 600;
		$('#gameContainer').append('<canvas id="'+name+'Canvas" class="defaultBorder" width="'+ width +'px" height="' + height +'px">Your broswer does not support the "canvas element". To play this game you will need a more modern browser.</canvas>');
		$('#'+name+'Canvas').css({width: +width+'px', height: height+'px'});
		graphics[name+'Canvas'] = document.getElementById(name+'Canvas');
		graphics[name+'Context'] = graphics.gameCanvas.getContext('2d');
		graphics[name+'Canvas'].width = width;
		graphics[name+'Canvas'].height = height;
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

	graphics.vectors = {
		commands: [],
		render: function() {
			for (var i=0; i<this.commands.length; i++) {
				this.commands[i]();
			}
			this.commands = [];
		},
		command: function(command) {
			this.commands.push(command);
		}
	};

	graphics.render = function() {
		if (graphics.clipping) {
			graphics.gameContext.clearRect(-E.map.offset.x, -E.map.offset.y, graphics.gameCanvas.width, graphics.gameCanvas.height);
		}
		else {
			graphics.gameContext.clearRect(-E.map.offset.x, -E.map.offset.y, graphics.viewport.width, graphics.viewport.height);
		}
		E.map.render();
		E.entities.render();
		graphics.vectors.render();
		graphics.renderText();
	};

	graphics.resizeCanvas = function(name, width, height) {
		graphics[name+'Canvas'].width = width;
		graphics[name+'Canvas'].height = height;
		$('#'+name+'Canvas').css({width: +width+'px', height: height+'px'});
	};

	return graphics;
})();