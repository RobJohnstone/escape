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
	 * @param onLoad {function} The call to be used once the map has loaded
	 * @param mapName {string} The name of the map
	 */
	assetLoader.load.map = function(onLoad, mapName) {
		$.ajax({
			url: '/maps/'+mapName,
			type: 'get',
			dataType: 'json',
			success: function(mapObj) {
				E.map.init(mapObj);
				util.invokeCallback(onLoad);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				throw new Error('map loading error: '+textStatus);
			}
		});
	};

	return assetLoader;
})();