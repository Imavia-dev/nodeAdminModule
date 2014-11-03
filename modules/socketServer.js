/**
 * @author Sebastien
 */

/** Required modules */
var net = require('net');


/** Variables */
// Port to open the socket on
var PORT = 25002;
// Client authorization game connection status
var access = " not granted";
// List of connected clients
var clients = [];

exports.clients = clients;

/**
 * function start()
 * exported function to start the socketServer
 */
function start() {
    console.log("socketServer is started !");

    // Create the socket server
    var server = net.createServer(function (sock) {

        // Set NoDelay to true to fire data writing immediately
        sock.setNoDelay(true);

        // Event triggered when some data are received
        sock.on('data', function (data) {
            console.log("data has been received");

            sock.name = sock.remoteAddress + ":" + sock.remotePort + "|";
            // Put this new client in the list
            clients.push(sock);

            try {
                /*var data = JSON.parse(data);

                var action = data.action;
                var label = data.label;

                if (label == "admin") {
                    switch (action) {
                        case "showClients":
                            for (var i = 0; i < clients.length; i++) {
                                console.log((i + 1) + " | joueur connecté avec IP : " + clients[i].name);
                            }

                            /*server.getConnections(function (err, count) {
                                if (!err) {
                                    console.log("nombre de clients connectés : " + count);
                                } else {
                                    console.log(err);
                                }
                            });*/
                            /*break;
                        case "kickClientByIp":
                            var ipToKick = data.param;
                            //console.log(ipToKick);

                            for (var i = 0; i < clients.length; i++) {
                                var clientName = clients[i].name;
                                var regex = new RegExp(ipToKick, "g");

                                if (clientName.search(regex) != -1) {

                                    console.log(clients.length);

                                    //clients[i].end();
                                    //console.log("end");

                                    clients[i].destroy();
                                    console.log("destroy");

                                    //clients.splice(i, 1);

                                    //console.log(clients.length);

                                }
                            }
                            break;
                        default:
                            break;
                    }
                } else {

                }*/
            } catch(e) {
                //console.log(e);
                //console.log(data);

                //console.log("********************");
                //console.log(data.toString('utf8'));
                //console.log("********************");

                /*server.getConnections(function (err, count) {
                    if (!err) {
                        console.log("nombre de clients connectés : " + count);
                        sock.end("nombre de clients connectés : " + count);
                    } else {
                        console.log(err);
                    }
                });*/

                /*var players = [];
                for (var i = 0; i < clients.length; i++) {
                    var currentName = sock.remoteAddress + ":" + sock.remotePort + "|";

                    if(clients[i].name != currentName) {
                        var newPlayer = { name: clients[i].name };
                        players.push(newPlayer);
                    }
                }

                var response = { res: players };*/

                //sock.end(JSON.stringify(response));
                //sock.write("test");
            }
        });

        // Event triggered when the connection to the client is close
        sock.on('close', function (data) {
            // LOG
            //log.debug("SOCKETSERVER | Fermeture de la session pour le client " + sock.remoteAddress + ' ' + sock.remotePort);
            if (clients.length > 0) {
                try {
                    //var username = clients[clients.indexOf(sock)].name.split("|")[1];

                    // Remove the disconnected client from clients list
                    clients.splice(clients.indexOf(sock), 1);

                    console.log("Nombre de gens connectes " + clients.length);
                } catch (e) {
                    console.log("Une erreur est survenenue à la deconnection du joueur");

                }
            }
        });

        // Event triggered when there is and error witch the socket communication
        sock.on('error', function (err) {
            // Throw the errors
            log.error("SOCKETSERVER | Erreur sur le socket " + err)

            // Throw the errror(s)
            tools.throwError(err);
        });

    });

    /**
     * Start to listen on the given PORT
     * @param {int} PORT port to start the socket and listen on
     * @param callback anonymous callback to LOG the server address, port and IP type
     */
    server.listen(PORT, function () {
        // Address of the listening server
        var address = server.address();
        // LOG
        //log.info("SOCKETSERVER | Le serveur a ete initialise %j:%j (type %j)", address.address, address.port, address.family);
    });
}

/**
 * function writeToClient
 * @param socket
 * @param data
 */
function writeToClient(socket, data) {
    response = JSON.stringify(data)
    socket.write(response);
}


/** EXPORTS */
exports.start = start;