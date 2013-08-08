describe('vector', function() {
	it('should add the vector module to the E namespace', function() {
		expect(E.vector).toBeDefined();
	});

	var vector = E.vector;

	describe('vector.round()', function() {
		it('should round vectors', function() {
			expect(vector.round({
				x: 2.5,
				y: 1.3
			})).toEqual({
				x: 3,
				y: 1
			});
		});
	});

	describe('vector.add', function() {
		it('should add vectors', function() {
			expect(vector.add({
				x: 2,
				y: 3
			},
			{
				x: 4,
				y: 5
			})).toEqual({
				x: 6,
				y: 8
			});
		});
	});

	describe('vector.clone', function() {
		var orig = {
			x: 1,
			y: 2
		};
		var cloned = vector.clone(orig);
		it('should create a new object', function() {
			expect(cloned).not.toBe(orig);
		});
		it('should create an identical copy', function() {
			expect(cloned).toEqual(orig);
		});
	});

	describe('vector.subtract', function() {
		it('should add vectors', function() {
			expect(vector.subtract({
				x: 2,
				y: 3
			}, {
				x: 4,
				y: 5
			})).toEqual({
				x: 2,
				y: 2
			});
		});
	});

	describe('vector.reverse', function() {
		it('should return a vector of the same magnitude pointing in the opposite direction', function() {
			expect(vector.reverse({
				x: 1,
				y: 2
			})).toEqual({
				x: -1,
				y: -2
			});
		});
	});

	describe('vector.mag', function() {
		it('should return the magnitude of a vector', function() {
			expect(vector.mag({
				x: 3,
				y: 4
			})).toEqual(5);
		});
	});

	describe('vector.distance', function() {
		it('should calculate the distance between two vectors (treating them as points)', function() {
			expect(vector.distance({
				x: 2,
				y: 1
			}, {
				x: 5,
				y: 5
			})).toEqual(5);
		});
	});

	describe('vector.normalise', function() {
		it('should return a vector of length 1, pointing in the same direction as the original', function() {
			expect(vector.normalise({
				x: 5,
				y: 0
			})).toEqual({
				x: 1,
				y: 0
			});
		});
	});

	describe('vector.setLength', function() {
		it('should return a vector of the passed length, pointing in the same direction as the original', function() {
			expect(vector.setLength({
				x: 5,
				y: 0
			}, 2)).toEqual({
				x: 2,
				y: 0
			});
		});
	});

	describe('vector.dot', function() {
		it('should return 0 for orthogonal vectors', function() {
			expect(vector.dot({
				x: 1,
				y: 0
			}, {
				x: 0,
				y: 1
			})).toEqual(0);
		});
		it('should return the product of the magnitudes for parallel vectors', function() {
			expect(vector.dot({
				x: 3,
				y: 0
			}, {
				x: 2,
				y: 0
			})).toEqual(6);
		});
	});

	describe('vector.angle', function() {
		var v1 = {
				x: 1,
				y: 0
			},
			v2 = {
				x: 0,
				y: -1
			};
		it('should return the angle between two vectors in radians', function() {
			expect(vector.angle(v1, v2)).toEqual(Math.PI/2);
		});
		it('should return a negative angle if dirMatters is set to true and the angle is anti-clockwise', function() {
			expect(vector.angle(v1, v2, true)).toEqual(-Math.PI/2);
		});
	});

	describe('vector.angleToVector', function() {
		it('should convert an angle to a normalised vector pointing in that direction (where the angle is from the positive x-axis)', function() {
			var newVector = vector.angleToVector(Math.PI/2);
			newVector.x = parseFloat(newVector.x.toFixed(5)); // only test equality to 5 decimal places to avoid precision issues with javascript floating point maths
			expect(newVector).toEqual({
				x: 0,
				y: 1
			});
		});
	});
});