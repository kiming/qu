
var user_service = require('../services/user_service');
var indices_service = require("../services/indices_service");

function User(user) {
	this.id;//用户id
	this.t;//用户title
	this.g;//用户性别1男0女-1未选择
	this.b;//用户诞生日
	this.a;//about简介
	this.cr;//用户country
	this.pr;//用户省份
	this.ct;//用户城市
	this.m = user.m;//用户邮箱mailbox
	this.p = user.p;//用户密码
	this.n = user.n;//用户昵称
};

module.exports = User;

User.prototype.save = function(callback) {
	var user = {
		m: this.m,
		p: this.p,
		n: this.n,
		t: this.t,
		g: this.g,
		b: this.b,
		a: this.a,
		cr: this.cr,
		pr: this.pr,
		ct: this.ct
	};
	indices_service.returnAndAdd('user', function(err, value) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		user.id = value;
		user_service.createUser(user, function(err, newuser) {
			if (err)
				return callback(err);
			return callback(null, user);
		});

	});
};

User.checkLogin = function(u, callback) {
	user_service.checkUser(u, function(err, user) {
		if (err)
			return callback({i: 0, m: '连接错误'});
		if (!user)
			return callback({i: 0, m: '用户名或密码错误'});
		return callback(null, user);
	});
};