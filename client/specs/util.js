describe('util', function() {
	it('should create global util object', function() {
		expect(util).toBeDefined();
	});

	describe('valFromString', function() {
		window.test1 = 7;
		window.testObj = {
			testProp: 9
		};
		it('should take a string and return the value of the global variable with that name', function() {
			expect(util.valFromString('test1')).toEqual(7);
			expect(util.valFromString('testObj.testProp')).toEqual(9);
		});
	});

	describe('moveArrayElement', function() {
		var arr = ['a', 'b', 'c', 'd', 'e'];
		it('should move an array element from one index to another', function() {
			expect(util.moveArrayElement(arr, 1, 3)).toEqual(['a', 'c', 'd', 'b', 'e']);
			expect(util.moveArrayElement(arr, 1, 5)).toEqual(['a', 'c', 'd', 'e', undefined, 'b']);
		});
	});
});