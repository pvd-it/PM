var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server,
	BSON = require('mongodb').BSON,
	ObjectID = require('mongodb').ObjectID;
	

var UserProvider = function(host, port){
	this.db = new Db('pmapp', new Server(host, port, {auto_reconnect: true}, {}));
	this.db.open(function(){});
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