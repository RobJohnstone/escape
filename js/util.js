var valFromString = function(name) {
	var value = window,
		names = name.split('.');
	for (var i=0; i<names.length; i++) {
		value = value[names[i]];
	}
	return value;
};

Object.prototype.create = function() {
	var object = Object.create(this);
	if (typeof object.init === "function") object.init.apply(object, arguments);
	return object;
};