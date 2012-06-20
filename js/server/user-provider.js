var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server,
	BSON = require('mongodb').BSON,
	ObjectID = require('mongodb').ObjectID;
	

var UserProvider = function(host, port, database, user, password){
	var db = this.db = new Db(database, new Server(host, port, {auto_reconnect: true}, {}));
	db.open(function(){
		db.authenticate(user, password, function(err, result){
			console.log(err);
			console.log(result);
		});
	});
};

UserProvider.prototype.getCollection = function(callback){
	this.db.collection('users', function(error, user_collection){
		if (error){
			console.log('getCollection ' + error);
		} else {
			callback(null, user_collection);
		}
	});
};

UserProvider.prototype.getUser = function(userId, password, callback){
	this.getCollection(function(error, user_collection){
		if(error){
			callback(error);
		} else {
			user_collection.findOne({userId: userId, password: password}, function(error, result){
				if (error){
					callback(error);
				} else {
					callback(null, result);
				}
			});
			
		}
	});
};

exports.UserProvider = UserProvider;