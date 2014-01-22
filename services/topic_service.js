var topic_service = exports;
var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
var db;

MongoClient.connect("mongodb://" + settings.host + ':' + settings.port + '/' + settings.db, function(err, getdb){
    if (err)
        return console.log(err);
    db = getdb;
});

topic_service.addUncheckedTopic = function(topic, callback) {
	db.collection('utopics', function(err, collection) {
		if (err)
			return callback(err);
		collection.insert(topic, function(err, ut) {
			if (err)
				return callback(err);
			return callback(null, ut);
		});
	});
};

topic_service.addCheckedTopic = function(topic, callback) {
	db.collection('topics', function(err, collection) {
		if (err)
			return callback(err);
		collection.insert(topic, function(err, ct) {
			if (err)
				return callback(err);
			return callback(null, ct);
		});
	});
};

topic_service.getUncheckedTopic = function(id, callback) {
	db.collection('utopics', function(err, collection) {
		if (err)
			return callback(err);
		collection.findOne({id: id}, function(err, ut) {
			if (err)
				return callback(err);
			return callback(null, ut);
		});
	});
};

topic_service.deleteUncheckedTopic = function(id, callback) {
	db.collection('utopics', function(err, collection) {
		if (err)
			return callback(err);
		collection.remove({id: id}, function(err, count) {
			if (err)
				return callback(err);
			return callback(null, count);
		});
	});
};

topic_service.deleteUncheckedTopicByName = function(name, callback) {
	db.collection('utopics', function(err, collection) {
		if (err)
			return callback(err);
		collection.remove({n: name}, function(err, count) {
			if (err)
				return callback(err);
			return callback(null);
		});
	});
};

topic_service.getAllTopics = function(coll, callback) {
	db.collection(coll, function(err, collection) {
		if (err)
			return callback(err);
		collection.find({id: {$gt: 0}}, {_id: 0}).toArray(function(err, array) {
			if (err)
				return callback(err);
			return callback(null, array);
		});
	});
};

topic_service.getTopicsByCate = function(cateid, callback) {
	db.collection('topics', function(err, collection) {
		if (err)
			return callback(err);
		collection.find({c: cateid}, {_id: 0, c: 0}).toArray(function(err, array){
			if (err)
				return callback(err);
			return callback(null, array);
		});
	});
};

topic_service.getTopicById = function(id, callback) {
	db.collection('topics', function(err, collection) {
		if (err)
			return callback(err);
		collection.findOne({id: id}, {_id: 0}, function(err, entry) {
			if (err)
				return callback(err);
			return callback(null, entry);
		});
	});
};

topic_service.getTopicByCateAndName = function(cateid, name, callback) {
	getTopicByCandN('topics', cateid, name, callback);
};

topic_service.getUncheckedTopicByCateAndName = function(cateid, name, callback) {
	getTopicByCandN('utopics', cateid, name, callback);
};

var getTopicByCandN = function(coll, cateid, name, callback) {
	db.collection(coll, function(err, collection) {
		if (err)
			return callback(err);
		collection.findOne({c: cateid, n: name}, {_id: 0}, function(err, topic) {
			if (err)
				return callback(err);
			return callback(null, topic);
		});
	});
};

topic_service.getTopicOfSameName = function(cateid, name, callback) {
	db.collection('topics', function(err, collection) {
		if (err)
			return callback(err);
		collection.findOne({c: cateid, n: name}, function(err, entry) {
			if (err)
				return callback(err);
			return callback(null, entry);
		});
	});
};