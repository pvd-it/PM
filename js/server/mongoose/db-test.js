var mongoose = require('mongoose'),
	User = require('./app-objects/user'),
	Organization = require('./app-objects/organization'),
	Project = require('./app-objects/project');

//mongoose.connect('mongodb://nodejitsu:7473599b0969b76144917a93936805f0@staff.mongohq.com:10040/nodejitsudb650685699003');
mongoose.connect('mongodb://localhost/pmapp');

console.time('100-elements');

User.findOne({
	userName: 'mike.wazowski@monster.inc',
	password: 'mike.wazowski@monster.inc'
}).populate('organization', ['name']).populate('currentProjects', ['name']).exec(function(err, user){
	console.log(err);
	user['password'] = undefined;
	console.log(user);
	console.timeEnd('100-elements');
});

/*
Organization.find(function(err, orgs){
	console.log(err);
	console.log(orgs);
});
*/