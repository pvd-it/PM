var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	
	projectResourceSchema = new Schema({
		'clientId': String,
		'name': String,
		'startDate': String,
		'endDate': String,
		'email': String,
		'cost': String,
		'type': String,
		'position': Number,
		'assignedTasks': [String],
		'projectId': {type: ObjectId, ref: 'Project'}
	}),
	
	projectResourceModel = mongoose.model('ProjectResource', projectResourceSchema);
	
module.exports.model = projectResourceModel;
module.exports.schema = projectResourceSchema;

module.exports.updateResources = function(resources, callback){
	var length = resources.length,
		needle = 0,
		successNext = function(err, updateCount){
			if (err){
				console.log('error in update resource');
				callback(err);
				return;
			}
			
			if (needle < length){
				var resource = resources[needle++],
					_id = resource._id;
				
				//Delete _id, otherwise mongo gives error while updating
				delete resource._id;
				projectResourceModel.update({_id: _id}, resource, successNext);
			} else {
				console.log('update resources done...');
				callback(null, length);
			}
		};
	successNext(0);	
};

module.exports.createResources = function(resources, projectId, callback){
	var length = resources.length,
		needle = 0,
		successNext = function(err, updateCount){
			if (err){
				console.log('error in create resource');
				callback(err);
				return;
			}
			
			if (needle < length){
				var resource = new projectResourceModel(resources[needle++]);
				resource.projectId = projectId;
				resource.save(successNext);
			} else {
				console.log('create resources done...');
				callback(null, length);
			}			
		};
		console.log('create resources length: ' + length);
	successNext(0);
};

module.exports.deleteResources = function(resources, callback){
	if (!resources || resources.length <= 0) {
		callback(null, 0);
		return;
	}
	var _ids = [];
	resources.forEach(function(resource){
		_ids.push(resource._id);
	});
	projectResourceModel.find({}).where('_id')['in'](_ids).remove(callback);
};

module.exports.deleteResourcesByProjectId = function(projectId, callback){
	projectResourceModel.find({}).where('projectId')['in']([projectId]).remove(callback);
};