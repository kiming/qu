
var Question = require("../models/Question");
var Topic = require("../models/Topic");

module.exports = function(app) {
	app.get('/', function(req, res) {
		return res.render('index', {title: 'test'});
	});

	app.get('/question/upload', function(req, res) {
		return res.render("raiseup");
	});

	app.post('/question/upload', function(req, res) {
		//console.log(JSON.stringify(req.body));
		var answers = [
			req.body.a1,
			req.body.a2,
			req.body.a3,
			req.body.a4
		];
		var question = new Question({
			answers: answers,
			topicid: parseInt(req.body.c),
			description: req.body.q
		});
		//console.log(JSON.stringify(question));
		question.save(function(err, question) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			return res.end(JSON.stringify({f: 1, m: '问题已经成功上传，正在等待审核'}));
			
		});
	});

	app.get('/question/check', function(req, res) {
		Question.getAllUnchecked(function(err, array) {
			if (err)
				return res.end("错误");
			return res.render('checkquestion', {array: array});
		});
		//return res.render('checkquestion');
	});

	app.get('/question/approve', function(req, res) {
		Question.approve(parseInt(req.query.id), function(err, question) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			return res.end(JSON.stringify({f: 1}));
		});
	});

	app.get('/question/reject', function(req, res) {
		Question.reject(parseInt(req.query.id), function(err, question) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			return res.end(JSON.stringify({f: 1}));
		});
	});

	app.get('/topic/check', function(req, res) {
		Topic.getAllUnchecked(function(err, array) {
			if (err)
				return res.end('出现错误，请重试');
			return res.render('checktopic', {array: array});
		});
	});

	app.get('/topic/list', function(req, res) {
		Topic.getAllChecked(function(err, array) {
			if (err)
				return res.end(JSON.stringify({f: 0, m: '出错，请重试'}));
			return res.end(JSON.stringify({f: 1, a: array}));
		});
	});

	app.post('/topic/upload', function(req, res) {
		res.setHeader('Content-Type', 'text/JSON;charset=UTF-8');
		var topic = new Topic({
			name: req.body.n
			//user: 
		});

		topic.save(function(err, ut) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			return res.end(JSON.stringify({f: 1, m: '添加成功，请耐心等待审核'}));
		});
	});

	app.get('/topic/approve', function(req, res) {
		res.setHeader('Content-Type', 'text/JSON;charset=UTF-8');
		var id = parseInt(req.query.id);
		Topic.approve(id, function(err, flag) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			return res.end(JSON.stringify({f: 1, m: '操作成功！'}));
		});
	});

	app.get('/topic/reject', function(req, res) {
		res.setHeader('Content-Type', 'text/JSON;charset=UTF-8');
		var id = parseInt(req.query.id);
		Topic.approve(id, function(err, flag) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			return res.end(JSON.string({f: 1, m: '操作成功！'}));
		});
	});
};