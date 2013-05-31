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
	init: (function() {
		if (counter === undefined) {
			var counter=0;
		}
		return function(params) {
			$.extend(this, params);
			this.entityId = counter++;
			this.halfWidth = this.width / 2;
			this.halfHeight = this.height / 2;
			entities.instances.push(this);
			return this;
		}
	})(),
	process: function() {},
};