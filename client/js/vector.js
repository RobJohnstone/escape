/**
 * A library of useful vector math functions
 *
 * At first glance it may appear that a nicer syntax could be obtained by creating a vector type
 * and attaching these methods to the prototype. However, the most common use case is an object
 * of a different type that happens to have x and y properties. As using apply/call is fiddly
 * in terms of syntax and multiple inheritance is memory inefficient in javascript (an object can 
 * only be linked to a single prototype), I believe this approach to be best.
 *
 * @module vector
 * @class vector
 */

E.vector = (function() {
	"use strict";

	var vector = {};

	/**
	 * returns a vector with integer values for both x and y coordinates
	 *
	 * This is particularly useful when rendering to the canvas where there is a big performance hit for non-integer values
	 *
	 * @method round
	 * @param v {vector} The vector to be rounded
	 * @return {vector} The new vector
	 */
	vector.round = function(v) {
		return {
			x: Math.round(v.x),
			y: Math.round(v.y)
		};
	};

	/**
	 * Adds two vectors together, returning the resulting vector
	 *
	 * @method add
	 * @param v1 {vector} A vector
	 * @param v2 {vector} A vector
	 * @return {vector} The resulting vector
	 */
	vector.add = function(v1, v2) {
		return {
			x: v1.x + v2.x,
			y: v1.y + v2.y
		};
	};

	/**
	 * Returns a new vector that is a copy of the inital vector
	 *
	 * @method clone
	 * @return {vector} The new vector
	 */
	vector.clone = function(v) {
		return vector.add(v, {x:0, y:0});
	};

	/**
	 * Subtracts one vector from another
	 *
	 * @method subtract
	 * @param v1 {vector} The vector to subtract
	 * @param v2 {vector} The vector to subtract from
	 * @return {vector} The resulting vector
	 */
	vector.subtract = function(v1, v2) {
		return {
			x: v2.x - v1.x,
			y: v2.y - v1.y
		};
	};

	/**
	 * Returns a vector of the same magnitude pointing in the opposite direction
	 *
	 * @method reverse
	 * @param v {vector} The initial vector
	 * @return {vector} The new vector
	 */
	vector.reverse = function(v) {
		return vector.subtract(v, {x:0, y:0});
	};

	/**
	 * Calculates the magnitude (length) of a vector
	 *
	 * @method mag
	 * @param v {vector} The vector
	 * @return {number} The magnitude
	 */
	vector.mag = function(v) {
		return Math.sqrt((v.x * v.x) + (v.y * v.y));
	};

	/**
	 * Calculates the distance between two vectors (imagine they represent points)
	 *
	 * @method distance
	 * @param v1 {vector} The first vector
	 * @param v2 {vector} The second vector
	 * @return {number} The distance between the two vectors
	 */
	vector.distance = function(v1, v2) {
		return vector.mag(vector.subtract(v1, v2));
	};

	/**
	 * Returns a new vector pointing the same direction but with length 1
	 *
	 * @method normalise
	 * @param v {vector} The vector to normalise
	 * @return {vector} The normalised vector
	 */
	vector.normalise = function(v) {
		var length = vector.mag(v) || 1;
		return {
			x: v.x / length,
			y: v.y / length
		};
	};

	/**
	 * Returns a new vector pointing in the same direction but of the specified length
	 *
	 * @method setLength
	 * @param v {vector} The intial vector
	 * @param length {number} The new length
	 * @return {vector} The new vector
	 */
	vector.setLength = function(v, length) {
		v = vector.normalise(v);
		return {
			x: v.x * length,
			y: v.y * length
		};
	};

	/**
	 * Calculates the dot product between two vectors
	 *
	 * This can be thought of as a number indicating how closely the two vectors are aligned
	 *
	 * @method dot
	 * @param v1 {vector} The first vector
	 * @param v2 {vector} The second vector
	 * @return {number} The dot product
	 */
	vector.dot = function(v1, v2) {
		return (v1.x * v2.x) + (v1.y * v2.y);
	};

	/**
	 * The angle between two vectors (in radians)
	 *
	 * @method angle
	 * @param v1 {vector} The first vector
	 * @param v2 {vector} The second vector
	 * @param dirMatters {boolean} If true then the angle is +ve for clockwise angles, -ve for anticlockwise. If false the angle is always positive
	 * @return {number} The angle (in radians)
	 */
	vector.angle = function(v1, v2, dirMatters) {
		if (v2 === undefined) {
			v2 = {x:0, y:-1};
		}
		v1 = vector.normalise(v1);
		v2 = vector.normalise(v2);
		if (dirMatters) {
			var v1Angle = Math.atan2(v1.y, v1.x),
				v2Angle = Math.atan2(v2.y, v2.x),
				result = v2Angle - v1Angle,
				abs = Math.abs(result);
			if (abs > Math.PI) {
				result = result - (result/abs) * 2 * Math.PI;
			}
			return result;
		}
		else {
			return Math.acos(vector.dot(v1, v2));
		}
	};

	/**
	 * Converts an angle (in radians) to a normaLised vector
	 *
	 * @method angleToVector
	 * @param angle {number} The angle (directional and in radians) to convert
	 * @return {vector} The resulting normalised vector
	 */
	vector.angleToVector = function(angle) {
		return {
			x: Math.cos(angle),
			y: Math.sin(angle)
		};
	};

	return vector;
})();