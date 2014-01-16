
var topic_service = require("../services/topic_service");
var indices_service = require("../services/indices_service");

function Topic(topic) {
	this.n = topic.name;//话题的文字说明
	this.id;
	//this.u = topic.user;//是由谁提出的？
};

module.exports = Topic;

Topic.prototype.save = function(callback) {
	var topic = {
		n: this.n
		//u: this.u;
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