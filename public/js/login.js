function handin() {
	$.post('/user/login', {
		m: $('#mail').val(),
		p: $('#password').val()
	}, function(result) {
		var obj = JSON.parse(result);
		if (obj.f == 1)
			return inform(obj.m)
		else if (obj.f == 0)
			return inform(obj.e.m);
	});
};

function inform(str) {
	$("#modal_msg").html(str);
	$("#modal").modal({
		backdrop:true,
    	keyboard:true,
    	show:true
	});
};