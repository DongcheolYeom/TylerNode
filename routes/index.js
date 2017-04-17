var route = require('express').Router();
var conn = require('../config/mysql/db')();

route.get('/', function(req, res){
	var sql = 'select * from member';
	conn.query(sql, function(error, result, fields){
		if(error){
			res.status(500).send('Internal Server Error');
		}
		res.render('index', {data:result});
	});
});

module.exports = route;