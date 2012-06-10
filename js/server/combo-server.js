var combo = require('combohandler'),
	express = require('express'),
	connectUtils = require('express/node_modules/connect/lib/utils'),
	path = require('path'),
	util = require('util'),
	fs = require('fs'),
	UserProvider = require('./user-provider').UserProvider,
		
	jsRoot = path.join(__dirname, '..'),
	pageRoot = path.join(__dirname, '../../pages'),
	dataRoot = path.join(__dirname, '../../data'),
	imageRoot = path.join(__dirname, '../../js'),
	
	app = express.createServer();

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.errorHandler());
	app.use(express.cookieParser());
	app.use(express.session({secret: 'wonderla cookie'}));
	
	/*
	 * The workflow implemented is as follows:
	 * 1. If user session is new i.e. either user is coming for first time or session timed out
	 * 		a. Present the user with login page
	 * 		b. In session set authentication = inprogress
	 * 
	 * 2. Whenever the request is coming as XMLHttp and user isn't authenticated status code 401 will be sent
	 */
	app.use(function(req, res, next){
		// if authenticated then call next
		if (req.session.authentication === 'done'){
			next();
		} 
		// if authentication in progress
		else if (req.session.authentication === 'inprogress'){
			// Server static file without requiring authentication
			if (req.url.indexOf('/customjs') === 0 || req.url.indexOf('/images') === 0){
				next();
			// Allow 'login' url 
			} else if (req.url.indexOf('/login') === 0){
				next();
			} else {
				if (req.isXMLHttpRequest) {
					connectUtils.unauthorized(res);
				} else {
					res.redirect('/login');
				}
			}
		}
		// if no authentication then make it in progress 
		else {
			req.session.authentication = 'inprogress';
			req.session.save();
			
			if (req.isXMLHttpRequest){
				if (req.url.indexOf('/login') === 0){
					if (req.method === 'POST') {
						next();
					} else {
						connectUtils.unauthorized(res);
					};
				} else {
					connectUtils.unauthorized(res);
				}
			} else {
				res.redirect('/login');				
			}
		}
	});
});

app.error(function(err, req, res, next){
	if (err instanceof combo.BadRequest) {
		res.send('Bad request.', {'Content-Type': 'text/plain'}, 400);
	} else {
		console.log(err);
		next();
	}
});

var userProvider = new UserProvider('localhost', 27017);

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
	
	fs.writeFile(savePath, JSON.stringify(req.body), function(err){
		if (err){
			res.send(500);
		} else {
			res.send();
		}
	});
});

app.post('/login', function(req, res, next){
	if (req.session.authentication === 'done'){
		connectUtils.badRequest(res);
	} else {
		userProvider.getUser(req.body.userId, req.body.password, function(error, result){
			if (error){
				res.send(500);
			} else {
				console.log(result);
				if (result) {
					req.session.authentication = 'done';
					req.session.save();
					res.send();
					console.log('authenticated...');
				} else {
					connectUtils.unauthorized(res);
				}
			}
		});
		/*
		req.session.authentication = 'done';
		req.session.save();
		res.send();
		*/
	}
});

app.all('/logout', function(req, res, next){
	if (req.isXMLHttpRequest){
		req.session.destroy();
		res.send();
	} else {
		var options = {
			root: pageRoot,
			path: 'app.html',
			getOnly: true
		};
		express['static'].send(req, res, next, options);
	}
	console.log('logout');
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
