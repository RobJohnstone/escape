/** 
 * Code for the game editor
 *
 * @module game
 */

var E = {}; // global namespace object

/**
 * @class game
 */
E.game = (function() {
	"use strict";

	/**
	 * Event handlers for map selection screen
	 */
	$(function() {
		$('#campaignList').on('click', '.campaignName', function() {
			var campaignName = $(this).attr('id').substr(9);
			E.campaign.load(campaignName, function() {
				E.screen.change('campaignScreen');
			});
		});
		$('#newCampaign').on('keyup', function(e) {
			$('#campaignError').slideUp();
			if (e.which === 13) {
				$('#createNewCampaign').click();
			}
		});
		$('#createNewCampaign').click(function() {
			var campaignName = $.trim($('#newCampaign').val());
			if (campaignName === '') {
				$('#campaignError').text('To create a campaign, please enter a name').show();
			}
			else if (E.campaign.campaigns.indexOf(campaignName) !== -1) {
				$('#campaignError').text('This campaign already exists!').show();
			}
			else {
				E.screen.change('campaignScreen');
				E.campaign.newCampaign(campaignName);
				$('.field').val('');
			}
		});
		$('body').on('click', '.back', function() {
			E.screen.previous();
		});
		$('#campaignScreen').on('click', '#saveCampaign', function() {
			E.campaign.save();
		});
		$('body').on('click', '.save', function() {
			E.palette.relinquishTool();
			E.screen.save();
		});
		$('body').on('click', '.list .delete', function(e) {
			_deleteItem(this);
			e.stopPropagation();
		});
		$('body').on('click', '.editable', function() { // This is to make it easier to select empty elements
			var elm = $(this).children('[contenteditable]');
			elm.focus();
		});
		$('body').on('blur keyup paste', '[contenteditable]', function() {
			_editItem(this);
		});
		$('#campaignScreen').on('click', '.mapName', function() {
			var mapName = $(this).attr('id').substr(4);
			E.map.load(mapName, function() {
				E.screen.change('mapScreen');
			});
		});
		$('#campaignScreen').on('keyup', '#newMap', function(e) {
			var mapName = $(this).val().trim(),
				mapObj;
			$('#mapListError').slideUp();
			if (e.which === 13) {
				if (mapName.length) {
					mapObj = E.map.newMap(mapName);
					E.map.init(mapObj);
					E.screen.change('mapScreen').update();
					E.campaign.addedMap = mapName;
					$('.field').val('');
				}
				else {
					$('#mapListError').text('Please enter a name for this map').show();
				}
			}
		});
		$('#campaignScreen').on('click', '.moveUp', function(e) {
			var mapName = $(this).siblings('.mapName').attr('id').substr(4);
			E.campaign.moveMapUp(mapName);
			E.screen.update();
			e.stopPropagation();
		});
		$('#campaignScreen').on('click', '.moveDown', function(e) {
			var mapName = $(this).siblings('.mapName').attr('id').substr(4);
			E.campaign.moveMapDown(mapName);
			E.screen.update();
			e.stopPropagation();
		});
		$('#mapScreen').on('click', '#saveMapMeta', function() {
			E.map.save();
			/*
			 * The next line is to cover the scenario where this is a new map being added to 
			 * a campaign. Ideally this would be tracked rather than sending a potentially 
			 * unnecessary ajax request. More importantly, if many users are simultaneously working on 
			 * the same campaign, this could result in data being overwritten when it should not be.
			 */
			if (E.campaign.addedMap) {
				E.campaign.addMap();
				E.campaign.save().render();
			}
		});
		$('#mapScreen').on('click', '#editMap', function() {
			if (E.screen.updated) {
				if (confirm('This map must be saved before it can be edited. Do you wish to save the map now?')) {
					E.map.save();
					E.screen.save();
					_editMap();
				}
			}
			else {
				_editMap();
			}

			function _editMap() {
				game.reset();
				game.init(E.map.name);
				E.screen.change('gameContainer');
			}
		});
		// keyboard shortcuts
		$(window).bind('keydown', function(e) {
			var key = String.fromCharCode(e.which).toLowerCase();
			if (e.ctrlKey || e.metaKey) { // I believe (but am far from certain!) that some browsers on some operating systems consider ctrl to be the 'meta' key
				if (key === 's') {
					$('.save:visible').click();
					return false;
				}
			}
			if (e.which === 37) {
				$('.back:visible').click();
				return false;
			}
		});
	});

	/**
	 * sends a request to the server instructing it to delete a file
	 *
	 * @method _deleteItem
	 * @private
	 * @param element {DOM element} The delete button. Assuumes that the parent element has sufficent info in its class and id to identify the element to be deleted
	 * @param callback {function} The function to be executed after the request has been completed
	 */
	function _deleteItem(element, callback) {
		var parent = $(element).parent(),
			type = parent.attr('class'),
			id = parent.children('.'+type+'Name').attr('id').substr(type.length+1);
		if (window.confirm('Are you sure sure you want to delete the '+type+' '+id+'?')) {
			parent.slideUp(400, function() {
				this.remove();
			});
			$.ajax({
				url: '/'+type+'s/'+id,
				type: 'delete',
				success: function() {
					if (typeof callback === 'function') {
						callback(id);
					}
					else if (type === 'campaign') {
						_deleteCampaign(id);
					}
					else if (type === 'map') {
						_deleteMap(id);
					}
				}
			});
		}
	}

	function _deleteCampaign(id) {
		var list = E.campaign.campaigns,
			index = list.indexOf(id);
		list.splice(index, 1);
	}

	function _deleteMap(id) {
		var list = E.campaign.data.maps,
			index = list.indexOf(id);
		list.splice(index, 1);
		E.campaign.save();
	}

	/** 
	 * Updates the value of an item
	 *
	 * @method _editItem
	 * @private
	 * @param element {DOM Element} The DOM element being updated
	 */
	var _editItem = function(element) {
		var type = E.screen.getCurrent().slice(0, -6),
			field = $(element).attr('id'),
			value = $(element).text();
		E[type].update(field, value);
		E.screen.update();
	};

	var game = {};

	/**
	 * Carries out all initialisation actions
	 *
	 * @method init
	 * @param mapName {string} or a mapObj
	 * @return this
	 */
	game.init = function(mapName) {
		game.mode = 'edit';
		E.graphics.init(800, 600, false);
		E.map.load(mapName, game.start);
		E.palette.init();
		return this;
	};

	/**
	 * Starts any modules that need starting and then begins the game loop
	 *
	 * @method start
	 * @return this
	 */
	game.start = function() {
		if (!E.graphics.clipping) {
			E.graphics.resizeCanvas('game', E.map.tileWidth * E.map.columns, E.map.tileHeight * E.map.rows);
		}
		E.input.start('edit');
		game.update = true;
		game.animationFrame = window.requestAnimationFrame(game.main);
		return this;
	};

	/**
	 * The body of the game loop
	 *
	 * @method main
	 * @return this
	 */
	game.main = function() {
		E.input.process();
		game.info.add('E.input.mouseState.x');
		game.info.add('E.input.mouseState.y');
		game.info.add('tile', E.map.getTileIndex(E.input.mouseState));
		game.info();
		E.map.highlightMouseTile();
		if (game.update) {
			E.graphics.render();
			game.update = false;
		}
		game.animationFrame = window.requestAnimationFrame(game.main);
		return this;
	};

	/**
	 * Resets game state when map data changes
	 *
	 * @method reset
	 * @return this
	 */
	game.reset = function() {
		E.entities.instances = [];
		E.map.init();
		game.update = true;
		return this;
	};

	/**
	 * A singleton DOM element. On first call creates the DOM element. On all calls populates the DOM element with the items
	 * in the game.info.items array.
	 *
	 * @method info
	 * @return game {object}
	 */
	game.info = (function() {
		var create = true;
		return function() {
			if (create) {
				$('#gameContainer').append('<div id="info"></div>');
				create = false;
			}
			$('#info').html('<p>'+game.info.items.join('<br />')+'</p>');
			game.info.items = [];
			return game;
		};
	})();

	game.info.items = [];

	/**
	 * Adds an item to the game.info.items array. 
	 * If one argument, adds the variable name and value
	 * If two, adds both separated by a colon
	 *
	 * @method info.add
	 * @param name {string} The name of the value to be displayed (basically a label)
	 * @param value {string} The value to be displayed. If not a string, it will be coerced into one
	 * @return game {object}
	 */
	game.info.add = function(name, value) {
		if (arguments.length === 1) game.info.items.push(name+': '+E.util.valFromString(name));
		else if (arguments.length === 2) game.info.items.push(name+': '+value);
		return game;
	};

	/*
	 * Code entry point
	 */
	$(function() {
		E.screen.init('selectCampaign');
	});

	return game;
})();