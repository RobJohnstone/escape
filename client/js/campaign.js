var E = E || {};

/**
 * Handles all state and behaviour for campaigns
 *
 * @module campaign
 * @class campaign
 */

E.campaign = (function() {
	"use strict";

	var campaign = {
		campaigns: [],
		addedMap: false
	};

	var _campaignTemplate = {
		name: '',
		description: '',
		maps: [],
		successTitle: '',
		successMessage: ''
	};

	/**
	 * Loads a campaign
	 *
	 * @method load
	 * @param campaignName {string} The name of the campaign. If campaignName is an object it treats that
	 * as the campaignObj rather than loading via ajax
	 * @param callback {function} A function to execute once the campaign has been loaded successfully
	 * @return this
	 */
	campaign.load = function(campaignName, callback) {
		if (typeof campaignName === 'object') {
			_successHandler(campaignName);
		}
		else {
			$.ajax({
				url: '/campaigns/'+campaignName,
				type: 'get',
				dataType: 'json',
				success: function(campaignObj) {
					_successHandler(campaignObj);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					throw new Error('campaign loading error: '+textStatus);
				}
			});
		}
		return this;

		function _successHandler(campaignObj) {
			campaign.data = campaignObj;
			campaign.current = 0;
			campaign.render();
			if (typeof callback === 'function') {
				callback();
			}
		}
	};

	/**
	 * Gets the name of the current map
	 *
	 * @method getCurrentmap
	 * @return {string} The name of the current map
	 */
	campaign.getCurrentmap = function() {
		return campaign.data.maps[campaign.current];
	};

	/**
	 * Sets the current map
	 *
	 * @method setCurrentmap
	 * @param the name of the map
	 * @return {Number} The index of the current map, -1 if the map does not exist in the campaign
	 */
	campaign.setCurrentmap = function(mapName) {
		var index = campaign.data.maps.indexOf(mapName);
		campaign.current = (index !== -1) ? index : campaign.current;
		return index;
	};

	/**
	 * Populates the relevant DOM elements with campaign information
	 *
	 * @method render
	 * @return this;
	 */
	campaign.render = function() {
		var campaignTemplate = $('#campaignScreenTemplate').text().trim(),
			campaignCompiled = _.template(campaignTemplate),
			successTemplate = $('#campaignSuccessTemplate').text().trim(),
			successCompiled = _.template(successTemplate);
		$('#campaignScreen').html(campaignCompiled(campaign.data));
		$('#campaignSuccess').html(successCompiled(campaign.data));
		return this;
	};

	/**
	 * Creates a new campaign. The only field populated is the name.
	 * This method does not save the newly created campaign (use campaign.save())
	 *
	 * @method create
	 * @param name {string} The name of the new campaign
	 * @return this
	 */
	campaign.newCampaign = function(name) {
		var newCampaign = _campaignTemplate.clone();
		if (name !== '') {
			newCampaign.name = name;
		}
		campaign.load(newCampaign);
		E.screen.update();
		return this;
	};

	/**
	 * Saves the current information about the campaign
	 * Note: this requires that the server is in 'dev' mode
	 *
	 * @method save
	 * @param callback {function} The function to execute once the campaign has been saved
	 * @return this
	 */
	campaign.save = function(callback) {
		$.ajax({
			url: '/campaigns/'+campaign.data.name,
			type: 'post',
			data: 'data='+JSON.stringify(campaign.data),
			success: function(result) {
				campaign.list();
				if (typeof callback === 'function') {
					callback(result);
				}
			}
		});
		return this;
	};

	/**
	 * updates the value of a field in the campaign
	 * can remove the prefix campaign from property names while preserving camel-casing
	 *
	 * @method update
	 * @param field {string} The field to update (either the property name or a the id of a form element associated with that property)
	 * @param value {any} The new value
	 * @return this
	 */
	campaign.update = function(field, value) {
		if (field.substr(0, 8) === 'campaign') {
			field = field.substr(8);
			field = field.charAt(0).toLowerCase() + field.slice(1);
		}
		campaign.data[field] = value;
		return this;
	};

	/**
	 * Adds a map to the campaign
	 * Note this does not check whether the map actually exists
	 *
	 * @method addMap
	 * @param mapName {string} The name of the map
	 * @param index {number} The index which this map should occupy within the 
	 * array (defaults to adding the map to the end)
	 * @return this
	 */
	campaign.addMap = function(mapName, index) {
		mapName = mapName || campaign.addedMap;
		if (index === undefined) {
			campaign.data.maps.push(mapName);
		}
		else {
			campaign.data.maps.splice(index, 0, mapName);
		}
		E.campaign.addedMap = false;
		return this;
	};

	/**
	 * Moves the map up one in the order (nearer the start)
	 *
	 * @param mapName {string} The name of the map
	 * @return this;
	 */
	campaign.moveMapUp = function(mapName) {
		var mapsArr = campaign.data.maps,
			currentIndex = mapsArr.indexOf(mapName);
		if (currentIndex > 0) {
			campaign.data.maps = util.moveArrayElement(mapsArr, currentIndex, currentIndex-1);
			campaign.render();
		}
		return this;
	};

	/**
	 * Moves the map down one in the order (nearer the end)
	 *
	 * @param mapName {string} The name of the map
	 * @return this;
	 */
	campaign.moveMapDown = function(mapName) {
		var mapsArr = campaign.data.maps,
			currentIndex = mapsArr.indexOf(mapName);
		if (currentIndex < mapsArr.length-1) {
			campaign.data.maps = util.moveArrayElement(mapsArr, currentIndex, currentIndex+1);
			campaign.render();
		}
		return this;
	};

	/**
	 * Populates the relevant DOM ul with the campaigns
	 *
	 * @method list
	 * @return this
	 */
	campaign.list = function() {
		var template = $('#campaignListItemTemplate').text().trim(),
			compiled = _.template(template),
			html = [];
		$.ajax({
			url: '/campaigns',
			type: 'GET',
			dataType: 'json',
			success: function(campaigns) {
				campaign.campaigns = campaigns;
				campaigns.forEach(function(campaignName) {
					html.push(compiled({name: campaignName}));
				});
				$('#campaignList').html(html.join(''));
			}
		});
		return this;
	};

	return campaign;
})();