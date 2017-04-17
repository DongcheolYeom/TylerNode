var route = require('express').Router()
    , node_ssh = require('node-ssh')
    , ssh = new node_ssh()
    , config = require('../config/ssh/ssh.json');

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
    if("corewas01" == wasType){
        wasConfig = config.corewas01;
    }else{
        wasConfig = config.corewas02;
    }
    ssh.connect({
        host: wasConfig.host,
        port: wasConfig.port,
        username: wasConfig.username,
        password: wasConfig.password

        /*
         // CORE WAS 01
         host: '10.50.23.85',
         port: '2211',
         username: 'gunman',
         password: '!@#wkfk007*()'

         // CORE WAS 02
         host: '10.50.23.86',
         port: '2211',
         username: 'gunman',
         password: '!@#xlahs700*()'*/

    }).then(function() {
        console.log("Core Was Connected.");

        ssh.connection.exec('less /home/gunman/apache-tomcat-8.5.8/logs/joongang.log |grep ' + articleId, function (err, response) {
            response.on('data', function(data) {
                console.log(data.toString());
                res.status(200).send(data.toString());
            });

            response.on('end', function(){
                ssh.dispose();
            });
        });
    }).catch(function(err) {
        console.log(err, 'catch error');
    });

});

module.exports = route;