$(document).ready(function() {
	$.get('/topic/cates', function(data) {
		var obj = JSON.parse(data);
		for (var i in obj) {
			var entry = obj[i];
			var str = '<option value="' + entry.i + '">' + entry.n + '</option>';
			$('#cates1').append(str);
			$('#cates2').append(str);
		}
	});
	$('#ques').focus(function() {
		$('#ques').removeClass('input');
		$('#ques').addClass('input-xlarge');
	});
		$('#ques').blur(function() {
		$('#ques').removeClass('input-xlarge');
		$('#ques').addClass('input');
	});
	$('#cates1').change(function() {
		$.get('/topic/list?id=' + $('#cates1').val(), function(result) {
			var obj = JSON.parse(result);
			if (obj.f==0) {
				$("#modal_msg").html(obj.e.m);
				$("#modal").modal({
					backdrop:true,
    				keyboard:true,
    				show:true
				});
			}
			else if (obj.f == 1) {
				var array = obj.a;
				resetTopicSelect();
				for (var i in array) {
					var entry = array[i];
					$('#topic').append('<option value="' + entry.id + '">' + entry.n + '</option>');
				}
			}
		});
	});
});

var handinques = function() {
	$.post('/question/upload', {
		a1: $('#tans').val(),
		a2: $('#fansa').val(),
		a3: $('#fansb').val(),
		a4: $('#fansc').val(),
		c: $('#select01').val(),
		q: $('#ques').val()
	}, function(data) {
		var obj = JSON.parse(data);
		if (obj.f == 0)
			$("#modal_msg").html(obj.e.m);
		else if (obj.f == 1)
			$("#modal_msg").html(obj.m);
		$("#modal").modal({
			backdrop:true,
    		keyboard:true,
    		show:true
		});
	});
};

var handintype = function() {
	$.post('/topic/upload', {
		n: $('#newkind').val(),
		c: $('#cates2').val()
	}, function(data) {
		var obj = JSON.parse(data);
		if (obj.f == 1) {
			$("#modal_msg").html(obj.m);
			$('#newkind').val('');
		}
		else if (obj.f == 0)
			$("#modal_msg").html(obj.e.m);
		$("#modal").modal({
			backdrop:true,
    		keyboard:true,
    		show:true
		});
	});
};

var resetTopicSelect = function() {
	$('#topic').empty();
	$('#topic').append('<option value="0">请选择</option>');
};

/*
		if (obj.f == 0) {
			$("#modal_msg").html('话题载入未成功，请重试');
			$("#modal").modal({
				backdrop:true,
    			keyboard:true,
    			show:true
			});
		}
*/