var E = E || {};

/**
 * Screen methods
 *
 * @module screen
 * @class screen
 */
E.screen = (function() {
	"use strict";
	
	/*
	 * Confirmation message before leaving with unsaved changes
	 */
	window.onbeforeunload = function() {
		if (E.screen.updated) {
			return 'You have unsaved changes. Are you sure you wish to leave?';
		}
	};

	return {
		updated: false,

		/**
		 * Initialise screen
		 *
		 * @method init
		 * @param screenId {string} The DOM ID of the initial screen to display
		 * @return this
		 */
		init: function(screenId) {
			this.history = [];
			this.change(screenId);
		},

		/**
		 * Change to another screen
		 *
		 * @method change
		 * @param screenId {string} The DOM ID of the screen to change to
		 * @param updateHistory {boolean} Whether or not to update the history (undefined defaults to true)
		 * @return this
		 */
		change: function(screenId, updateHistory) {
			if (!this.updated || window.confirm('You have unsaved changes. Are you sure you wish to continue?')) {
				updateHistory = (updateHistory === undefined) ? true : updateHistory;
				if (updateHistory) {
					this.history.push(screenId);
				}
				$('.screen').hide();
				if (screenId === 'gameContainer') {
					$('#palette').show();
				}
				else {
					$('#palette').hide();
				}
				$('#'+screenId).show();
				this.updated = false;
			}
			return this;
		},

		/**
		 * Returns the DOM ID of the current screen
		 *
		 * @method getCurrent
		 * @return {string} The DOM ID of the current screen
		 */
		getCurrent: function() {
			return this.history[this.history.length-1];
		},

		/**
		 * Return to previous screen
		 *
		 * @method previous
		 * @return this
		 */
		previous: function() {
			if (!this.updated || window.confirm('You have unsaved changes. Are you sure you wish to continue?')) {
				this.history.pop();
				this.save();
				this.change(this.getCurrent(), false);
			}
		},

		/**
		 * Actions to take when the current screen is updated
		 *
		 * @method update
		 */
		update: function() {
			$('.save').val('Save*').text('Save*');
			this.updated = true;
		},

		/** 
		 * Actions to take when the screen is saved
		 *
		 * @method save
		 * @return this
		 */
		save: function() {
			$('.save').val('Save').text('save');
			this.updated = false;
		},

		/**
		 * Gets the current save state for the screen
		 *
		 * @method isUnsaved
		 * @return {boolean} true means unsaved
		 */
		isUnsaved: function() {
			return this.updated;
		}
	};
})();