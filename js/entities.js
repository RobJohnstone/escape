var entities = {};

entities.instances = [];

entities.process = function() {
	var currentInstances = [];
	for (var i=0; i<entities.instances.length; i++) {
		entities.instances[i].process();
		if (!entities.instances[i].remove) {
			currentInstances.push(entities.instances[i]);
		}
	}
	entities.instances = currentInstances;
};

entities.render = function() {
	for (var i=0; i<entities.instances.length; i++) {
		entities.instances[i].render();
	}
};

var entityPrototype = {
	hittable: false,
	init: function(params) {
		$.extend(this, params);
		this.halfWidth = this.width / 2;
		this.halfHeight = this.height / 2;
		entities.instances.push(this);
		return this;
	},
	process: function() {},
	render: function() {
		var x = map.xOffset + this.x,
			y = map.yOffset + this.y;
		graphics.gameContext.beginPath();
		graphics.gameContext.arc(x, y, this.halfWidth, 0, 2 * Math.PI);
		graphics.gameContext.fillStyle = this.colour;
		graphics.gameContext.fill();
	}
};