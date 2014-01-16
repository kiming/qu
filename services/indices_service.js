var indices_service = exports;
var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
var db;

MongoClient.connect("mongodb://" + settings.host + ':' + settings.port + '/' + settings.db, function(err, getdb){
    if (err)
        return console.log(err);
    db = getdb;
});

//user, question, competition
indices_service.returnAndAdd = function(kind, callback) {
	getCurrent(kind, function(err, value) {
		if (err)
			return callback(err);
		writeOneBack(value, kind, function(flag) {
			return callback(null, value);
		});
	});
};

var getCurrent = function(kind, callback) {
	db.collection('indices', function(err, collection) {
		if (err)
			return callback(err);
		collection.findOne({k: kind}, function(err, entry) {
			if (err)
				return callback(err);
			return callback(null, entry.v);
		});
	});
};
/*
var getCurrentHard = function(kind, callback) {
	
	db.collection('indices', function(err, collection) {
		if (err)
			return getCurrentHard(kind, callback);
		collection.findOne({k: kind}, function(err, entry) {
			if (err)
				return getCurrentHard(kind, callback);
			return callback(entry.v);
		});
	});
};*/

var writeOneBack = function(origin, kind, callback) {
	db.collection('indices', function(err, collection) {
		if (err)
			return callback(-3);
		collection.update({k: kind}, {$inc: {v: 1}}, function(err, count) {
			if (err)
				return callback(-2);
			return callback(null);
		});
	});
};