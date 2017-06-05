var route = require('express').Router()
    , node_ssh = require('node-ssh')
    , ssh = new node_ssh()
    , config = require('../config/properties/ssh.json');

route.get('/', function(req, res){
	res.render('pages/sshLog', { layout: false });
});

route.post('/releaseLog', function(req, res){
    console.log("== FTP START ==");
    var wasType = req.body.serverTypeId;
    var articleId = req.body.articleId;
    console.log("Was Type : " + wasType);
    console.log("Article id : " + articleId);

    var wasConfig;
    if(config.WasName.PrdCoreWas01 == wasType){
        wasConfig = config.WasType.PRD-CORE-WAS01;
    }else if(config.WasName.PrdCoreWas02 == wasType){
        wasConfig = config.WasType.PRD-CORE-WAS02;
    }else{
        wasConfig = config.WasType.STG-CORE-WAS01;
    }

    console.log("wasConfig : " + wasConfig.host);
    ssh.connect({
        host: wasConfig.host,
        port: wasConfig.port,
        username: wasConfig.username,
        password: wasConfig.password

    }).then(function() {
        console.log("PRD-CORE CONNECTED.");

        ssh.connection.exec('less /home/gunman/apache-tomcat-8.5.8/logs/joongang.log |grep ' + articleId, function (err, response) {
            response.on('data', function(data) {
                res.status(200).send(data.toString());
            }).on('end', function(){
                console.log("PRD-CORE DISCONNECTED.");
                ssh.dispose();
            });
        })

        /*var logMsg = [];
        ssh.connection.exec('less /home/gunman/apache-tomcat-8.5.8/logs/joongang.log |grep' + articleId, function (err, response) {
            response.on('data', function(data) {
                console.log(data.toString());
                /!*logMsg.push(data);*!/
            }).on('end', function(){
                /!*console.log(Buffer.concat(logMsg).toString());*!/
                /!*res.status(200).send(Buffer.concat(logMsg).toString());*!/
                ssh.dispose();
            });
        });*/
    }).catch(function(err) {
        console.log(err, 'catch error');
    });
});

module.exports = route;