describe('objectPrototype', function() {

	describe('extend', function() {
		var obj = {
			a: 5,
			b: function() {
				return 'result';
			}
		};
		it('should add extend method to object prototype', function() {
			expect(obj.extend).toBeDefined();
		});
		it('should return a new object', function() {
			expect(obj.extend()).not.toBe(obj);
		});
		it('should return an object that inherits from the original', function() {
			var newObj = obj.extend();
			expect(newObj.a).toEqual(5);
			expect(newObj.b()).toEqual('result');
		});
		it('should add properties passed to it', function() {
			expect(obj.extend({c: 7}).c).toEqual(7);
		});
		it('should overwrite existing properties with passed properties', function() {
			expect(obj.extend({a: 1}).a).toEqual(1);
		});
	});

	describe('create', function() {
		var obj = {
			init: function() {}
		};
		it('should add create method to object prototype', function() {
			expect(obj.create).toBeDefined();
		});
		it('should extend object with propertiesObject', function() {
			spyOn(Object.prototype, 'extend').andReturn({});
			obj.create({a: 1});
			expect(Object.prototype.extend).toHaveBeenCalledWith({a: 1});
		});
		it('should call init method', function() {
			spyOn(obj, 'init');
			obj.create();
			expect(obj.init).toHaveBeenCalled();
		});
		it('should pass arguments to init method', function() {
			spyOn(obj, 'init');
			obj.create({}, 1, 2);
			expect(obj.init).toHaveBeenCalledWith(1, 2);
		});
	});

	describe('clone', function() {
		var obj = {
			a: 1,
			b: {
				c: 2
			}
		};
		it('should add clone method to object prototype', function() {
			expect(obj.clone).toBeDefined();
		});
		it('should not be the same object', function() {
			expect(obj.clone()).not.toBe(obj);
		});
		it('should return an object that is identical to the original', function() {
			expect(obj.clone()).toEqual(obj);
		});
		it('should not clone nested objects, instead there should be a reference to the original nested object', function() {
			expect(obj.clone().b).toBe(obj.b);
		});
	});
});