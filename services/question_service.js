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
		collection.find({c: {$gte: 0}}).sort({id: 1}).toArray(function(err, array) {
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

question_service.getUncheckedQuestionsByTopicName = function(new_topicid, cateid, name, callback) {
	db.collection('questions', function(err, collection) {
		if (err)
			return callback(err);
		collection.update({m: 1, c: cateid, ts: name}, {$set: {m: 0, tp: new_topicid}}, function(err, count){
			if (err)
				return callback(err);
			return callback(null);
		});
	});
};

question_service.getUncheckedQuestionsByUserId = function(uid, callback) {
	db.collection('questions', function(err, collection) {
		if (err)
			return callback(err);
		collection.find({u: uid}, {_id: 0}).toArray(function(err, array) {
			if (err)
				return callback(err);
			return callback(null, array);
		});
	});
}

question_service.getUncheckedQuestionsByIdAndUserId = function(uid, qid, callback) {
	db.collection('questions', function(err, collection) {
		if (err)
			return callback(err);
		//console.log(JSON.stringify({id: qid, u: uid}));
		collection.findOne({id: qid, u: uid}, {_id: 0}, function(err, entry) {
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
		});
	});
};

question_service.changeQuestionMode = function(cateid, topicstr, topicid, callback) {
	db.collection('questions', function(err, collection) {
		if (err)
			return callback(err);
		collection.update({c: cateid, ts: topicstr}, {$set: {m: 0, tp: topicid}}, {multi: true}, function(err, ct) {
			if (err)
				return callback(err);
			//console.log(ct);
			return callback(null, ct);
		});
	});
};

question_service.setTopic = function(qid, cateid, topicid, callback) {
	db.collection('questions', function(err, collection) {
		if (err)
			return callback(err);
		collection.update({id: qid}, {$set: {c: cateid, tp: topicid, m: 0}}, function(err, ct) {
			if (err)
				return callback(err);
			return callback(null, ct);
		});
	});
};

question_service.editQuestion = function(qid, params, callback) {
	db.collection('questions', function(err, collection) {
		if (err)
			return callback(err);
		collection.update({id: qid}, {$set: params}, function(err, ct) {
			if (err)
				return callback(err);
			return callback(null, ct);
		});
	});
};