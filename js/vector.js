E.vector = (function() {
	"use strict";

	var vector = {};

	vector.add = function(v1, v2) {
		return {
			x: v1.x + v2.x,
			y: v1.y + v2.y
		};
	};

	vector.clone = function(v) {
		return vector.add(v, {x:0, y:0});
	};

	vector.subtract = function(v1, v2) {
		return {
			x: v2.x - v1.x,
			y: v2.y - v1.y
		};
	};

	vector.reverse = function(v) {
		return vector.subtract(v, {x:0, y:0});
	};

	vector.mag = function(v) {
		return Math.sqrt((v.x * v.x) + (v.y * v.y));
	};

	vector.distance = function(v1, v2) {
		return vector.mag(vector.subtract(v1, v2));
	};

	vector.normalise = function(v) {
		var length = vector.mag(v) || 1;
		return {
			x: v.x / length,
			y: v.y / length
		};
	};

	vector.setLength = function(v, length) {
		v = vector.normalise(v);
		return {
			x: v.x * length,
			y: v.y * length
		};
	};

	vector.dot = function(v1, v2) {
		return (v1.x * v2.x) + (v1.y * v2.y);
	};

	vector.angle = function(v1, v2, dirMatters) {
		if (v2 === undefined) {
			v2 = {x:0, y:-1};
		}
		v1 = vector.normalise(v1);
		v2 = vector.normalise(v2);
		if (dirMatters) {
			var v1Angle = Math.atan2(v1.y, v1.x),
				v2Angle = Math.atan2(v2.y, v2.x);
			return v2Angle - v1Angle;
		}
		else {
			return Math.acos(vector.dot(v1, v2));
		}
	};

	return vector;
})();