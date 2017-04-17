/**
 * Created by DongcheolYeom on 2017-03-18.
 */
var node_ssh = require('node-ssh')
    , ssh = new node_ssh()
    , config = require('./ssh.json');

module.exports = function(wasType){
    ssh.connect({

        host: config.get,
        port: config.port_wasType,
        username: config.username_wasType,
        password: config.password_wasType

         /*// CORE WAS 01
         host: '10.50.23.85',
         port: '2211',
         username: 'gunman',
         password: '!@#wkfk007*()'*/

        /*
        // CORE WAS 02
         host: '10.50.23.86',
         port: '2211',
         username: 'gunman',
         password: '!@#xlahs700*()'*/

    }).then(function() {
        console.log("Core Was Connected.");
        return ssh;
    }).catch(function(err) {
        console.log(err, 'catch error');
    });
};