var combo = require('combohandler'),
	express = require('express'),
	path = require('path'),
	util = require('util'),
	fs = require('fs'),
		
	jsRoot = path.join(__dirname, '..'),
	pageRoot = path.join(__dirname, '../../pages'),
	dataRoot = path.join(__dirname, '../../data'),
	imageRoot = path.join(__dirname, '../../js'),
	
	app = express.createServer();

app.configure(function() {
	app.use(express.errorHandler());
});

app.error(function(err, req, res, next){
	if (err instanceof combo.BadRequest) {
		res.send('Bad request.', {'Content-Type': 'text/plain'}, 400);
	} else {
		console.log(err);
		next();
	}
});

app.get('/customjs', combo.combine({rootPath: jsRoot}), function(req, res){
	res.send(res.body, 200);
});

app.get('/images/*', function(req, res, next){
	var path = req.url.substring(7),
		options = {
		root: imageRoot,
		getOnly: true,
		path: path
	};
	express['static'].send(req, res, next, options);
});

app.get('/data/:type', function(req, res, next){
	console.log(req.params.type);
	var options = {
		root: dataRoot,
		path: req.params.type + '.json',
		getOnly: true
	};
	console.log(options.path);
	express['static'].send(req, res, next, options);
});

app.post('/data/:type', function(req, res, next){
	var savePath = path.join(dataRoot, '/' + req.params.type + '.json');
	console.log('POST: ' + savePath);
	var fstream = fs.createWriteStream(savePath);
			req.pipe(fstream);
			res.writeHead(200);
			req.on('end', function(){
				res.end();
			});
});

app.get('*', function(req, res, next) {
	var options = {
		root: pageRoot,
		path: 'app.html',
		getOnly: true
	};
	express['static'].send(req, res, next, options);
});

app.listen(process.env.PORT || 3000);
