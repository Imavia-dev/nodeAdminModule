/**
 * Created by sebastien on 29/10/14.
 */

var adminFnc = require('../admin');
var req;

function setRequest(request) {
    console.log("playersList | setting request variable");
    req = request;
}
exports.setRequest = setRequest;


function getPlayersList(onExecuted) {
    console.log("playersList | getPlayersList");

    var response = { content: "" };
    var statusCode = 200;
    var method = req.method;

    if(method == 'GET') {
        adminFnc.handleQueryFunction('getPlayersList', '', function(fncResponse) {
            response.content = fncResponse;
            onExecuted(response, statusCode);
        })
    } else if (method == 'POST') {
        console.log("POST received !");
        onExecuted("No POST allowed for the moment on route playersList...");
    } else {
        statusCode = 405;
        response.content = "Method Not Allowed !";
        onExecuted(response, statusCode);
    }
}
exports.playersList = getPlayersList;