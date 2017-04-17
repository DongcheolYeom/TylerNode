var client = require('ssh2-sftp-client');

//FTP Connection
module.exports = function(){
	let sftp = new client();
	sftp.connect({
	    host: "10.50.23.88",
	    port: '2211',
	    username: "gunman",
	    password: "!@#dlgo544*()"
	}).then(function() {
	    console.log("FTP Connected.");
	}).catch(function(err) {
	    console.log(err, 'catch error');
	});
	
	return sftp;
};