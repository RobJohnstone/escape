/**
 * The tiles tab
 *
 * @module edit
 * @class tilesTab
 * @extends tabPrototype
 */

 E.edit.tilesTab = (function() {
	"use strict";

	var tilesTab = E.edit.tabPrototype.extend();

	/**
	 * Initialises the tab
	 *
	 * @method init
	 * return this
	 */
	tilesTab.init = function() {
		this._selectedTile = null;
		E.edit.tabPrototype.init.apply(this);
		return this;
	};

	/**
	 * Tells the tab which tiles to use
	 *
	 * @method setTiles
	 * @param tiles {Object}
	 * @return this
	 */
	tilesTab.setTiles = function(tiles) {
		this._tiles = tiles;
		return this;
	};

	/**
	 * Renders the tiles within the tab
	 *
	 * @private
	 * @method _renderTiles
	 * @return {jElement} a jQuery object representing a DOM node containing the tile buttons
	 */
	tilesTab._renderTiles = function() {
		var tabName = this.label,
			tileButtons = $('<ul class="tileButtons"></ul>'),
			tileButton,
			tileImage;
		this._tiles.tileset.forEach(function(tile, index) {
			tileButton = $('<li class="command tileButton" id="'+tabName+'_command_'+index+'"></li>');
			tileButton.width(this._tiles.tileWidth);
			tileButton.height(this._tiles.tileHeight);
			tileButton.css({
				'background-image': 'url('+this._tiles._imageUrl+')',
				'background-position': (-index * this._tiles.tileWidth)+'px 0'
			});

			tileButtons.append(tileButton);
		}, this);
		return tileButtons;
	};

	/**
	 * Renders the tiles tab
	 * Also initialises the event handlers that depend on the tab being rendered
	 *
	 * @method render
	 * @param tabContainer {jElement}
	 * @return this
	 */
	tilesTab.render = function(tabContainer) {
		tabContainer.html('');
		tabContainer.append(this._renderTiles());

		this._initialiseEvents(tabContainer);
		return this;
	};

	/**
	 * Handles clicking on a tool in the tab
	 *
	 * @private
	 * @method _commandClickHandler
	 * @param event {jEvent} The click event
	 * @return this
	 */
	tilesTab._commandClickHandler = function(event) {
		var commandButton = event.currentTarget,
			index = commandButton.id.split('_')[2];

		$('.tileButton').removeClass('selected');
		$(commandButton).addClass('selected');
		E.edit.palette.setCurrentTool({
			use: function(tileIndex) {
				E.map.data[tileIndex] = index;
				E.map.mapObj.data[tileIndex] = index;
				E.game.update = true;
			}
		});
	};

	return tilesTab;
})();