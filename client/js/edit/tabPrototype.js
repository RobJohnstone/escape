/**
 * Prototype for all editor palette tabs.
 *
 * For more information on how Escape uses inheritance see objectPrototype.js
 *
 * @module edit
 * @class tabPrototype
 */

 E.edit.tabPrototype = (function() {
	"use strict";

	var tab = {};

	/**
	 * Initialises the tab
	 *
	 * @method init
	 * return this
	 */
	tab.init = function() {
		this._tools = [];
		return this;
	};

	/**
	 * Adds a tool to the tab
	 *
	 * @method addTool
	 * @param tool {Object}
	 * @return this
	 */
	tab.addTool = function(tool) {
		this._tools.push(tool);
		return this;
	};

	/**
	 * Adds many tools to the tab in one go
	 *
	 * @method @addTools
	 * @param tools {Object} Each property of tools is expected to be an indvidual tool
	 * @return this
	 */
	tab.addTools = function(tools) {
		for (var tool in tools) {
			if (tools.hasOwnProperty(tool)) {
				this.addTool(tools[tool]);
			}
		}
		return this;
	};

	/**
	 * Renders the tab
	 *
	 * @method render
	 * @param tabContainer {jElement}
	 * @return this
	 */
	tab.render = function(tabContainer) {
		var tabName = this.label;
		this._tools.forEach(function(tool, index) {
			tabContainer.append('<p class="command" id="'+tabName+'_command_'+index+'">'+tool.label+'</p>');
		});
		this._initialiseEvents(tabContainer);
		return this;
	};

	/**
	 * Initialises the tab's events
	 *
	 * @private
	 * @method _initialiseEvents
	 * @param tabContainer {jElement}
	 * @return this;
	 */
	tab._initialiseEvents = function(tabContainer) {
		tabContainer.on('click', '.command', this._commandClickHandler.bind(this));
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
	tab._commandClickHandler = function(event) {
		var commandButton = event.currentTarget,
			index = commandButton.id.split('_')[2],
			tool = this._tools[index];
		if (typeof tool.execute === 'function') {
			tool.execute();
		}
		else if (typeof tool.select === 'function') {
			tool.select();
			E.edit.palette.setCurrentTool(tool);
			$('.currentTool').removeClass('currentTool');
			$(event.currentTarget).addClass('currentTool');
		}
		return this;
	};

	return tab;

})();