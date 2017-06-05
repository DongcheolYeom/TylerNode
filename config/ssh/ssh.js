/**
 * Created by DongcheolYeom on 2017-03-18.
 */
var node_ssh = require('node-ssh')
    , ssh = new node_ssh()
    , config = require('../properties/ssh.json');

module.exports = function(wasType){
    ssh.connect({
        host: config.get,
        port: config.port_wasType,
        username: config.username_wasType,
        password: config.password_wasType

    }).then(function() {
        console.log("PRD-CORE-CONNECTED");
        return ssh;
    }).catch(function(err) {
        console.log(err, 'catch error');
    });
};