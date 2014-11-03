/**
 * Created by sebastien on 29/10/14.
 */
var url = require('url');
var adminAuth = require('./adminAuthenticator');

/**
 * Variable availableRoutes
 * Liste les routes disponibles
 * @type {string[]}
 */
var availableRoutes = [
    'playersList',
    'login'
];

/**
 * Function handleRoute
 * Execute tout le processus de gestion des routes et d'authentification
 * @param req
 * @param routeResponse
 */
function handleRoute(req, routeResponse) {
    var pathName = url.parse(req.url).pathname;
        pathName = pathName.substring(1, pathName.length);
    var statusCode;
    checkRouteExist(pathName,function(exist, res, tokenAuthByPass) {
        if(exist) {
            statusCode = 200;
            var cookies = req.headers.cookie;

            adminAuth.getAdministrationCookie(cookies, function (cookieValue) {
                var response;
                adminAuth.handleToken(cookieValue, function (isAuth) {
                    var redirection;

                    console.log("||||||||||||||||||||||||||||||||||||||||||");
                    console.log("Auth = " + isAuth + " | tokenAuthBypass = " + tokenAuthByPass);
                    console.log("||||||||||||||||||||||||||||||||||||||||||");

                    if (isAuth || tokenAuthByPass) {
                        if(isAuth && tokenAuthByPass) {
                            console.log("AUTH == BYPASS");

                            response = "Already connected, redirecting !";

                            redirection = { "hasToRedirect": true, "location":"/playersList" };
                            statusCode = 302;
                            routeResponse(response, statusCode, redirection);
                        } else {
                            var fncToExec = require('./routes/' + pathName + '.js');
                            fncToExec.setRequest(req);
                            response = fncToExec[pathName];
                            routeResponse(response, statusCode);
                        }
                    } else {
                        response = "Token denied ! You have to log in before accessing any pages !";

                        redirection = { "hasToRedirect": true, "location":"/login" };
                        statusCode = 302;
                        routeResponse(response, statusCode, redirection);
                    }
                });
            });
        } else {
            statusCode = 404;
            routeResponse(res, statusCode);
        }
    });
}

exports.route = handleRoute;

/**
 * Function checkRouteExist
 * Permet de déterminer si une route existe
 * @param routeToCheck
 * @param onChecked
 */
function checkRouteExist(routeToCheck, onChecked) {
    var response = '';
    var exist;
    var tokenByPass = false;

    if(availableRoutes.indexOf(routeToCheck) != -1) {
        response = "route " + routeToCheck + " is available";
        exist = true;

        if(routeToCheck == 'login') {
            tokenByPass = true;
        }
    } else {
        response = "La route demande n'existe pas !";
        exist = false;
    }
    console.log(response);
    onChecked(exist, response, tokenByPass);
}