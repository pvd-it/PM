var combo = require('combohandler'),
	express = require('express'),
	connectUtils = require('connect').utils,
	path = require('path'),
	util = require('util'),
	fs = require('fs'),
		
	jsRoot = path.join(__dirname, '..'),
	pageRoot = path.join(__dirname, '../../pages'),
	dataRoot = path.join(__dirname, '../../data'),
	imageRoot = path.join(__dirname, '../../js'),
	
	mongoose = require('mongoose'),
	User = require('./mongoose/app-objects/user'),
	Organization = require('./mongoose/app-objects/organization'),
	ProjectSchema = require('./mongoose/app-objects/project'),
	Project = require('./mongoose/app-objects/project').model,
	ProjectTask = require('./mongoose/app-objects/project-task').model,

	
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

//mongoose.connect('mongodb://nodejitsu:7473599b0969b76144917a93936805f0@staff.mongohq.com:10040/nodejitsudb650685699003');

mongoose.connect('mongodb://localhost/pmapp');

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

app.post('/data/project/create', function(req, res, next) {
	req.body.tasks = undefined;
	
	var proj = new Project(req.body);
	proj.save(function(err, result){
		if (err){
			res.send(500);
		} else {
			User.findOne({_id: req.session.userId}, function(e, user){
				if (e){
					res.send(500);
				}
				user.currentProjects.push(proj);
				user.save(function(er, r){
					if (er){
						res.send(500);
					} else {
						res.send(proj);
					}
				});
			});
		}
	});
});

app.post('/data/project/update', function(req, res, next){
	var id = req.body._id;
	ProjectSchema.updateProject(req.body, function(err, result){
		if (err){
			res.send(500);
			return;
		}
		ProjectSchema.retreiveProjectById(id, function(e, prj){
			if (e){
				res.send(500);
				return;
			}
			res.send(prj);
		});
	});
});

app.get('/data/project/:id', function(req, res, next){
	ProjectSchema.retreiveProjectById(req.params.id, function(err, prj){
		if (err){
			res.send(500);
			return;
		}
		res.send(prj);
	});
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
	
	if (req.params.type === 'tasks'){
		var project = {
			name: 'Hello',
			tasks: []
		};
		
		var len = req.body.tasks.length,
			i = 0;
		for (;i<len;i++){
			var t = new ProjectTask(req.body.tasks);
				t.save(function(err, result){
					project.tasks.push(t._id);
				});
		}
		
		new Project(project).save();
		
		res.send();
		
		
	} else {
		fs.writeFile(savePath, JSON.stringify(req.body), function(err){
			if (err){
				res.send(500);
			} else {
				res.send();
			}
		});	
	}
	
	
});

app.post('/login', function(req, res, next){
	if (req.session.authentication === 'done'){
		console.log(connectUtils);
		connectUtils.badRequest(res);
	} else {
		User.findOne({
			userName: req.body.userId, 
			password: req.body.password
		}).populate('organization').populate('currentProjects', ['name']).exec(function(error, result){
				if (error){
					res.send(500);
				} else {
					if (result) {
						result.password = undefined;
						
						req.session.authentication = 'done';
						req.session.userId = result._id;
						req.session.save();
						res.send(result);
						console.log('authenticated...');
					} else {
						connectUtils.unauthorized(res);
					}
				}
		});
	}
});

app.all('/logout', function(req, res, next){
	
	if (req.session){
		req.session.destroy();
		console.log('Session destroyed');
	}
	
	if (req.isXMLHttpRequest){
		res.send();
	} else {
		var options = {
			root: pageRoot,
			path: 'app.html',
			getOnly: true
		};
		express['static'].send(req, res, next, options);
	}
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
