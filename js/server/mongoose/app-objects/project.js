var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,

	projectSchema = new Schema({
		name: String,
		organization: {type: ObjectId, ref: 'Organization'},
		tasks: [{type: ObjectId, ref: 'ProjectTask'}],
		team: [{type: ObjectId, ref: 'User'}],
		businessNeed: String,
		businessRequirement: String,
		businessValue: String,
		constraints: String
	});

module.exports = mongoose.model('Project', projectSchema);