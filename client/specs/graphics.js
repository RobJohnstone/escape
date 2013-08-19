$('body').append('<div id="gameContainer"></div>');

describe('graphics', function() {
	it('should add graphics object to the E namespace', function() {
		expect(E.graphics).toBeDefined();
	});

	var graphics = E.graphics;

	describe('init', function() {
		it('should initialise the canvas', function() {
			spyOn(graphics, 'initCanvas');
			graphics.init(800, 600);
			expect(graphics.initCanvas).toHaveBeenCalledWith('game', 800, 600);
		});
	});

	describe('initCanvas', function() {
		it('should create the canvas', function() {
			graphics.initCanvas('test', 800, 600);
			expect($('#testCanvas').length).toEqual(1);
		});
	});

	describe('tests that assume presence of gameCanvas', function() {
		beforeEach(function() {
			graphics.gameCanvas = {
				width: 800,
				height: 600
			};
			graphics.gameContext = {};
		});

		
	});
});