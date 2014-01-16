var question_service = exports;
var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
var db;

MongoClient.connect("mongodb://" + settings.host + ':' + settings.port + '/' + settings.db, function(err, getdb){
    if (err)
        return console.log(err);
    db = getdb;
});

question_service.addQuestion = function(question, coll, callback) {
	db.collection(coll, function(err, collection) {
		if (err)
			return callback(err);
		collection.insert(question, function(err, qe) {
			if (err)
				return callback(err);
			return callback(null, qe[0]);
		});
	});
};

question_service.getAllQuestion = function(callback) {
	db.collection('questions', function(err, collection) {
		if (err)
			return callback(err);
		collection.find({c: {$lt: 0}}, {_id: 0}).toArray(function(err, array) {
			if (err)
				return callback(err);
			return callback(null, array);
		});
	});
};

question_service.getQuestionById = function(id, coll, callback) {
	db.collection(coll, function(err, collection) {
		if (err)
			return callback(err);
		collection.findOne({id: id}, function(err, entry) {
			if (err)
				return callback(err);
			return callback(null, entry);
		});
	});
};

question_service.deleteQuestion = function(id, coll, callback) {
	db.collection(coll, function(err, collection) {
		if (err)
			return callback(err);
		collection.remove({id: id}, function(err, amount) {
			if (err)
				return callback(err);
			return callback(null, amount);
		})
	});
};