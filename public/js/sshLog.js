/**
 * http://usejsdoc.org/
 */

$(function() {});

$('#wasServerType').material_select();

$('#releaseLogBtn').click(function(){
	var serverTypeId = $('#wasServerType option:selected').attr('id');
	var serverTypeVal = $('#wasServerType option:selected').val();
	var articleId = $('#articleId').val();

	console.log("serverTypeId : " + serverTypeId);
	console.log("articleId : " + articleId);
	if('' == serverTypeId) {
        alert('서버유형를 선택하세요.');
        return;
    }

    if('' == articleId) {
        alert('기사아이디를 선택하세요.');
        return;
    }

	$.ajax({
		type:'POST',
		url:'/releaseLog',
		data : {"serverTypeId" : serverTypeId, "articleId" : articleId},
		success:function(data){
            var releaseLogInfo = data.toString();

            $('#releaseLogArea').empty();
            var html = '<i class="material-icons">done</i><span>출고로그</span>';
            html += '<textarea class="materialize-textarea" name="releaseLog" id="releaseLog" rows="100" readonly>';
            html += releaseLogInfo;
			html += '</textarea>';

            $('#releaseLogArea').append(html);
		},
		error:function(data) {
			console.log("fail : " + data);
		}
	});
});


