var client = require('ssh2-sftp-client')
	, config = require('../properties/ftp.json');

//FTP Connection
module.exports = function(){
	let sftp = new client();

	sftp.connect({
	    host: config.ftpServer.host,
	    port: config.ftpServer.port,
	    username: config.ftpServer.username,
	    password: config.ftpServer.password

	}).then(function() {
	    console.log("FTP Connected.");
	}).catch(function(err) {
	    console.log(err, 'catch error');
	});
	
	return sftp;
};