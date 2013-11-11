var E = E || {};

/**
 * Loads remote assets
 *
 * @module assetLoader
 * @class assetLoader
 */

E.assetLoader = (function() {
	"use strict";

	var assetLoader = {
		loaded: false,
		totalAssets: 0,
		loadedAssets: 0,
		assetCache: {}
	};

	/**
	 * Loads an asset
	 *
	 * @param type {string} The type of asset to be loaded
	 * @param onLoad {function} The callback to be used once the asset has been loaded (the asset will be passed as the argument)
	 * @param args* {any} arguments specific to the type of asset being loaded
	 * @return this
	 */
	assetLoader.load = function(type, onLoad) {
		var args = Array.prototype.slice.call(arguments, 1);
		if (typeof assetLoader.load[type] === 'function') {
			assetLoader.load[type].apply(null, args);
		}
		else {
			throw new Exception("This asset type is not recognised: " + type);
		}
		assetLoader.loaded = false;
		assetLoader.totalAssets++;
	};

	/**
	 * Loads maps
	 *
	 * @param onLoad {function} The callback to be invoked once the image has loaded
	 * @param mapName {string} The name of the map
	 */
	assetLoader.load.map = function(onLoad, mapName) {
		var url = '/maps/'+mapName;
		assetLoader.load.generic(onLoad, url, 'json');
	};

	/**
	 * Loads images
	 *
	 * @param onLoad {function} The callback to be invoked once the image has loaded
	 */
	assetLoader.load.image = function(onLoad, url) {
		var image = assetLoader.getFromCache(url);
		if (image !== undefined) {
			assetLoader.load._success(url, image, onLoad);
		}
		else {
			image = new Image();
			image.src = url;
			image.onload = function() {
				assetLoader.load._success(url, this, onLoad);
			};
		}
	};

	/**
	 * Conducts the ajax request to load an asset
	 *
	 * @param onLoad {function} The callback for once this asset has loaded
	 * @param url {string} The url of the asset
	 * @param [dataType] {string} The type of the data returned from the server (follows jQuery ajax API)
	 * @return this
	 */
	assetLoader.load.generic = function(onLoad, url, dataType) {
		var asset = assetLoader.getFromCache(url);
		if (asset !== undefined) {
			assetLoader.load._success(url, asset, onLoad);
		}
		else {
			$.ajax({
				url: url,
				type: 'get',
				dataType: dataType,
				success: function(result) {
					assetLoader.load._success(url, result, onLoad);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					assetLoader.load._error(jqXHR, textStatus, errorThrown);
				}
			});
		}
		return this;
	};

	/**
	 * The action to take when an asset has been successfully loaded
	 *
	 * @param result {string or as determined by dataType param passed into assetLoader.load.generic}
	 * @param onLoad {function} The callback following a successful load
	 */
	assetLoader.load._success = function(url, result, onLoad) {
		assetLoader.addToCache(url, result);
		util.invokeCallback(onLoad, result);
		assetLoader.loadedAssets++;
		if (assetLoader.loadedAssets === assetLoader.totalAssets) {
			util.invokeCallback(assetLoader.onLoad);
		}
	};

	/**
	 * The action to take when an asset has failed to load
	 *
	 * @param jqXHR 
	 * @param textStatus
	 * @param errorThrown
	 */
	assetLoader.load._error = function(jqXHR, textStatus, errorThrown) {
		throw new Error('map loading error: '+textStatus);
	};

	/**
	 * Adds an asset to the asset cache
	 *
	 * @param url {String} the url of the asset (used as an id)
	 * @param data {any} the asset data
	 * @return this
	 */
	assetLoader.addToCache = function(url, data) {
		assetLoader.assetCache[url] = data;
		return this;
	};

	/**
	 * Retrieves an asset from the cache if it exists or returns null
	 *
	 * @param url {String} The url of the asset
	 * @return {any} The asset if it is in cache, undefined otherwise
	 */
	assetLoader.getFromCache = function(url) {
		return assetLoader.assetCache[url];
	};

	return assetLoader;
})();