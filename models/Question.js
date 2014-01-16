
var question_service = require("../services/question_service");
var indices_service = require("../services/indices_service");
//答对数目是否应该针对每个answer？
function Question(question) {
	this.id;//qid，问题的ID
	this.c = -question.topicid;//topicID
	this.t;//tagID
	this.q = question.description;//description
	this.a = question.answers;//answer数组
	this.i = 1;//正确答案的index
	this.w;//答对数目
	this.l;//答错数目
	this.h;//动态难度系数
};

module.exports = Question;

Question.prototype.save = function(callback) {
	var question = {
		c: this.c,
		t: this.t,
		q: this.q,
		a: this.a,
		i: this.i, 
		w: this.w,
		l: this.l,
		h: this.h
	};
	indices_service.returnAndAdd('question', function(err, value) {
		if(err)
			return callback({i: 0, m: '连接错误'});
		question.id = value;
		console.log(JSON.stringify(question));
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
		return callback(null, array);
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
			question.c = -question.c;
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
			question.c = -question.c;
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