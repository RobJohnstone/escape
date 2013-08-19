describe('map', function() {
	it('should add map object to E namespace', function() {
		expect(E.map).toBeDefined();
	});

	var map = E.map;

	describe('init', function() {
		beforeEach(function() {
			spyOn(E.tiles, 'init');
			spyOn(map, 'getTileObj').andReturn({passable: true});
			spyOn(E.actors, 'create').andReturn({type: 'test'});
			map.init({
				test: 'test',
				rows: 1,
				columns: 1,
				data: 0,
				actors: ['testActor']
			});
		});
		it('should extend map with the mapObj', function() {
			expect(map.test).toEqual('test');
		});
		it('should initialise tiles', function() {
			expect(E.tiles.init).toHaveBeenCalled();
		});
		it('should generate path grid', function() {
			expect(map.getTileObj).toHaveBeenCalled();
			expect(map.pathGrid.length).toBeGreaterThan(0);
			expect(map.pathGrid[0][0]).toEqual(false);
		});
		it('should add entities', function() {
			expect(E.actors.create).toHaveBeenCalled();
		});
	});
});