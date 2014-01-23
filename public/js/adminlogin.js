function handin() {
	$.post('/admin/login', {
		m: $('#mail').val(),
		p: $('#password').val()
	}, function(result) {
		var obj = JSON.parse(result);
		if (obj.f == 1) {
			$('#flag').val(1);
			return inform(obj.m)
		}
		else if (obj.f == 0)
			return inform(obj.e.m);
	});
	$('#modal').on('hidden', function() {
		if (parseInt($('#flag').val()) == 1)
			location.href='/admin';
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