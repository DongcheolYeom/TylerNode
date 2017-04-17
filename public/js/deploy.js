/**
 * http://usejsdoc.org/
 */
var fileName;
var xmlFileInfo;
var mediaTypeVal;
var releaseTypeVal;
var searchDate;

$(function() {
	$(document).on('click', '#xmlFileList tbody tr', function(){
		fileName = $(this).attr('id');
	});

    $(document).on("click","#pageIndexList li",function(){
        var pageIdx = $(this).text();
        printXmlList(xmlFileInfo, pageIdx-1);
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
        searchDate = $('#searchDate').val();
        var serverTypeVal = $('#serverType option:selected').val();
        mediaTypeVal = $('#mediaType option:selected').val();
        var releaseTypeVal = $('#releaseType option:selected').val();

        var searchDateSplit = searchDate.split('-');

        var ftpDectoryPath = "/trans";
        if('' == serverTypeId){
            alert('서버유형을 선택하세요.');
            return;
        }else{
            if('스테이지' == serverTypeVal){
                ftpDectoryPath += "/stg/deploy";
            }else{
                ftpDectoryPath += "/svc/deploy";
            }
        }

        if('' == mediaTypeId){
            alert('매체명을 선택하세요.');
            return;
        }

        if('' == releaseTypeId){
            alert('출고유형을 선택하세요.');
            return;
        }

        if('중앙일보' == mediaTypeVal && '온라인' == releaseTypeVal){
            ftpDectoryPath += "/1/backup";
        }else if('중앙일보' == mediaTypeVal && '지면' == releaseTypeVal){
            ftpDectoryPath += "/D001/backup";
        }else if('중앙선데이' == mediaTypeVal && '온라인' == releaseTypeVal){
            ftpDectoryPath += "/61/backup";
        }else{
            ftpDectoryPath += "/W005/backup";
        }

        ftpDectoryPath += "/" + searchDateSplit[0] + searchDateSplit[1] + "/" + searchDateSplit[2] + "/" + fileName;

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
	var serverTypeId = $('#serverType option:selected').attr('id');
	var mediaTypeId = $('#mediaType option:selected').attr('id');
	var releaseTypeId = $('#releaseType option:selected').attr('id');
	searchDate = $('#searchDate').val();
	var serverTypeVal = $('#serverType option:selected').val();
	mediaTypeVal = $('#mediaType option:selected').val();
	releaseTypeVal = $('#releaseType option:selected').val();

	var searchDateSplit = searchDate.split('-');

	var ftpDectoryPath = "/trans";
	if('' == serverTypeId){
		alert('서버유형을 선택하세요.');
		return;
	}else{
		if('스테이지' == serverTypeVal){
			ftpDectoryPath += "/stg/deploy";
		}else{
			ftpDectoryPath += "/svc/deploy";
		}
	}

	if('' == mediaTypeId){
		alert('매체명을 선택하세요.');
		return;
	}

	if('' == releaseTypeId){
		alert('출고유형을 선택하세요.');
		return;
	}

	if('중앙일보' == mediaTypeVal && '온라인' == releaseTypeVal){
		ftpDectoryPath += "/1/backup";
	}else if('중앙일보' == mediaTypeVal && '지면' == releaseTypeVal){
		ftpDectoryPath += "/D001/backup";
	}else if('중앙선데이' == mediaTypeVal && '온라인' == releaseTypeVal){
		ftpDectoryPath += "/61/backup";
	}else{
		ftpDectoryPath += "/W005/backup";
	}

	if('' == searchDate){
		alert('조회일을 선택하세요.');
		return;
	}else{
		ftpDectoryPath += "/" + searchDateSplit[0] + searchDateSplit[1] + "/" + searchDateSplit[2];
	}

	$.ajax({
		type:'POST',
		url:'/deploy/ajaxXmlList',
		data : {"ftpDectoryPath" : ftpDectoryPath},
		success:function(data){
			xmlFileInfo = $.parseJSON(data);
            printXmlList(xmlFileInfo, 0);
		},
		error:function(data) {
			console.log("fail : " + data);
		}
	});
});

function printXmlList(xmlFileInfo, pageIdx){
    var xmlListSize = xmlFileInfo.length;
    var startIdx = pageIdx * 10;

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

        if(cnt == (pageIdx+1)*10){
            break;
        }
    }
    html += '</tbody>';
    html += '</table>';

    $('#pageIndexList li').attr("class", "waves-effect");
    $(this).attr("class", "active");

    var html_page = '<ul id="pageIndexList" class="pagination"><li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';
    var pageCnt = Math.ceil(xmlListSize/10);
    for (var i = 0; i < pageCnt; i++) {
        var cnt = i+1;

        if(i == pageIdx){
            html_page += '<li class="active"><a href="#!">' + cnt + '</a></li>';
        }else{
            html_page += '<li class="waves-effect"><a href="#!">' + cnt + '</a></li>';
        }
    }
    html_page += '<li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li></ul>';

    $('#xmlFileList').append(html);
    $('#pagingIndex').append(html_page);
}



