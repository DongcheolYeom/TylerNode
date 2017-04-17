var mysql = require('mysql');

//DB Connection
module.exports = function(){
	var conn = mysql.createConnection({
		host : 'localhost',
		port : 3306,
		user : 'root',
		password : 'admin',
		database : 'testdb'
	});

	conn.connect(function(err){
		if(err){ 
			console.log(err); 
		}
		else{ 
			console.log('mysql connected.'); 
		}
	});
	
	return conn;
};