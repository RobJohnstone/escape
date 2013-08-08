describe('screen', function() {
	it('should attach screen object to E namespace', function() {
		expect(E.screen).toBeDefined();
	});

	var screen = E.screen;

	it('should attach unload handler to window', function() {
		expect(typeof window.onbeforeunload).toEqual('function');
		window.onbeforeunload = undefined;
	});

	describe('screen.init', function() {
		beforeEach(function() {
			spyOn(screen, 'change');
			screen.init('screenId');
		});
		it('should create a blank history array', function() {
			expect(screen.history).toEqual([]);
		});
		it('should call screen.change with the screen name', function() {
			expect(screen.change).toHaveBeenCalledWith('screenId');
		});
	});

	describe('change', function() {
		beforeEach(function() {
			screen.history = [];
			spyOn(window, 'confirm').andReturn(true);
		});
		it('should request confirmation if the screen has been updated', function() {
			screen.change('test');
			expect(window.confirm).not.toHaveBeenCalled();
			screen.updated = true;
			screen.change('test');
			expect(window.confirm).toHaveBeenCalled();
		});
		it('should set updated property to false', function() {
			screen.updated = true;
			screen.change('test');
			expect(screen.updated).toEqual(false);
		});
		it('should update the history', function() {
			screen.change('test');
			expect(screen.history).toEqual(['test']);
		});
		it('should hide all screens', function() {
			spyOn($.prototype, 'hide');
			screen.change('test');
			expect($.prototype.hide).toHaveBeenCalled();
		});
		it('should show correct screen', function() {
			var selector;
			spyOn($.prototype, 'show').andCallFake(function() {
				selector = this.selector;
			});
			screen.change('test');
			expect(selector).toEqual('#test');
		});
	});

	describe('getCurrent', function() {
		it('should return the id of the current screen', function() {
			screen.history = ['test1', 'test2'];
			expect(screen.getCurrent()).toEqual('test2');
		});
	});

	describe('previous', function() {
		beforeEach(function() {
			screen.history = ['test1', 'test2'];
			spyOn(window, 'confirm').andReturn(true);
			spyOn(screen, 'save');
			spyOn(screen, 'change');
			screen.previous();
		});
		it('should request confirmation if the screen has been updated', function() {
			expect(window.confirm).not.toHaveBeenCalled();
			screen.updated = true;
			screen.previous();
			expect(window.confirm).toHaveBeenCalled();
		});
		it('should remove the previous screen from the history', function() {
			expect(screen.history.length).toEqual(1);
		});
		it('should call screen.save', function() {
			expect(screen.save).toHaveBeenCalled();
		});
		it('should change the screen', function() {
			expect(screen.change).toHaveBeenCalledWith('test1', false);
		});
	});

	describe('update', function() {
		it('should set screen.updated to true', function() {
			screen.updated = false;
			screen.update();
			expect(screen.updated).toEqual(true);
		});
	});

	describe('save', function() {
		it('should set screen.updated to false', function() {
			screen.updated = true;
			screen.save();
			expect(screen.updated).toEqual(false);
		});
	});

	describe('isUnsaved', function() {
		it('should return a boolean indicated whether the screen is not saved', function() {
			screen.updated = true;
			expect(screen.isUnsaved()).toEqual(true);
			screen.updated = false;
			expect(screen.isUnsaved()).toEqual(false);
		});
	});
});