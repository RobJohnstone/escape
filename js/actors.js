var actors = {
	create: function(actor) {
		var actorDefinition = this[actor.type];
		$.extend(actorDefinition, actor);
		Object.create(actorDefinition.prototype).init(actorDefinition);
	},
	player: {
		prototype: actorPrototype,
		width: 32,
		height: 32,
		colour: 'green',
		speed: 5,
		direction: Math.PI / 4,
		invulnerable: false
	},
	baddy: {
		prototype: baddyPrototype,
		width: 32,
		height: 32,
		colour: 'red',
		maxRange: 2000,
		mode: 'watch',
		idealRange: 1024,
		speed: 5,
		direction: Math.PI / 2
	}
};