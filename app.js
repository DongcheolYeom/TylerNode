
/**
 * Module dependencies.
 */
delete process.env["DEBUG_FD"];

var express = require('express')
	, route_deploy = require('./routes/deploy')
	, route_sshLog = require('./routes/sshLog')
	, http = require('http')
	, bodyParser = require('body-parser')
	, path = require('path');


var app = express();

//all environments
app.set('port', process.env.PORT || 9000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/deploy', route_deploy);
app.use('/', route_sshLog);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
