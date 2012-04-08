var http = require('http'),
	server = http.createServer(),
	util = require('util'),
	url = require('url'),
	fs = require('fs');

server.on('request', function(req, res){
	console.log(req.url);
	var acrh = req.headers['access-control-request-headers'],
		origin = req.headers['origin'],
		postData = '';
		
	switch (req.method) {
		case 'GET':
			console.log('GET')
			res.writeHead(200, {
				'Access-Control-Allow-Origin': origin
			});
			var readTasks = fs.createReadStream(__dirname + '/tasks.json');
			readTasks.pipe(res);
			break;
		
		case 'POST':
			console.log('POST');
			var fstream = fs.createWriteStream(__dirname + '/tasks.json');
			req.pipe(fstream);
			res.writeHead(200, {
				'Access-Control-Allow-Origin': origin
			});
			req.on('end', function(){
				res.end();
			});
			break;
			
		case 'OPTIONS':
			console.log('OPTIONS');
			res.writeHead(200, {
		  		'Content-Type': 'text/plain',
		  		'Access-Control-Allow-Origin': origin,
		  		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		  		'Access-Control-Allow-Headers': acrh,
		  		'Access-Control-Max-Age:': '300'
		  	});
		  	req.on('end', function(){
		  		res.end();
		  	});
			break;
	}	
});

server.listen(3000);
