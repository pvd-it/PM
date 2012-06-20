var mongoose = require('mongoose'),
	User = require('./app-objects/user'),
	Organization = require('./app-objects/organization');

//mongoose.connect('mongodb://nodejitsu:7473599b0969b76144917a93936805f0@staff.mongohq.com:10040/nodejitsudb650685699003');
mongoose.connect('mongodb://localhost/pmapp');

User.find(function(err, users){
	console.log(err);
	console.log(users);
});

Organization.find(function(err, orgs){
	console.log(err);
	console.log(orgs);
});
