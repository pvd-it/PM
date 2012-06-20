var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	Any = new Schema({any: {}}),
	
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
		"successors": {}
	}, {strict: true});
	
module.exports = mongoose.model('ProjectTask', projectTaskSchema);
