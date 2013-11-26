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
	app.use(express.static(path.join(__dirname, '../client')));
	app.use(express.bodyParser());
});

app.listen(app.get('port'));

/* helper methods */
app.listJSON = function(dirname, res) {
	fs.readdir(dirname, function(err, files) {
		if (err) {
			files = err;	
		}
		else {
			files = files.filter(function(filename) {
				var ext = filename.split('.')[1];
				return (ext === 'json');
			});
			files = files.map(function(file) {
				return file.split('.')[0];
			});
		}
		res.end(JSON.stringify(files));
	});
};

app.returnFile = function(filename, res) {
	fs.readFile(filename, function(err, data) {
		data = err ? err.message : data;
		res.end(data);
	});
};

app.saveFile = function(filename, data) {
	console.log('Saving file: '+filename);
	fs.writeFile(filename, data, function(err) {
		if (err) console.log(err);
	});
};

/* Routes */
app.get('/campaigns', function(req, res) {
	app.listJSON(app.get('campaigns'), res);
});

app.get('/campaigns/:campaign', function(req, res) {
	app.returnFile(path.join(app.get('campaigns'), req.params.campaign+'.json'), res);
});

app.get('/maps', function(req, res) {
	app.listJSON(app.get('maps'), res);
});

app.get('/maps/:map', function(req, res) {
	app.returnFile(path.join(app.get('maps'), req.params.map+'.json'), res);
});

if (settings.mode === 'dev') {
	app.post('/campaigns/:campaign', function(req, res) {
		app.saveFile(path.join(app.get('campaigns'), req.params.campaign+'.json'), req.body.data);
		res.end();
	});

	app.delete('/campaigns/:campaign', function(req, res) {
		fs.unlink(path.join(app.get('campaigns'), req.params.campaign+'.json'), function(err) {
			if (err) console.log(err);
		});
		res.end();
	});

	app.post('/maps/:map', function(req, res) {
		app.saveFile(path.join(app.get('maps'), req.params.map+'.json'), req.body.data);
		res.end();
	});

	app.delete('/maps/:map', function(req, res) {
		fs.unlink(path.join(app.get('maps'), req.params.map+'.json'), function(err) {
			if (err) console.log(err);
		});
		res.end();
	});
};

console.log('Escape server listening on port '+app.get('port'));