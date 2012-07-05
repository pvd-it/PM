var mongoose = require('mongoose'), 
	Project = require('./app-objects/project'), 
	ProjectTask = require('./app-objects/project-task'); //, Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/pmapp');

ProjectTask.model.find({}).where('_id')['in'](['4ff47b6b8e96ce040b000017', '4ff47f278e96ce040b00003a']).remove(function(err, result){
	console.log(err);
	console.log(result);
});
