var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	ProjectTask = require('./project-task'),
	ProjectResource = require('./project-resource'),

	projectSchema = new Schema({
		name: String,
		businessNeed: String,
		businessRequirement: String,
		businessValue: String,
		constraints: String,
		lastTaskCount: Number,
		lastResourceCount: Number,
		calendar: {}
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
			
			ProjectResource.model.find({projectId: project._id}).sort('position', 1).exec(function(resourcesErr, resources){
				if (resourcesErr){
					callback(resourcesErr);
					return;
				}
				var jsonProject = JSON.stringify(project);
				jsonProject = JSON.parse(jsonProject);
				
				jsonProject.lastTaskCount = jsonProject.lastTaskCount || 0;
				jsonProject.lastResourceCount = jsonProject.lastResourceCount || 0;
				
				if (!tasks) {
					tasks = [];
				}
				jsonProject.tasks = tasks;
				
				if (!resources){
					resources = [];
				}
				jsonProject.resources = resources;
				callback(null, jsonProject);
			});
		});
	});
};

module.exports.updateProject = function(jsonProject, callback) {
	var projId = jsonProject._id,
		tasks = jsonProject.tasks,
		resources = jsonProject.resources;
		
	delete jsonProject.tasks;
	delete jsonProject._id;
	delete jsonProject.resources;
		
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
					ProjectTask.deleteTasks(tasks.deletedItems, function(deleteErr, deleteResult){
						if (deleteErr){
							callback(deleteErr);
							return;
						}
						ProjectResource.createResources(resources.newItems, proj._id, function(createResourceErr, createResourceResult){
							if (createResourceErr){
								callback(createResourceErr);
								return;
							}
							ProjectResource.updateResources(resources.modifiedItems, function(modifyResourceErr, modifyResourceResult){
								if (modifyResourceErr){
									callback(modifyResourceErr);
									return;
								}
								ProjectResource.deleteResources(resources.deletedItems, callback);
							});
						});
					});
				});
			});
		});
	});
};
