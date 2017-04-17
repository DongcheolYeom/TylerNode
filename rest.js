
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

//Dummy DB 구현
var DummyDB = (function (){
	var DummyDB = {};
	var storage = [];
	var count = 1;
	
	DummyDB.get = function(id){
		if(id){
			//변수 가공
			id = (typeof id == 'string') ? Number(id) : id;
			
			// 데이터 선택
			for(var i in storage) if(storage[i].id == id){
				return storage[i]; 
			}
		} else{
			return storage;
		}
	};
	
	DummyDB.insert = function(data){
		data.id = count++;
		storage.push(data);
		return data;
	};
	
	return DummyDB;
	
})();

// 서버 생성
var app = express();

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended:false }));

// 라우터 설정
app.get('/user', function(request, response){
	response.send(DummyDB.get());
});

app.post('/user', function(request, response){
	var name = request.param('name');
	var region = request.param('region');
	
	if(name && region){
		response.send(DummyDB.insert({
			name : name,
			region : region
		}));
	} else{
		throw new Error('error');
	}
});

http.createServer(app).listen(9000, function(){
	console.log('Server running at http://127.0.0.1:9000');
});