var combo = require('combohandler'),
	express = require('express'),
	path = require('path'),
	
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

app.get('/data', function(req, res, next){
	var options = {
		root: dataRoot,
		path: 'tasks.json',
		getOnly: true
	};
	express['static'].send(req, res, next, options);
});

app.post('/data', function(req, res, next){
	//This is just dummy currently.
	res.send('Ok', 200);
});

app.get('/', function(req, res, next) {
	var options = {
		root: pageRoot,
		path: 'app.html',
		getOnly: true
	};
	express['static'].send(req, res, next, options);
});

app.get('/')

app.listen(process.env.PORT || 3000);
