describe('campaign', function() {
	it('should add campaign object to E namespace', function() {
		expect(E.campaign).toBeDefined();
	});

	var campaign = E.campaign;

	describe('load', function() {
		var ajaxSettings,
			testCallback;
		beforeEach(function() {
			spyOn($, 'ajax').andCallFake(function(settings) {
				ajaxSettings = settings;
				if (typeof settings.success === 'function') {
					settings.success('campaign Object should go here');
				}
			});
			testCallback = jasmine.createSpy('testCallback');
			campaign.load('testCampaign', testCallback);
		});
		it('should load the campaign', function() {
			expect(ajaxSettings.url).toEqual('/campaigns/testCampaign');
		});
		it('should execute the callback', function() {
			expect(testCallback).toHaveBeenCalled();
		});
	});

	describe('newCampaign', function() {
		it('should load a campaign with the new name', function() {
			var name;
			spyOn(campaign, 'load').andCallFake(function(campaignObj) {
				name = campaignObj.name;
			});
			spyOn(E.screen, 'update');
			campaign.newCampaign('test');
			expect(name).toEqual('test');
		});
	});

	describe('save', function() {
		var ajaxSettings, testCallback;
		beforeEach(function() {
			spyOn($, 'ajax').andCallFake(function(settings) {
				ajaxSettings = settings;
				if (typeof settings.success === 'function') {
					settings.success('result should go here');
				}
			});
			spyOn(campaign, 'list');
			testCallback = jasmine.createSpy('testCallback');
			campaign.data = {
				name: 'test'
			};
			campaign.save(testCallback);
		});
		it('should send the correct data to the correct url', function() {
			expect($.ajax).toHaveBeenCalled();
			expect(ajaxSettings.url).toEqual('/campaigns/test');
			expect(ajaxSettings.data).toEqual('data={"name":"test"}');
		});
		it('should invoke the callback', function() {
			expect(testCallback).toHaveBeenCalled();
		});
	});

	describe('update', function() {
		it('should update the value of a field in the campaign', function() {
			campaign.update('test', 'This is a test');
			expect(campaign.data.test).toEqual('This is a test');
		});
		it('should strip the prefix "campaign"', function() {
			campaign.update('campaignTest', 'This is another test');
			expect(campaign.data.test).toEqual('This is another test');
		});
	});

	describe('addMap', function() {
		it('should add a map to the campaign', function() {
			campaign.data.maps = [];
			campaign.addMap('test');
			expect(campaign.data.maps).toEqual(['test']);
			campaign.addMap('test2', 0);
			expect(campaign.data.maps).toEqual(['test2', 'test']);
			campaign.addMap('test3', 1);
			expect(campaign.data.maps).toEqual(['test2', 'test3', 'test']);
		});
	});

	describe('moveMapUp', function() {
		it('should move a map up (nearer the beginning) in the order of maps', function() {
			campaign.data.maps = ['test1', 'test2', 'test3'];
			campaign.moveMapUp('test2');
			expect(campaign.data.maps).toEqual(['test2', 'test1', 'test3']);
		});
	});

	describe('moveMapDown', function() {
		it('should move a map down (nearer the end) in the order of maps', function() {
			campaign.data.maps = ['test1', 'test2', 'test3'];
			campaign.moveMapDown('test2');
			expect(campaign.data.maps).toEqual(['test1', 'test3', 'test2']);
		});
	});
});