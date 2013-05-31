var valFromString = function(name) {
	var value = 'window',
		names = name.split('.');
	for (key in names) {
		value = value+'.'+names[key];
	}
	return eval('('+value+')');
};