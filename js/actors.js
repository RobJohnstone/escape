var actors = {
	create: function(actor) {
		var actorDefinition = this[actor.type];
		$.extend(actorDefinition, actor);
		actorDefinition.initial = $.extend({}, actorDefinition);
		Object.create(actorDefinition.prototype).init(actorDefinition);
	},
	player: {
		prototype: actorPrototype,
		width: 32,
		height: 32,
		colour: 'green',
		speed: 5,
		direction: {x: 1, y: 0},
		invulnerable: false
	},
	baddy: {
		prototype: baddyPrototype,
		width: 32,
		height: 32,
		colour: 'red',
		maxRange: 500,
		mode: 'watch',
		idealRange: 500,
		speed: 5,
		direction: {x: 1, y: 0}
	}
};