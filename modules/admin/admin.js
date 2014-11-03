/**
 * Created by sebastien on 21/10/14.
 */

var http = require('http');
var url = require('url');
var socketServer = require('../socketServer');
var adminTools = require('./adminTools');
var port = 6666;
var ip = '192.168.11.115';
var cookie;

/**
 * Function start
 * Permet de démarrer le serveur http d'administration
 * @param route
 */
function start(route) {
    function onHttpRequest(req, res) {

        //console.log("cookies = " + req.headers.cookie);
        console.log(req.headers);

        handleRoute(route, req, function(routeResponse, statusCode, redirection) {

            console.log("routeResponse = " + routeResponse);
            console.log("statusCode = " + statusCode);
            console.log("redirection = " + redirection);

            var head = {};

            if(redirection) {
                if(redirection.hasToRedirect) {
                    head["Location"] = redirection.location;

                    if(cookie) {
                        //var testCookie = (Math.random() * 100) + "=" + (Math.random() * 10000) +"; expires=" + cookie.expirationTime;
                        var adminCookie = "administration=" + cookie.value + "; expires=" + cookie.expirationTime;
                        //head["Set-Cookie"] = "administration=" + cookie.value + "; expires=" + cookie.expirationTime;

                        res.setHeader("Set-Cookie", [adminCookie]);
                    }
                }
            } else {
                head["Content-Type"] = "text/html";
            }

            res.writeHead(statusCode, head);
            res.end(routeResponse);
        });
    }

    http.createServer(onHttpRequest).listen(port, ip);
    console.log('Admin server is started and listening on ' + ip + ':' + port + '!');
}

/**
 * Function setCookie
 * Permet de setter la valeur de cookie (cookie à renvoyer au client qui détermine le token d'authentification)
 * @param newValue
 */
function setCookie(newValue) {
    cookie = newValue;
}

exports.setCookie = setCookie;


/**
 * Function handleRoute
 * Appel le gestionnaire de route pour gérer la route demandée par le client
 * @param route
 * @param req
 * @param onHandled
 */
function handleRoute(route, req, onHandled) {
    if(route) {
        route(req, function(routeResponse, code, redirection) {
            if(routeResponse instanceof Function) {
                routeResponse(function(fncResponse, statusCode, redirection) {
                    if(typeof fncResponse === 'object') {
                        fncResponse = JSON.stringify(fncResponse);
                    }
                    onHandled(fncResponse,statusCode,redirection);
                });
            } else {
                if(redirection) {
                    onHandled(routeResponse, code, redirection);
                } else {
                    onHandled(routeResponse, code);
                }
            }
        });
    } else {
        onHandled("Woops ! An error has occured !");
    }
}

/*function handleMethod(request, onDone) {
    console.log("admin | handleMethod");
    var response = { content: "" };
    var statusCode = 200;
    var method = request.method;

    if(method == 'GET') {
        var parsedUrl = url.parse(request.url, true);
        console.log("admin | parsedUrl = " + parsedUrl);
        console.log(parsedUrl.query);
        console.log(parsedUrl.query);

        var requestParam = parsedUrl.query;
        if(adminTools.checkObjectProperty(requestParam, "function") && adminTools.checkObjectProperty(requestParam, "functionParam")) {
            console.log("Function OK && FunctionParam OK");

            var selectedFunction = requestParam.function;
            var selectedFunctionParam = requestParam.param;

            handleQueryFunction(selectedFunction, selectedFunctionParam, function(fncResult) {
                response.content = fncResult;
                onDone(response, statusCode);
            });
        } else {
            console.log("Missing Arguments");
            onDone("Missing Arguments");
        }
    } else {
        statusCode = 405;
        response.content = "Method Not Allowed !";
        onDone(response, statusCode);
    }
}

exports.handleMethod = handleMethod;*/

/**
 * Function handleQueryFunction
 * Detient toutes les commandes d'administration
 * @param fnc
 * @param param
 * @param onDone
 */
function handleQueryFunction(fnc, param, onDone) {
    console.log("admin | handleQueryFunction");
    var playersSockets = socketServer.clients;
    //console.log(playersSockets.length);
    switch (fnc) {
        case "kickPlayerByIp":
            kickPlayerByIp(param, playersSockets, function(isDone, executionInfo) {
                if(isDone) {

                } else {

                }
                onDone(executionInfo);
            });
            break;
        case "kickPlayerByName":
            kickPlayerByName(param, playersSockets, function(isDone, executionInfo) {
                if(isDone) {

                } else {

                }
                onDone(executionInfo);
            });
            break;
        case "killThemAll":
            killThemAll(playersSockets, function(isDone, executionInfo) {
                if(isDone) {

                } else {

                }
                onDone(executionInfo);
            });
            break;
        case "getPlayersList":
            console.log("admin | handleQueryFunction | case getPlayersList");
            getConnectedPlayersList(playersSockets, function(isDone, executionInfo, playersList) {
                var responseContent;
                if(isDone) {
                    responseContent = { playersList: playersList };
                } else {
                    responseContent = executionInfo;
                }

                console.log("admin | handleQueryFunction | case getPlayersList | isDone " + isDone);
                console.log("admin | handleQueryFunction | case getPlayersList | executionInfo " + executionInfo);
                onDone(responseContent);
            });
            break;
        default:
            onDone("La fonction demandée n'existe pas !");
            break;
    }
}

exports.handleQueryFunction = handleQueryFunction;


/**
 * Function getConnectedPlayersList
 * Récupère et renvoie la liste des joueurs connectés
 * @param playersList
 * @param onDone
 */
function getConnectedPlayersList(playersList, onDone) {
    console.log("admin | getConnectedPlayersList");
    var playersLength = playersList.length;
    var isDone = false;
    var executionInfo = '';
    var players = [];

    if(playersLength > 0) {
        for (var i = 0; i < playersLength; i++) {
            players.push(playersList[i].name);
        }
        isDone = true;

        executionInfo = 'Liste des joueurs connectés récupérée avec succès';
    } else {
        executionInfo = 'Aucun joueurs n\'est connectés actuellement';
    }

    onDone(isDone, executionInfo, players);
}

function countConnectedPlayers(players) {

}

/**
 * Function killThemAll
 * Permet de kicker (éjecter) tous les joueurs connectés
 * @param playersList
 * @param onDone
 */
function killThemAll(playersList, onDone) {
    var executionInfo;

    var isDone = false;
    var playersLength = playersList.length;

    if(playersLength > 0) {
        for(var i = 0; i < playersLength;i++ ) {
            players[i].destroy();
        }

        isDone = true;
        executionInfo = 'Tous les joueurs ont été kickés';
    } else {
        executionInfo = 'Aucun joueurs n\'est connectés actuellement';
    }

    onDone(isDone, executionInfo);
}

/**
 * Function kickPlayerByIp
 * Permet de kicker (éjecter) un joueur via son IP
 * @param ip
 * @param playersList
 * @param onDone
 */
function kickPlayerByIp(ip, playersList, onDone) {
    var executionInfo;
    var isDone = false;

    if(ip) {
        if(typeof ip == 'string') {
            if (ip.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g)) {
                var playersLength = playersList.length;
                if (playersLength > 0) {
                    for (var i = 0; i < playersLength; i++) {
                        var clientIp = playersList[i]._peername.address;
                        if (clientIp === ip) {
                            var playerName = playersList[i].name;
                            playersList[i].destroy();
                            isDone = true;
                            executionInfo = 'Le joueur ' + playerName + 'avec l\'ip ' + ip + ' a été kické';
                        } else {
                            executionInfo = 'Aucun joueurs avec l\'ip ' + ip + ' n\'a été trouvé';
                        }
                    }
                } else {
                    executionInfo = 'Aucun joueurs n\'est connectés actuellement';
                }
            } else {
                executionInfo = 'L\'ip transmise n\'est pas une adresse IP valide !';
            }
        } else {
            executionInfo = 'L\'ip transmise n\'est pas de type String';
        }
    } else {
        executionInfo = 'Aucune ip transmise !';
    }

    onDone(isDone, executionInfo);
}

/**
 * Function kickPlayerByName
 * Permet de kicker (éjecter) un joueur via son nom
 * @param name
 * @param playersList
 * @param onDone
 */
function kickPlayerByName(name, playersList, onDone) {
    var executionInfo;
    var isDone = false;

    if(name) {
        if(typeof name == 'string') {
            if (ip.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}\|\w{1,})/g)) {
                var playersLength = playersList.length;
                if (playersLength > 0) {
                    for (var i = 0; i < playersLength; i++) {
                        var clientName = playersList[i].name;
                        var clientIp = playersList[i]._peername.address;
                        var regex = new RegExp(name, "g");

                        if (clientName.search(regex) != -1) {

                            var playerName = playersList[i].name;
                            playersList[i].destroy();

                            //clients.splice(i, 1);

                            isDone = true;

                            executionInfo = 'Le joueur ' + playerName + ' a été kické';
                        } else {
                            executionInfo = 'Aucun joueurs avec le nom ' + name + ' n\'a été trouvé';
                        }
                    }
                } else {
                    executionInfo = 'Aucun joueurs n\'est connectés actuellement';
                }
            } else {
                executionInfo = 'Le nom transmis n\'est pas un nom valide !';
            }
        } else {
            executionInfo = 'L\'ip transmise n\'est pas de type String';
        }
    } else {
        executionInfo = 'Aucune ip transmise !';
    }

    onDone(isDone, executionInfo);
}

/** EXPORTS */
exports.start = start;