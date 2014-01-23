
var question_service = require("../services/question_service");
var topic_service = require("../services/topic_service");
var indices_service = require("../services/indices_service");
var Topic = require("./Topic");

//答对数目是否应该针对每个answer？
function Question(question) {
	this.id;//qid，问题的ID
	this.c = question.cate;//topicID
	this.tp = question.topicid;
	this.ts = question.topicstr;
	this.m = question.mode;
	this.t;//tagID
	this.q = question.description;//description
	this.a = question.answers;//answer数组
	this.i = 1;//正确答案的index
	this.w;//答对数目
	this.l;//答错数目
	this.h;//动态难度系数
	this.u = question.uid;//提出的用户
};

module.exports = Question;

Question.prototype.save = function(callback) {
	var question = {
		c: this.c,
		tp: this.tp,
		ts: this.ts,
		m: this.m,
		t: this.t,
		q: this.q,
		a: this.a,
		i: this.i,
		w: this.w,
		l: this.l,
		h: this.h,
		u: this.u
	};
	if (this.m == 0)
		dealQuestion(question, callback);
	else if (this.m == 1) {
		topic_service.getTopicByCateAndName(question.c, question.ts, function(err, topic) {
			if (err)
				return callback({i: 2, m: '连接错误'});
			if (topic) {
				//return callback({i: 3, m: '该话题已存在，请您手动选择'});
				question.m = 0;
				question.tp = topic.id;
			}
			dealQuestion(question, callback);
		});
	}
};

var dealQuestion = function(question, callback) {
	indices_service.returnAndAdd('question', function(err, value) {
		if(err)
			return callback({i: 0, m: '连接错误'});
		question.id = value;
		question_service.addQuestion(question, 'questions', function(err, question) {
			if (err)
				return callback({i: 1, m: '连接错误'});
			callback(null, question);
		});
	});
};

Question.getAllUnchecked = function(callback) {
	question_service.getAllQuestion(function(err, array) {
		if (err)
			return callback(err);
		//console.log(array.length);
		searchTopicNames(array, callback);

/*		for (var i in array) {
			//console.log(i);
			var entry = array[i];
			entry.cs = Topic.getCateNameByID(entry.c);
			if (entry.m == 0)
				Topic.getTopicNameByID(entry.tp, function(err, name) {
					if (err)
						callback(err);
					entry.ts = name;
					if (i == length-1) {
						return callback(null, array);
					}
				});
		}*/
		
	});
};

Question.approve = function(id, callback) {
	question_service.getQuestionById(id, "questions", function(err, question) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		if (!question)
			return callback({i: 1, m: '该问题不存在'});
		question_service.deleteQuestion(id, "questions", function(err, amount) {
			if (err)
				return callback({i: 2, m: '连接错误'});
			if (amount == 0)
				return callback({i: 3, m: '删除失败'});
			//question.c = -question.c;
			delete question.ts;
			delete question.m;
			delete question.u;
			question_service.addQuestion(question, 'checkedQues', function(err, qe) {
				if (err)
					return callback({i: 4, m: '连接错误'});
				if (!qe)
					return callback({i: 5, m: '添加失败'});
				return callback(null, qe);
			});
		});
	});
};

Question.reject = function(id, callback) {
	question_service.getQuestionById(id, "questions", function(err, question) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		if (!question)
			return callback({i: 1, m: '该问题不存在'});
		question_service.deleteQuestion(id, "questions", function(err, amount) {
			if (err)
				return callback({i: 2, m: '连接错误'});
			if (amount == 0)
				return callback({i: 3, m: '删除失败'});
			//question.c = -question.c;
			question_service.addQuestion(question, 'rejectedQues', function(err, qe) {
				if (err)
					return callback({i: 4, m: '连接错误'});
				if (!qe)
					return callback({i: 5, m: '拒绝失败'});
				return callback(null, qe);
			});
		});
	});
};

Question.getQuestionById = function(id, callback) {
	question_service.getQuestionById(id, 'questions', function(err, entry) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		if (!entry)
			return callback({i: 1, m: '该问题不存在，可能已被处理'});
		return callback(null, entry);
	});
};

Question.getUncheckedQuestionsByUserId = function(uid, callback) {
	question_service.getUncheckedQuestionsByUserId(uid, function(err, array) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		searchTopicNames(array, callback);
	});
};

var searchTopicNames = function(array, callback) {
	var todo = [];
	for (var index in array) {
		//console.log(array[index].id);
		if (array[index].m == 0)
			todo.push(array[index]);
		else
			array[index].cs = Topic.getCateNameByID(array[index].c);
	}
	var length = todo.length - 1, i = 0;
	todo.forEach(function(entry) {
		entry.cs = Topic.getCateNameByID(entry.c);
		Topic.getTopicNameByID(entry.tp, function(err, name) {			
			if (err)
				entry.ts = '查询失败';
			entry.ts = name;
			if (i++ == length)
				callback(null, array);
		});
	});
};

Question.editQuestionByUser = function(uid, paras, callback) {
	//首先检查用户权限
	question_service.getUncheckedQuestionsByIdAndUserId(uid, parseInt(paras.qid), function(err, entry) {
		if (err)
			return callback({i: 10, m: '连接错误'});
		if (!entry)
			return callback({i: 11, m: '对不起，您没有权限操作此问题'});
		var modified = {
			a: paras.a,
			c: parseInt(paras.c),
			m: parseInt(paras.m),
			q: paras.q,
			tp: parseInt(paras.tp),
			ts: paras.ts
		};
		question_service.editQuestion(parseInt(paras.qid), modified, function(err, ct) {
			if (err)
				return callback({i: 12, m: '连接错误'});
			if (ct == 0)
				return callback({i: 13, m: '修改不成功，请重试'});
			return callback(null, true);
		});
	});
};

Question.deleteQuestionByUser = function(uid, qid, callback) {
	question_service.getUncheckedQuestionsByIdAndUserId(uid, qid, function(err, entry) {
		if (err)
			return callback({i: 10, m: '连接错误'});
		if (!entry)
			return callback({i: 11, m: '对不起，您没有权限操作此问题'});
		question_service.deleteQuestion(qid, 'questions', function(err, ct) {
			if (err)
				return callback({i: 12, m: '连接错误'});
			if (ct == 0)
				return callback({i: 13, m: '对不起，删除失败，请重试'});
			return callback(null, true);
		});
	});
};