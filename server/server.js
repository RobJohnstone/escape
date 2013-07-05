// settings
var settings = {
	write: true // in production this should be false
};

// modules
var http = require('http');
var static = require('node-static');
var fs = require('fs');

// static file server
var fileServer = new static.Server('./');

console.log('Escape started');

// http server
http.createServer(function(request, response) {
	var data = '';
	request.on('data', function(chunk) {
		data += chunk;
	});
	request.on('end', function() {
		console.log('['+request.method+'] '+request.url);
		var path = request.url.split('/');
		if (settings.write && request.method === 'POST') {
			response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
			switch (path[1]) {
				case 'maps':
					response.write('posting map: '+path[2]+'... ');
					fs.writeFile('./'+request.url, data, function(error) {
						if (error) {
							response.write('Error when trying to write to '+request.url);
							console.log(error);
						}
						else {
							response.write('success!');
						}
						response.end();
					});
					break;
				default:
					response.write('POST requests to this url are forbidden');
					response.end();
			}
		}
		else {
			fileServer.serve(request, response, function(error, result) {
				response.writeHead(400, "Not found", {'Content-Type': 'text/html'});
				response.write('<h1>404 Not Found</h1><p>Sorry, the page you are looking could not be found.</p>');
				response.end();
			});
		}
	});
}).listen(8080);