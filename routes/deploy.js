var route = require('express').Router()
	, fs = require('fs')
	, xmlStream = require('xml-stream')
	, pd = require('pretty-data').pd
	, sftp = require('../config/sftp/ftp')();

route.get('/', function(req, res){
	res.render('pages/deploy', { layout: false });
});

route.post('/ajaxXmlList', function(req, res){
	console.log("== FTP START ==");

	var ftpPath = req.body.ftpDectoryPath;
	console.log("FTP Path : " + ftpPath);

	sftp.list(ftpPath).then(function(result) {
		res.status(200).send(JSON.stringify(result));
		console.log("== FTP END ==");
	}).catch(function(err) {
	    console.log(err, 'catch error');
	});
});

route.post('/ajaxXmlInfo', function(req, res) {
    console.log("== FTP START ==");

    var ftpPath = req.body.ftpDectoryPath;
    var fileName = req.body.fileName;
    var releaseTypeVal = req.body.releaseTypeVal;
    var localPath = "D:/Dev/Source(Java)/workspace/TylerNode/xml/" + fileName;

    console.log("FTP Path : " + ftpPath);
    console.log("File Name : " + fileName);
    console.log("Release Type : " + releaseTypeVal);
    console.log("Local Path : " + localPath);

    var options;
    if ('온라인' == releaseTypeVal) {
        options = {encoding: 'utf8'};
    } else{
        options = {encoding: 'utf16le'};
	}

	sftp.get(ftpPath, options).then(function(result) {
		var writeStream = fs.createWriteStream(localPath);
    	result.pipe(writeStream);

    	writeStream.on('close', function() {
            var readStream = fs.readFileSync(localPath);
            res.status(200).send(readStream);
			console.log("== FTP END ==");

			/*var parseStr = iconv.decode(result, "EUC-KR");
			console.log(parseStr);

            console.log("==== Before : " + xmlData);
            pp_xml  = pd.xml(xmlData);
            console.log("==== after : " + pp_xml);*/
    	});

        //res.status(200).type('xml').send(fs.readFileSync('D:/Dev/61_6251.xml', {encoding: 'utf-8'}));
	}).catch(function(err) {
	    console.log(err, 'catch error');
	});
});

module.exports = route;