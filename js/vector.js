var vector = {};

vector.distance = function(startX, startY, endX, endY) {
	var dx = endX - startX,
		dy = endY - startY;
	return Math.sqrt(dx*dx + dy*dy);
};