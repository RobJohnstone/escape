var E = E || {};

/**
 * Graphics module
 * Contains all code that outputs to the canvas
 *
 * @module graphics
 * @class graphics
 */
E.graphics = (function() {
	"use strict";

	var graphics = {};

	/**
	 *	Initialise graphics settings and call specific graphics initialisation methods
	 *
	 * @method init
	 * @param width {number} the width of the canvas in pixels. If set to "fullscreen" the 
	 * width and height are set to the viewport width and height
	 * @param height {number} the height of the canvas in pixels
	 * @param clipping {boolean} if true, only the visible portion of the map is rendered
	 * @return this
	 */
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
		return this;
	};

	/**
	 * Create and initialise the canvas
	 *
	 * @method initCanvas
	 * @param name {string} the name of the canvas (in case support for multiple canvases is needed later)
	 * @param width {number} the width of the canvas in pixels
	 * @param height {number} the height of the canvas in pixels
	 * @return this
	 */
	graphics.initCanvas = function(name, width, height) {
		if (!width) width = 800;
		if (!height) height = 600;
		$('#gameContainer').html('<canvas id="'+name+'Canvas" class="defaultBorder" width="'+ width +'px" height="' + height +'px">Your broswer does not support the "canvas element". To play this game you will need a more modern browser.</canvas>');
		$('#'+name+'Canvas').css({width: +width+'px', height: height+'px'});
		graphics[name+'Canvas'] = document.getElementById(name+'Canvas');
		graphics[name+'Context'] = graphics[name+'Canvas'].getContext('2d');
		graphics[name+'Canvas'].width = width;
		graphics[name+'Canvas'].height = height;
		return this;
	};

	graphics.textQueue = []; // text that should be rendered this frame

	/**
	 *	Adds text to graphics.textQueue to be rendered later this frame
	 *
	 * @method writeText
	 * @param string {string} the text to be written
	 * @param x {number} the x coord of the string's position on the canvas
	 * @param y {number} the y coord of the string's position on the canvas
	 * @return this
	 */
	graphics.writeText = function(string, x, y) {
		graphics.textQueue.push({string: string, x: x, y: y});
		return this;
	};

	/**
	 * renders the passed string immediately without taking measures to ensure that other
	 * rendered items this frame do not obscure the text
	 *
	 * @method writeTextNow
	 * @param string {string} the text to be rendered
	 * @param x {number} the x coord of the string's position on the canvas
	 * @param y {number} the y coord of the string's position on the canvas
	 * @return this
	 */
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
		return this;
	};

	/**
	 * Renders all text in the queue
	 *
	 * @method renderText
	 * @return this
	 */
	graphics.renderText = function() {
		graphics.textQueue.forEach(function(item) {
			graphics.writeTextNow(item.string, item.x, item.y);
		});
		graphics.textQueue = [];
		return this;
	};

	/**
	 * object storing all vectors that need to be rendered this frame
	 */
	graphics.vectors = {
		commands: [],
		/**
		 * Renders each vector
		 *
		 * @method vectors.render
		 * @return this
		 */
		render: function() {
			for (var i=0; i<this.commands.length; i++) {
				this.commands[i]();
			}
			this.commands = [];
			return this;
		},

		/**
		 * Adds a vector command to be rendered this frame
		 *
		 * @method vectors.command
		 * @param command {function} contains code for rendering a specific vector using native HTML5 canvas methods
		 * @return this
		 */
		command: function(command) {
			this.commands.push(command);
			return this;
		},

		/**
		 * Draws a line this frame
		 *
		 * @method line
		 * @param start {vector} The start point
		 * @param end {vector} The end point
		 * @param colour {string} The colour of the line (defaults to white)
		 * @param mapCoords {boolean} Whether to use map coords rather than canvas coords (defaults to canvas)
		 * @return this
		 */
		line: function(start, end, colour, mapCoords) {
			E.graphics.vectors.command(function() {
				E.graphics.vectors.lineNow(start, end, colour, mapCoords);
			});
			return this;
		},

		/**
		 * Draws a line now
		 *
		 * @method lineNow
		 * @param start {vector} The start point
		 * @param end {vector} The end point
		 * @param colour {string} The colour of the line (defaults to white)
		 * @param mapCoords {boolean} Whether to use map coords rather than canvas coords (defaults to canvas)
		 * @return this
		 */
		lineNow: function(start, end, colour, mapCoords) {
			var currentStrokeStyle = E.graphics.gameContext.strokeStyle;
			if (mapCoords) {
				start = E.vector.add(E.map.offset, start);
				end = E.vector.add(E.map.offset, end);
			}
			start = E.vector.round(start);
			end = E.vector.round(end);
			colour = colour || 'white';
			E.graphics.gameContext.strokeStyle = colour;
			E.graphics.gameContext.beginPath();
			E.graphics.gameContext.moveTo(start.x-0.5, start.y-0.5); // subtract .5 to minimise antialiasing for lines of 1 pixel thickness
			E.graphics.gameContext.lineTo(end.x-0.5, end.y-0.5);
			E.graphics.gameContext.stroke();
			E.graphics.gameContext.strokeStyle = currentStrokeStyle;
			return this;
		},

		/**
		 * Draws a rectangle (outline only) this frame
		 *
		 * @method.rect
		 * @param topLeft {vector} The coordinates of the top left corner of the rect
		 * @param dimensions {vector} The width and height of the rect (defailts to 50 for both);
		 * @param colour {string} The colour of the rect (defaults to white)
		 * @param mapCoords {boolean} Whether to use map coords rather than canvas coords (defaults to canvas)
		 * @return this
		 */
		rect: function(topLeft, dimensions, colour, mapCoords) {
			E.graphics.vectors.command(function() {
				E.graphics.vectors.rectNow(topLeft, dimensions, colour, mapCoords);
			});
			return this;
		},

		/**
		 * Draws a rectangle (outline only) now
		 *
		 * @method rectNow
		 * @param topLeft {vector} The coordinates of the top left corner of the rect
		 * @param dimensions {vector} The width and height of the rect (defailts to 50 for both);
		 * @param colour {string} The colour of the rect (defaults to white)
		 * @param mapCoords {boolean} Whether to use map coords rather than canvas coords (defaults to canvas)
		 * @return this
		 */
		rectNow: function(topLeft, dimensions, colour, mapCoords) {
			var currentStrokeStyle = E.graphics.gameContext.strokeStyle;
			if (mapCoords) {
				topLeft = E.vector.add(E.map.offset, topLeft);
			}
			topLeft = E.vector.round(topLeft);
			colour = colour || 'white';
			dimensions = E.vector.round(dimensions) || {
				x: 50,
				y: 50
			};
			E.graphics.gameContext.strokeStyle = colour;
			E.graphics.gameContext.strokeRect(topLeft.x+0.5, topLeft.y+0.5, dimensions.x, dimensions.y);
			E.graphics.gameContext.strokeStyle = currentStrokeStyle;
			return this;
		},

		/**
		 * Draws a circle (filled) this frame
		 *
		 * @method circle
		 * @param centre {vector} The centre of the circle
		 * @param radius {number} The radius of the circle (defaults to 50)
		 * @param colour {string} The colour of the circle (defaults to white)
		 * @param mapCoords {boolean} Whether to use map coords rather than canvas coords (defaults to canvas)
		 * @return this
		 */
		circle: function(centre, radius, colour, mapCoords) {
			E.graphics.vectors.command(function() {
				E.graphics.vectors.circleNow(centre, radius, colour, mapCoords);
			});
			return this;
		},

		/**
		 * Draws a circle (filled) now
		 *
		 * @method circleNow
		 * @param centre {vector} The centre of the circle
		 * @param radius {number} The radius of the circle (defaults to 50)
		 * @param colour {string} The colour of the circle (defaults to white)
		 * @param mapCoords {boolean} Whether to use map coords rather than canvas coords (defaults to canvas)
		 * @return this
		 */
		circleNow: function(centre, radius, colour, mapCoords) {
			if (mapCoords) {
				centre = E.vector.add(E.map.offset, centre);
			}
			centre = E.vector.round(centre);
			radius = Math.round(radius) || 50;
			colour = colour || 'white';
			E.graphics.gameContext.beginPath();
			E.graphics.gameContext.arc(centre.x, centre.y, radius, 0, 2 * Math.PI);
			E.graphics.gameContext.fillStyle = colour;
			E.graphics.gameContext.fill();
			return this;
		}
	};

	/**
	 * Renders the canvas and all graphics
	 *
	 * @method render
	 * @return this
	 */
	graphics.render = function() {
		if (graphics.clipping) {
			graphics.gameContext.clearRect(-E.map.offset.x, -E.map.offset.y, graphics.gameCanvas.width, graphics.gameCanvas.height);
		}
		else {
			graphics.gameContext.clearRect(-E.map.offset.x, -E.map.offset.y, graphics.viewport.width, graphics.viewport.height);
		}
		E.map.render();
		E.entities.render();
		if (E.edit && E.edit.palette && E.edit.palette.render) E.edit.palette.render();
		E.input.render();
		graphics.vectors.render();
		graphics.renderText();
		return this;
	};

	/**
	 * Changes the size of a canvas
	 *
	 * @method resizeCanvas
	 * @param name {string} the name of the canvas to be resized
	 * @param width {number} the width of the canvas in pixels
	 * @param height {number} the height of the canvas in pixels
	 * @return this
	 */
	graphics.resizeCanvas = function(name, width, height) {
		graphics[name+'Canvas'].width = width;
		graphics[name+'Canvas'].height = height;
		$('#'+name+'Canvas').css({width: +width+'px', height: height+'px'});
		return this;
	};

	return graphics;
})();