var config = {
    joongang : "중앙일보",
    sunday : "중앙선데이",
    stage : "스테이지",
    onLine : "온라인",
    onLineFirst : "온라인(속보)",
    paper : "지면",
    ftpRootPath : "/trans",
    stagePath : "/stg/deploy",
    productionPath : "/svc/deploy",
    joongangOnLinePath : "/1/backup",
    joongangOnLineFirstPath : "/3/backup",
    joongangPaperPath : "/D001/backup",
    sundayOnLinePath : "/61/backup",
    sundayPaperPath : "/W005/backup"
};

var fileName,
    xmlFileInfo,
    mediaTypeVal,
    releaseTypeVal,
    searchDate,
    block;

$(function() {
	$(document).on('click', '#xmlFileList tbody tr', function(){
		fileName = $(this).attr('id');
	});

    $(document).on("click","#pageIndexList li",function(){
        var pageIdx = $(this).text();
        printXmlList(xmlFileInfo, pageIdx);
    });
});

$('#serverType').material_select();
$('#mediaType').material_select();
$('#releaseType').material_select();

$('.datepicker').pickadate({
    today: '오늘',
    clear: '',
    close: '취소',
    selectMonths: true,
    selectYears: 15,
    format: 'yyyy-mm-dd',
    closeOnSelect: true,
    closeOnClear: true,
    max: true,
    onSet: function(arg) {
        if ('select' in arg) {
            this.close();
        }
    }
});

$('#xmlModal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute

    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $('.xmlcontent').text('');

        var serverTypeId = $('#serverType option:selected').attr('id');
        var mediaTypeId = $('#mediaType option:selected').attr('id');
        var releaseTypeId = $('#releaseType option:selected').attr('id');
        var serverTypeVal = $('#serverType option:selected').val();
        var releaseTypeVal = $('#releaseType option:selected').val();
        searchDate = $('#searchDate').val();
        mediaTypeVal = $('#mediaType option:selected').val();

        var searchDateSplit = searchDate.split('-');

        validParam(serverTypeId, mediaTypeId, releaseTypeId, searchDate);
        var ftpDectoryPath = getFTPDectoryPath(searchDateSplit, serverTypeVal, mediaTypeVal, releaseTypeVal);
        console.log("====" + ftpDectoryPath);

      	$.ajax({
    	  	type:'POST',
    	  	url:'/deploy/ajaxXmlInfo',
            data : {"ftpDectoryPath" : ftpDectoryPath, "fileName" : fileName, "releaseTypeVal" : releaseTypeVal},
  		  	success:function(data){
              	console.log("success");
              	var strData = data.toString();
             	$('.xmlcontent').text(strData);
  		  	},
  		  	error:function(data) {
  		  		console.log("fail : " + data);
  		  	}
  	  	});
    },

    complete: function() { $('.xmlcontent').text(''); } // Callback for Modal close
});

$('#searchBtn').click(function(){
    this.fileName = null;
	var serverTypeId = $('#serverType option:selected').attr('id');
	var mediaTypeId = $('#mediaType option:selected').attr('id');
	var releaseTypeId = $('#releaseType option:selected').attr('id');
	var serverTypeVal = $('#serverType option:selected').val();
    searchDate = $('#searchDate').val();
    mediaTypeVal = $('#mediaType option:selected').val();
	releaseTypeVal = $('#releaseType option:selected').val();

	var searchDateSplit = searchDate.split('-');

    validParam(serverTypeId, mediaTypeId, releaseTypeId, searchDate);
    var ftpDectoryPath = getFTPDectoryPath(searchDateSplit, serverTypeVal, mediaTypeVal, releaseTypeVal);
    console.log("====" + ftpDectoryPath);

	$.ajax({
		type:'POST',
		url:'/deploy/ajaxXmlList',
		data : {"ftpDectoryPath" : ftpDectoryPath},
		success:function(data){
			xmlFileInfo = $.parseJSON(data);
            printXmlList(xmlFileInfo, 1);
		},
		error:function(data) {
			console.log("fail : " + data);
		}
	});
});

function printXmlList(xmlFileInfo, pageIdx){
    if('chevron_right' == pageIdx){
        block++;
    }else if('chevron_left' == pageIdx){
        block--;
    }else{
        block = Math.ceil(pageIdx/10);
    }

    var xmlListSize = xmlFileInfo.length;
    var totalPage = Math.ceil(xmlListSize/10);

    //현재 블럭에서 시작페이지 번호
    var startPage = ((block - 1) * 10 ) + 1;
    //현재 블럭에서 마지막 페이지 번호
    var endPage = startPage + 10 - 1;

    if (endPage > totalPage){
        endPage = totalPage;
    }

    if('chevron_right' == pageIdx){
        if(startPage > endPage){
            block--;
            return;
        }else{
            pageIdx = startPage;
        }
    }else if('chevron_left' == pageIdx){
        if(block < 1){
            block = 1;
            return;
        }else{
            pageIdx = startPage;
        }
    }

    var startIdx = (pageIdx-1) * 10;

    $('#xmlFileList').empty();
    $('#pagingIndex').empty();
    var html = '<table id="xmlList" class="bordered highlight centered">';
    html += '<thead>';
    html += '<tr><th data-field="no">No.</th>'
        + '<th data-field="releaseDate">출고일</th>'
        + '<th data-field="mediaType">매체명</th>'
        + '<th data-field="releaseType">출고유형</th>'
        + '<th data-field="fileName">파일명</th>'
        + '<th data-field="fileContents">상세내용</th>'
        + '</tr>';
    html += '</thead>';
    html += '<tbody>';
    for (var i = startIdx; i < xmlListSize; i++) {
        var cnt = i+1;
        html += '<tr id="' + xmlFileInfo[i].name + '" class="rows">';
        html += '<td>' + cnt + '</td>';
        html += '<td>' + searchDate + '</td>';
        html += '<td>' + mediaTypeVal + '</td>';
        html += '<td>' + releaseTypeVal + '</td>';
        html += '<td>' + xmlFileInfo[i].name + '</td>';
        html += '<td><a class="btn waves-effect waves-light" href="#xmlModal">보기</a></td>';
        html += '</tr>'

        if(cnt == (pageIdx * 10)){
            break;
        }
    }
    html += '</tbody>';
    html += '</table>';

    $('#pageIndexList li').attr("class", "waves-effect");
    $(this).attr("class", "active");

    var htmlPage = '<ul id="pageIndexList" class="pagination"><li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';
    for (var i = startPage; i < endPage+1; i++) {
        var cnt = i;
        if(i == pageIdx){
            htmlPage += '<li class="active"><a href="#!">' + cnt + '</a></li>';
        }else{
            htmlPage += '<li class="waves-effect"><a href="#!">' + cnt + '</a></li>';
        }
    }
    htmlPage += '<li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li></ul>';

    $('#xmlFileList').append(html);
    $('#pagingIndex').append(htmlPage);
}

function getFTPDectoryPath(searchDateSplit, serverTypeVal, mediaTypeVal, releaseTypeVal){
    var ftpDectoryPath = config.ftpRootPath;

    if(config.stage == serverTypeVal){
        ftpDectoryPath += config.stagePath;
    }else{
        ftpDectoryPath += config.productionPath;
    }

    if(config.joongang == mediaTypeVal && config.onLine == releaseTypeVal){
        ftpDectoryPath += config.joongangOnLinePath;
    }else if(config.joongang == mediaTypeVal && config.onLineFirst == releaseTypeVal){
        ftpDectoryPath += config.joongangOnLineFirstPath;
    }else if(config.joongang == mediaTypeVal && config.paper == releaseTypeVal){
        ftpDectoryPath += config.joongangPaperPath;
    }else if(config.sunday == mediaTypeVal && config.onLine == releaseTypeVal){
        ftpDectoryPath += config.sundayOnLinePath;
    }else{
        ftpDectoryPath += config.sundayPaperPath;
    }

    if(null != this.fileName){
        ftpDectoryPath += "/" + searchDateSplit[0] + searchDateSplit[1] + "/" + searchDateSplit[2] + "/" + this.fileName;
    }else{
        ftpDectoryPath += "/" + searchDateSplit[0] + searchDateSplit[1] + "/" + searchDateSplit[2];
    }

    return ftpDectoryPath;
}

function validParam(serverTypeId, mediaTypeId, releaseTypeId, searchDate){
    if('' == serverTypeId){
        alert('서버유형을 선택하세요.');
        return;
    }

    if('' == mediaTypeId){
        alert('매체명을 선택하세요.');
        return;
    }

    if('' == releaseTypeId){
        alert('출고유형을 선택하세요.');
        return;
    }

    if('' == searchDate){
        alert('조회일을 선택하세요.');
        return;
    }
}


