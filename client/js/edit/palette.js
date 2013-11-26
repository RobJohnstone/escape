/**
 * Command palette for the game editor
 *
 * @module edit
 * @class palette
 */

E.edit.palette = (function() {
	"use strict";

	var palette = {};

	/**
	 * Displays the command palette
	 *
	 * @method show
	 * @return this
	 */
	palette.show = function() {
		$('#palette').show();
		return this;
	};

	/**
	 * Hides the command palette
	 *
	 * @method hide
	 * @return this
	 */
	palette.hide = function() {
		$('#palette').hide();
		return this;
	};

	/**
	 * Initialises the command palette
	 *
	 * @method init
	 * @return this
	 */
	palette.init = function() {
		if (!this._initialised) {
			this._initialised = true;
			this._tabs = [];
			this._container = $('#palette');
			this._tabsBar = this._container.find('.tabsBar');
			this._tabsContainer = this._container.find('.tabs');

			this._addToolsTab()
				._addTilesTab()
				._initialiseEvents();
		}
		return this;
	};

	/**
	 * Initialises the tools tab and adds it to the palette
	 *
	 * @private
	 * @method _addToolsTab
	 * @return this
	 */
	palette._addToolsTab = function() {
		var toolsTab = E.edit.tabPrototype.create({
			label: 'Tools'
		});
		toolsTab.addTools(E.edit.tools);
		this.addTab(toolsTab);
		return this;
	};

	/**
	 * Initialises the tiles tab and adds it to the palette
	 *
	 * @private
	 * @method _addTilesTab
	 * @return this
	 */
	palette._addTilesTab = function() {
		var tilesTab = E.edit.tilesTab.create({
			label: 'Tiles'
		});
		tilesTab.setTiles(E.tiles);
		this.addTab(tilesTab);
		return this;
	};

	/**
	 * Adds a tab to the palette
	 *
	 * @method addTab
	 * @param tab {Object} The object representing the tab
	 * @return this
	 */
	palette.addTab = function(tab) {
		this._tabs.push(tab);
		return this;
	};

	/**
	 * Event handler for when a tab button is clicked
	 *
	 * @method clickTabButton
	 * @param event {jEvent}
	 * @return this;
	 */
	palette.clickTabButton = function(event) {
		var tabId = event.currentTarget.id.substr(10);
		this.setCurrentTab(this._tabs[tabId].label);
		return this;
	};

	/**
	 * Sets the current tab
	 *
	 * @method setCurrentTab
	 * @param name {string} The name of the tab
	 * @return this
	 */
	palette.setCurrentTab = function(name) {
		this._currentTab = name;
		this._renderTabs();
		return this;
	};

	/**
	 * Renders the tabs
	 *
	 * @private
	 * @method _renderTabs
	 * @return this
	 */
	palette._renderTabs = function() {
		if (!this._currentTab && this._tabs.length > 0) {
			this.setCurrentTab(this._tabs[0].label);
		}
		this._tabsContainer.html('');
		this._tabsBar.html('');
		this._tabs.forEach(this._renderTab, this);
		return this;
	};

	/**
	 * Renders a tab
	 *
	 * @private
	 * @method _renderTab
	 * @param tab {Object} the object representing the tab
	 * @param id {Number} an id uniquely identifying the tab
	 * @return this
	 */
	palette._renderTab = function(tab, id) {
		var tabContent = $('<div id="tab_'+id+'" class="tab"></div>');
		this._renderTabButton(tab, id);
		if (tab.label === this._currentTab) {
			tabContent.addClass('selectedTab');
		}
		tab.render(tabContent);
		this._tabsContainer.append(tabContent);
	};

	/**
	 * Renders the button used to select the tab
	 *
	 * @private
	 * @method _renderTabButton
	 * @param tab {Object} the object representing the tab
	 * @param id {Number} an id uniquely identifying the tab
	 * @return this
	 */
	palette._renderTabButton = function(tab, id) {
		var tabButton = $('<div id="tabButton_'+id+'" class="tabButton">'+tab.label+'</div>');
		if (tab.label === this._currentTab) {
			tabButton.addClass('selectedTabButton');
		}
		this._tabsBar.append(tabButton);
	};

	/**
	 * Sets the current tool
	 *
	 * @method setCurrentTool
	 * @param tool {Object}
	 * @return this
	 */
	palette.setCurrentTool = function(tool) {
		this._currentTool = tool;
		return this;
	};

	/**
	 * Gets the current tool
	 *
	 * @method getCurrentTool
	 * @return {object} The current tool
	 */
	palette.getCurrentTool = function() {
		return this._currentTool;
	};

	/**
	 * Renders palette
	 *
	 * @method renderPalette
	 */
	palette.renderPalette = function() {
		this._renderTabs();
	};

	/**
	 * Uses the current tool at the mouse cursor position over the map
	 *
	 * @private
	 * @method _useSelectedTool
	 * @return this;
	 */
	palette._useSelectedTool = function() {
		var tool = this.getCurrentTool(),
			tileIndex = E.map.getTileIndex(E.input.mouseState);
		if (tool && typeof tool.use === 'function') {
			tool.use(tileIndex);
		}
		E.screen.update();
		return this;
	};

	/**
	 * Renders the tool overlays on the canvas
	 * But not the palette itself - see renderPalette
	 *
	 * @method render
	 * @return this
	 */
	palette.render = function() {
		var tool = this.getCurrentTool();
		if (tool && typeof tool.render === 'function') {
			tool.render();
		}
		return this;
	};

	/*
	 * Initialise event handlers
	 *
	 * @return this;
	 */
	palette._initialiseEvents = function() {
		$('#gameContainer').on('click', palette._useSelectedTool.bind(this));
		this._tabsBar.on('click', '.tabButton', this.clickTabButton.bind(this));
		return this;
	};

	return palette;

})();