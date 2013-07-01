var valFromString = function(name) {
	var value = window,
		names = name.split('.');
	for (var i=0; i<names.length; i++) {
		value = value[names[i]];
	}
	return value;
};