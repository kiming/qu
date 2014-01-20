
var topic_service = require("../services/topic_service");
var question_service = require("../services/question_service");
var indices_service = require("../services/indices_service");
var categories = require("../config/category").data;

function Topic(topic) {
	this.n = topic.name;//话题的文字说明
	this.id;
	this.c = topic.cate;
	this.u = topic.user;//是由谁提出的？
};

module.exports = Topic;

Topic.getCateList = function() {
	return categories;
};

Topic.prototype.save = function(callback) {
	var topic = {
		n: this.n,
		u: this.u,
		c: this.c
	}
	indices_service.returnAndAdd('utopic', function(err, value) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		topic.id = value;
		topic_service.addUncheckedTopic(topic, function(err, ut) {
			if (err)
				return callback({i:1, m: '连接错误'});
			return callback(null);
		});
	});
};

Topic.approve = function(id, callback) {
	topic_service.getUncheckedTopic(id, function(err, ut) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		if (!ut)
			return callback({i: 1, m: '没有相应的topic，可能已处理'});
		topic_service.deleteUncheckedTopic(id, function(err, count) {
			if (err)
				return callback({i: 2, m: '连接错误'});
			if (count == 0)
				return callback({i: 3, m: '删除失败，可能已处理'});
			var topic = {
				n: ut.n,
				c: ut.c
			};
			indices_service.returnAndAdd('topic', function(err, value) {
				if (err)
					return callback({i: 4, m: '连接错误'});
				topic.id = value;
				topic_service.addCheckedTopic(topic, function(err, ct) {
					if (err)
						return callback({i: 5, m: '连接错误'});
					if (count == 0)
						return callback({i: 6, m: '添加错误'});
					return callback(null, true);
				});
			});
		});

	});
};

Topic.reject = function(id, callback) {
	topic_service.getUncheckedTopic(id, function(err, ut) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		if (!ut)
			return callback({i: 1, m: '没有相应的topic，可能已处理'});
		topic_service.deleteUncheckedTopic(id, function(id, count) {
			if (err)
				return callback({i: 2, m: '连接错误'});
			if (count == 0)
				return callback({i: 3, m: '删除失败，可能已处理'});
			return callback(null, true);
		});
	});
};

Topic.getAllUnchecked = function(callback) {
	topic_service.getAllTopics('utopics', function(err, array) {
		if (err)
			return callback(err);
		for (var i in array) {
			var entry = array[i];
			var name = getCateNameByID(entry.c);
			entry.cn = name;
		}
		return callback(null, array);
	});
};

Topic.getAllChecked = function(callback) {
	topic_service.getAllTopics('topics', function(err, array) {
		if (err)
			return callback(err);
		return callback(null, array);
	});
};

Topic.getTopicsOfCate = function(cateid, callback) {
	if (isNaN(cateid))
		return callback({i: 1, m: '不合法的分类id'});
	topic_service.getTopicsByCate(parseInt(cateid), function(err, array) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		return callback(null, array);
	});
};

var getCateNameByID = function(id) {
	for (var i in categories) {
		var entry = categories[i];
		if (entry.i == id)
			return entry.n;
	}
	return "不合法";
};
Topic.getCateNameByID = getCateNameByID;

Topic.getTopicNameByID = function(id, callback) {
	topic_service.getTopicById(id, function(err, entry) {
		if (err)
			callback(err);
		callback(null, entry.n);
	});
};

Topic.addTopicByAdmin = function(cateid, name, callback) {
	topic_service.getTopicOfSameName(cateid, name, function(err, entry) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		if (entry)
			return callback({i: 1, m: '已经存在该话题了，无需再添加'});
		topic_service.deleteUncheckedTopicByName(name, function(err, topic) {
			if (err)
				return callback({i: 2, m: '连接错误'});
			
		});
	});
};