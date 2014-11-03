/**
 * Created by sebastien on 29/10/14.
 */

var adminTools = require('./adminTools');
var admin = require('./admin');
var crypto = require('crypto');
var timeToAdd = 600; // 600 = 10min (60sec * 10)

/**
 * Variable users
 * Liste les utilisateurs admin autorisés
 * @TODO à supprimer et voir pour intégrer un accès avec vérification via mongodb
 * @type {{sebastien: string, jerome: string}}
 */
var users = {
    "sebastien": "1234",
    "jerome": "5678"
};

/**
 * Variable currentAuhtenticatedUsers
 * Contient tous les utilisateurs loggés
 * @type {{}}
 */
var currentAuhtenticatedUsers = {};

/**
 * Variable accesAttempts
 * @TODO enregistrer le nombre de tentative de connexion
 * @type {Array}
 */
var accesAttempts = [];

/**
 * Function handleLogin
 * Gère l'authentification du client
 * @param username
 * @param pwd
 * @param onDone
 */
function handleLogin(username, pwd, onDone) {
    var isAuthorized = false;

    if(adminTools.checkObjectProperty(users, username)) {
        if(users[username] === pwd) {
            isAuthorized = true;
            generateAccessToken(username, function(tokenValue, expirationTime) {
                console.log("Token = " + tokenValue);
                var now = new Date().getTime() / 1000;
                var token = { "value": tokenValue, "creationTime": now, "expirationTime": expirationTime }
                currentAuhtenticatedUsers[tokenValue] = username;

                console.log("//////////////////////////////////////");
                console.log(currentAuhtenticatedUsers);
                console.log("//////////////////////////////////////");

                admin.setCookie(token);
                onDone(isAuthorized);

                console.log(currentAuhtenticatedUsers);
            });
        }
    } else {
        onDone(isAuthorized);
    }
}

exports.handleLogin = handleLogin;

/**
 * Function handleToken
 * Gère l'authentification par token
 * @param token
 * @param onHandled
 */
function handleToken(token, onHandled) {
    var auth = false;
    if(token) {
        if (currentAuhtenticatedUsers[token]) {
            console.log("Token OK");
            auth = true;
        }
    } else {
        console.log("Aucun token !");
    }
    onHandled(auth);
}

exports.handleToken = handleToken;


function checkTokenExpirationDate(token, onChecked) {
    var hasExpired = false;

    // @ TODO check if given token has expired

    onChecked(hasExpired);
}

/**
 * Function generateAccessToken
 * Génère un token en fonction du nom d'utilisateur et d'un nombre aléatoire
 * @TODO lire une clé dans un fichier externe et la concaténer à la variable key
 * @param username
 * @param onDone
 */
function generateAccessToken(username, onDone) {
    generateRandNbInRange(1,10000,function(randNb) {
        var key = username + randNb;
        var hash = crypto.createHash('sha512');
            hash.update(key);
        var token = hash.digest('hex');
        var tokenLength = token.length;

        generateRandNbInRange(1, 10, function(randomNumber) {
            token = token.slice(randomNumber, (tokenLength-randomNumber));

            generateExpirationTime(function(expirationTime) {
                onDone(token, expirationTime);
            });
        });
    });
}

/**
 * Function generateRandNbInRange
 * Génère et renvoie un nombre aléatoire compris dans une plage
 * @param min
 * @param max
 * @param onDone
 */
function generateRandNbInRange(min,max,onDone) {
    var randNb = Math.floor(Math.random() * (max - min + 1)) + min;
    onDone(randNb);
}

/**
 * Function generateExpirationTime
 * Permet de générer une date d'expiration pour le token
 * La variable timeToAdd est globale
 * @param onGenerated
 */
function generateExpirationTime(onGenerated) {
    var now = new Date();
    var time = now.getTime();
    time += timeToAdd * 1000;
    now.setTime(time);
    onGenerated(now.toUTCString());
}

/**
 * Function getAdministrationCookie
 * Lis les cookies du client et cherche/retourne celui nécessaire à l'authentification ('administration=')
 * @param cookies
 * @param onReaded
 */
function getAdministrationCookie(cookies, onReaded) {
    var adminCookie;

    console.log("***************************");
    console.log(cookies);
    console.log("***************************");

    if(cookies) {
        // match    : recupère le cookie nommé 'administration=154444844684784'
        // [0]      : recupere la valeur du cookie
        // split    : separe la string en deux, administration d'un côté et la valeur du cookie de l'autre
        // [1]      : valeur du cookie
        adminCookie = cookies.match(/administration=[a-z0-9]{1,}/g)[0].split('=')[1];
        console.log("AdminCookie = " + adminCookie[0]);
    }

    onReaded(adminCookie);
}

exports.getAdministrationCookie =getAdministrationCookie;