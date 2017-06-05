var route = require('express').Router()
    , fs = require('fs')
    , xmlStream = require('xml-stream')
    , sftp = require('../config/sftp/ftp')()
    , config = require('../config/properties/deploy.json');

route.get('/', function (req, res) {
    res.render('pages/deploy', {layout: false});
});

route.post('/ajaxXmlList', function (req, res) {
    console.log("== FTP START ==");

    var ftpPath = req.body.ftpDectoryPath;
    console.log("FTP Path : " + ftpPath);

    sftp.list(ftpPath).then(function (result) {
        res.status(200).send(JSON.stringify(result));
        console.log("== FTP END ==");
    }).catch(function (err) {
        console.log(err, 'catch error');
    });
});

route.post('/ajaxXmlInfo', function (req, res) {
    console.log("== FTP START ==");

    var ftpPath = req.body.ftpDectoryPath;
    var fileName = req.body.fileName;
    var releaseTypeVal = req.body.releaseTypeVal;
    var localPath = config.deploy.localPath + fileName;

    console.log("FTP Path : " + ftpPath);
    console.log("File Name : " + fileName);
    console.log("Release Type : " + releaseTypeVal);
    console.log("Local Path : " + localPath);

    var options;
    if (config.deploy.onLine == releaseTypeVal || config.deploy.onLineFirst == releaseTypeVal) {
        options = {encoding: 'utf8'};
    } else {
        options = {encoding: 'utf16le'};
    }

    sftp.get(ftpPath, options).then(function (result) {
        var writeStream = fs.createWriteStream(localPath);
        result.pipe(writeStream);

        writeStream.on('close', function () {
            var readStream = fs.readFileSync(localPath);
            res.status(200).send(readStream);
            console.log("== FTP END ==");
        });

        //res.status(200).type('xml').send(fs.readFileSync('D:/Dev/61_6251.xml', {encoding: 'utf-8'}));
    }).catch(function (err) {
        console.log(err, 'catch error');
    });
});

module.exports = route;