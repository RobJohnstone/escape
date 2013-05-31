$(function() {
	$('#load').click(function() {
		var map = $('#mapName').val();
		if (map.length === 0) {
			alert('You have not entered a map name');
		}
		else {
			game.init(map);
		}	
	});
	$('#mapName').focus().select().on({
		keyup: function(e) {
			if (e.which === 13) {
				$('#load').click();
			}
		}
	});
});

var game = {};

game.init = function(mapName) {
	game.mode = 'edit';
	graphics.init(800, 600, false);
	map.load(mapName, '', 64, 64, game.start);
	palette.init();
};

game.start = function() {
	input.start('edit');
	game.update = true;
	game.animationFrame = window.requestAnimationFrame(game.main);
};

game.main = function() {
	input.process();
	game.info.add('input.mouseState.x');
	game.info.add('input.mouseState.y');
	game.info.add('tile', map.getTileIndex(input.mouseState.x, input.mouseState.y));
	game.info();
	map.highlightMouseTile();
	if (game.update) {
		graphics.render();
		game.update = false;
	}
	game.animationFrame = window.requestAnimationFrame(game.main);
};

game.info = (function() {
	var create = true;
	return function() {
		if (create) {
			$('#gameContainer').append('<div id="info"></div>');
			create = false;
		}
		$('#info').html('<p>'+game.info.items.join('<br />')+'</p>');
		game.info.items = [];
	};
})();

game.info.items = [];

game.info.add = function(name, value) {
	if (arguments.length === 1) game.info.items.push(name+': '+valFromString(name));
	else if (arguments.length === 2) game.info.items.push(name+': '+value);
};

var palette = {};

palette.updatedMap = function() {
	$('#saveMap').text('Save map*');
	map.updated = true;
};

palette.tools = {
	wall: {
		type: 'terrain',
		tilesetIndex: 1
	},
	floor: {
		type: 'terrain',
		tilesetIndex: 0
	},
	removeActor: {
		type: 'eraser',
		targetType: 'actor',
		click: function(tileIndex) {
			var coords = map.getTileCentre(tileIndex);
			console.log(coords);
			console.log(map.actors);
			for (var i=0; i<map.actors.length; i++) {
				if (map.actors[i].x === coords.x && map.actors[i].y === coords.y) {
					map.actors.splice(i, 1);
					entities.instances = [];
					map.init();
					game.update = true;
				}
			}
		}
	},
	baddy: {
		type: 'entity',
		click: function(tileIndex) {
			var baddy = map.getTileCentre(tileIndex);
			$.extend(baddy, {type: 'baddy'})
			map.actors.push(baddy);
			map.init();
			game.update = true;		
		}
	}
};

palette.currentTool = 'wall';

palette.show = function() {
	$('#palette').show();
};

palette.hide = function() {
	$('#palette').hide();
};

palette.init = function() {
	palette.show();
	palette.$ = $('#palette');
	for (toolName in palette.tools) {
		palette.$.append('<p class="tool" id="'+toolName+'">'+toolName+'<p>');
	}
	$('#'+palette.currentTool).addClass('selected');
	$('#gameCanvas').on({
		click: function() {
			var tileIndex = map.getTileIndex(input.mouseState.x, input.mouseState.y),
				tilesetIndex;
			if (typeof palette.tools[palette.currentTool].click === 'function') {
				palette.tools[palette.currentTool].click(tileIndex);
			}
			else {
				tilesetIndex = palette.tools[palette.currentTool].tilesetIndex;
				map.data[tileIndex] = tilesetIndex
				game.update = true;
			}
			palette.updatedMap();
		}
	});
};

$(function() {
	$('#palette').on({
		click: function() {
			var toolName = $(this).attr('id');
			$('.tool').removeClass('selected');
			$('#'+toolName).addClass('selected');
			palette.currentTool = toolName;
		}
	}, '.tool');
	$('#palette').on({
		click: function() {
			map.save();
			$('#saveMap').text('Save map');
		}
	}, '#saveMap');
});

window.onbeforeunload = function() {
	if (map.updated) {
		return 'You have unsaved changes. Are you sure you wish to leave?';
	}
};