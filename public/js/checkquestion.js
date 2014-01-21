
$(document).ready(function() {
	/*$("#edit").modal({
		backdrop:true,
		keyboard:true,
		show:true
	});*/
	$.get('/topic/cates', function(data) {
		var obj = JSON.parse(data);
		for (var i in obj) {
			var entry = obj[i];
			var str = '<option value="' + entry.i + '">' + entry.n + '</option>';
			$('#cates1').append(str);
			$('#cates2').append(str);
		}
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
	$('#topic').css('display', 'none');
	$('#inputmode').click(function() {
		if (parseInt($('#mode').val())==0) {
			$('#mode').val(1);
			$('#inputmode').text('列表选择');
			$('#topics').css('display', 'inline');
			$('#topic').css('display', 'none');
		}
		else {
			$('#mode').val(0);
			$('#inputmode').text('手动输入');
			$('#topic').css('display', 'inline');
			$('#topics').css('display', 'none');
		}
	});

});

function show(str) {
	$("#modal_msg").html(str);
	$("#modal").modal({
		backdrop:true,
		keyboard:true,
		show:true
	});
};

function approve(t) {
	$.get('/question/approve?id='+t, function(result) {
		var obj = JSON.parse(result);
		if (obj.f == 0) {
			show(obj.e.m);
		}
		else if (obj.f == 1) {
			location.reload();
		}
	});
}

function reject(t) {
	$.get('/question/reject?id='+t, function(result) {
		var obj = JSON.parse(result);
		if (obj.f == 0) {
			show(obj.e.m);
		}
		else if (obj.f == 1) {
			show("操作成功！");
		}
	});
}

function allocate(t) {
	$.get('/question/getone?id=' + t, function(result) {
		var obj = JSON.parse(result);
		if (obj.f == 0)
			return show(obj.e.m);
		else if (obj.f == 1) {
			var question = obj.q;
			$('#cates1').val(obj.q.c);
			if (obj.q.m == 1) {
				$('#topics').val(obj.q.ts);
			}
			else if (obj.q.m == 0) {
				$('#topic').val(obj.q.tp);
			}
		}
		$("#edit").modal({
			backdrop:true,
			keyboard:true,
			show:true
		});
	});
};