var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	
	userSchema = new Schema({
		name: String,
		userId: String,
		password: String,
		organization: {type: ObjectId, ref: 'Organization'},
		pastProjects: [{type: ObjectId, ref: 'Project'}],
		currentProjects: [{type: ObjectId, ref: 'Project'}],
	});

module.exports = mongoose.model('User', userSchema);
