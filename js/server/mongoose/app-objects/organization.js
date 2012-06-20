var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	
	organizationSchema = new Schema({
		name: String,
	});

module.exports = mongoose.model('Organization', organizationSchema);
