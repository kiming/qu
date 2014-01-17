
var Question = require("../models/Question");
var Topic = require("../models/Topic");
var User = require("../models/User");

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

	app.get('/topic/cates', function(req, res) {
		res.setHeader('Content-Type', 'text/JSON;charset=UTF-8');
		return res.end(JSON.stringify(Topic.getCateList()));
	});

	app.get('/topic/list', function(req, res) {
		/*Topic.getAllChecked(function(err, array) {
			if (err)
				return res.end(JSON.stringify({f: 0, m: '出错，请重试'}));
			return res.end(JSON.stringify({f: 1, a: array}));
		});*/
		Topic.getTopicsOfCate(req.query.id, function(err, array) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			res.end(JSON.stringify({f: 1, a: array}));
		});
	});

	app.post('/topic/upload', function(req, res) {
		res.setHeader('Content-Type', 'text/JSON;charset=UTF-8');
		var topic = new Topic({
			name: req.body.n,
			user: req.session.user.id,
			cate: parseInt(req.body.c)
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
		Topic.reject(id, function(err, flag) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			return res.end(JSON.stringify({f: 1, m: '操作成功！'}));
		});
	});

	app.get('/user/login', function(req, res) {
		return res.render('login');
	});

	app.post('/user/login', function(req, res) {
		res.setHeader('Content-Type', 'text/JSON;charset=UTF-8');
		var u = {
			m: req.body.m,
			p: require('crypto').createHash('md5').update(req.body.p).digest('hex')
		};
		//console.log(JSON.stringify(u));
		User.checkLogin(u, function(err, user) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			req.session.user = user;
			return res.end(JSON.stringify({f: 1, m: '登录成功！'}));
		});
	});

	app.get('/user/reg', function(req, res) {
		return res.render('register');
	});

	app.post('/user/reg', function(req, res) {
		res.setHeader('Content-Type', 'text/JSON;charset=UTF-8');
		var user = new User({
			m: req.body.m,
			p: require('crypto').createHash('md5').update(req.body.p).digest('hex'),
			n: req.body.n
		});
		user.save(function(err, newuser) {
			if (err)
				return res.end(JSON.stringify({f: 0, e: err}));
			newuser.p = null;
			req.session.user = newuser;
			return res.end(JSON.stringify({f: 1, m: '注册成功'}));
		});
	});
};