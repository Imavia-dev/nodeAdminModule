/**
 * Created by sebastien on 21/10/14.
 */
var admin = require('./modules/admin/admin');
var socketServer = require('./modules/socketServer');
var router = require('./modules/admin/adminRouter');


socketServer.start();
admin.start(router.route);