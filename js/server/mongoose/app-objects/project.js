var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	ProjectTask = require('./project-task'),

	projectSchema = new Schema({
		name: String,
		team: [{type: ObjectId, ref: 'User'}],
		businessNeed: String,
		businessRequirement: String,
		businessValue: String,
		constraints: String,
		lastTaskCount: Number,
	}),
	
	projectModel = mongoose.model('Project', projectSchema);

module.exports.model = projectModel;

module.exports.retreiveProjectById = function(projectId, callback) {
	projectModel.findById(projectId, function(projectErr, project) {
		if (projectErr) {
			callback(projectErr);
			return;
		}
		ProjectTask.model.find({projectId: project._id}).sort('position', 1).exec(function(tasksErr, tasks) {
			if (tasksErr) {
				callback(tasksErr);
				return;
			}
			var jsonProject = JSON.stringify(project);
			
			jsonProject = JSON.parse(jsonProject);
			if (!tasks) {
				tasks = [];
			}
			jsonProject.tasks = tasks;
			callback(null, jsonProject);
		});
	});
};

module.exports.updateProject = function(jsonProject, callback) {
	var projId = jsonProject._id,
		tasks = jsonProject.tasks;
		
	delete jsonProject.tasks;
	delete jsonProject._id;
		
	projectModel.update({_id: projId}, jsonProject, function(prjErr){
		if (prjErr){
			callback(prjErr);
			return;
		}
		projectModel.findById(projId, function(findProjErr, proj) {
			if (findProjErr){
				callback(findProjErr);
				return;
			}
			ProjectTask.createTasks(tasks.newItems, proj._id, function(createErr, createResult){
				if (createErr){
					callback(createErr);
					return;
				}
				ProjectTask.updateTasks(tasks.modifiedItems, function(modifyErr, modifyResult){
					if (modifyErr){
						callback(modifyErr);
						return;
					}
					ProjectTask.deleteTasks(tasks.deletedItems, callback);
				});
			});
		});
	});
};
