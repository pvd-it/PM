var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	
	userSchema = new Schema({
		name: String,
		userName: String,
		password: String,
		organization: {type: ObjectId, ref: 'Organization'},
		pastProjects: [{type: ObjectId, ref: 'Project'}],
		currentProjects: [{type: ObjectId, ref: 'Project'}],
	}),
	
	userModel = mongoose.model('User', userSchema);

module.exports.model = userModel;

module.exports.retrieveUserById = function(_id, callback){
	userModel.findById(_id).populate('organization').populate('currentProjects', ['name']).exec(function(error, result){
		if (error) {
			callback(error);
			return;	
		} else {
			var jsonUser = JSON.stringify(result);
			jsonUser = JSON.parse(jsonUser);
			
			delete jsonUser.password;
			callback(null, jsonUser);
		}
	});
};

module.exports.retrieveUserByUserIdAndPassword = function(userId, password, callback){
	userModel.findOne({
		userName: userId,
		password: password
	}).populate('organization').populate('currentProjects', ['name']).exec(function(error, result){
		if (error) {
			callback(error);
			return;	
		} else {
			var jsonUser = JSON.stringify(result);
			jsonUser = JSON.parse(jsonUser);
			
			delete jsonUser.password;
			callback(null, jsonUser);
		}
	});
};
