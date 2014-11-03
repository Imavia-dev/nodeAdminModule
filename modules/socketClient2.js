/**
 * Created by sebastien on 21/10/14.
 */
var net = require('net');

var HOST = '192.168.11.115';
var PORT = 25002;

function start() {

    var client = new net.Socket();
    client.connect(PORT, HOST, function () {

        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
        //client.write('I am Chuck Norris!');

        var response = { label: "admin", action: "kickClientByIp", param:"192.168.11.115:34531" };

        client.write(JSON.stringify(response));

    });

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
    client.on('data', function (data) {

        console.log('DATA: ' + data);
        // Close the client socket completely
        client.destroy();

    });

// Add a 'close' event handler for the client socket
    client.on('close', function () {
        console.log('Connection closed');
    });

}

/** EXPORTS */
exports.start = start;