/**
 * Created by sebastien on 29/10/14.
 */

var adminAuth = require('../adminAuthenticator');
var qs = require('querystring');
var req;

function setRequest(request) {
    console.log("playersList | setting request variable");
    req = request;
}
exports.setRequest = setRequest;


function showLoginPage(onExecuted) {
    console.log("login | showLoginPage");

    var response = { content: "" };
    var statusCode = 200;
    var method = req.method;

    if(method == 'GET') {
        response = "<h1>Login</h1>";

        response += '<form method="post" action="/login">';
        response += '<input type="text" name="login" value="" placeholder="Username or Email">';
        response += '<input type="password" name="password" value="" placeholder="Password">';
        response += '<input type="submit" name="commit" value="Login">';
        response += '</form>';

        onExecuted(response, statusCode);
    } else if (method == 'POST') {
        console.log("POST received !");

        var body = '';
        req.on("data", function(data) {
           body += data;
        });

        req.on("end", function() {
            var postData = qs.parse(body);

            console.log(postData);

            if(postData) {
                if(postData.login && postData.password && postData.commit) {
                    adminAuth.handleLogin(postData.login, postData.password, function(isAuthorized) {
                        if(isAuthorized) {
                            console.log("Credentials accepted ! Welcome " + postData.login + ".");

                            var redirection = { "hasToRedirect": true, "location":"/playersList" };

                            var res = "Credentials accepted ! Welcome " + postData.login + ".";
                            response.content = res;
                            statusCode = 302; // Redirect

                            onExecuted(response, statusCode, redirection);
                        } else {
                            console.log("Bad credentials !");
                            response.content = "Bad credentials !";
                            onExecuted(response, statusCode);
                        }
                    })
                } else {
                    console.log("login | showLoginPage | Missing Parameters !");
                    response.content = 'Missing Parameters !';
                    onExecuted(response, statusCode);
                }
            }
        });
    } else {
        statusCode = 405;
        response.content = "Method Not Allowed !";
        onExecuted(response, statusCode);
    }
}
exports.login = showLoginPage;