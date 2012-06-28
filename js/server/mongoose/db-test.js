var mongoose = require('mongoose'),
	User = require('./app-objects/user'),
	Organization = require('./app-objects/organization'),
	Project = require('./app-objects/project');
	
//mongoose.connect('mongodb://nodejitsu:7473599b0969b76144917a93936805f0@staff.mongohq.com:10040/nodejitsudb650685699003');
mongoose.connect('mongodb://localhost/pmapp');

console.time('100-elements');

//User.update({_id: '4fe6aa770abf9d3f0e00000c'}, {$addToSet: {currentProjects: '4feab198bdde50cd1000001d'}});
Project.findOne({_id: '4feab198bdde50cd1000001d'}, function(err,result){

	User.findOne({_id: '4fe6aa770abf9d3f0e00000c'}, function(err, res){
		res.currentProjects.push(result);
		res.save();
	});


});


/*
Organization.find(function(err, orgs){
	console.log(err);
	console.log(orgs);
});
*/