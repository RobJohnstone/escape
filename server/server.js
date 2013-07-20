/**
 * Escape server
 *
 * Currently just serves static files except in 'dev' mode in which case
 * It will also allow writing to the 'maps' directory to support the 
 * map editor
 */

var settings = {
	mode: 'dev'
};

var express = require('express'),
	http = require('http'),
	path = require('path'),
	fs = require('fs');

var app = express();
app.set('port', 8080);
app.set('maps', path.join(__dirname, '../maps'));
app.set('campaigns', path.join(__dirname, '../campaigns'));
app.configure(function() {
	app.use(express.logger());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use('/maps', express.static(app.get('maps')));
	app.use('/campaigns', express.static(app.get('campaigns')));
	app.use(express.static(path.join(__dirname, '../client')));
	app.use(express.bodyParser());
});

app.listen(app.get('port'));

if (settings.mode === 'dev') {
	app.post('/maps/:map', function(req, res) {
		fs.writeFile(path.join(app.get('maps'), req.params.map), req.body.data);
		res.end(req.params.map+' saved');
	});
};

console.log('Escape server listening on port '+app.get('port'));