var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	
	projectTaskSchema = new Schema({
		"clientId": String,
		"depthLevel": Number,
		"parent": String,
		"children": [String],
		"collapsed": Boolean,
		"visible": Boolean,
		"name": String,
		"startDate": String,
		"endDate": String,
		"isFixedDuration": Boolean,
		"work": Number,
		"duration": String,
		"predecessors": {},
		"successors": {},
		'position': Number,
		'projectId': {type: ObjectId, ref: 'Project'}
	}),
	
	projectTaskModel = mongoose.model('ProjectTask', projectTaskSchema);
	
module.exports.model = projectTaskModel;
module.exports.schema = projectTaskSchema;

module.exports.updateTasks = function(tasks, callback){
	var length = tasks.length,
		needle = 0,
		successNext = function(err, updateCount){
			if (err){
				console.log('error in update task');
				callback(err);
				return;
			}
			
			if (needle < length){
				var task = tasks[needle++],
					_id = task._id;
				
				//Delete _id, otherwise mongo gives error while updating
				delete task._id;
				projectTaskModel.update({_id: _id}, task, successNext);
			} else {
				console.log('update tasks done...');
				callback(null, length);
			}			
		};
	successNext(0);	
};

module.exports.createTasks = function(tasks, projectId, callback){
	var length = tasks.length,
		needle = 0,
		successNext = function(err, updateCount){
			if (err){
				console.log('error in create task');
				callback(err);
				return;
			}
			
			if (needle < length){
				var task = new projectTaskModel(tasks[needle++]);
				task.projectId = projectId;
				task.save(successNext);
			} else {
				console.log('create tasks done...');
				callback(null, length);
			}			
		};
		console.log('create tasks length: ' + length);
	successNext(0);
};
