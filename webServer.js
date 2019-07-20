/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/


var express = require('express'),
    compression = require('compression'),
    serveStatic = require('serve-static'),
    cors = require('cors'),
    morgan = require('morgan'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    //logger = require('./server/logger'),
    config = require('./server/readConfig')

var app = express();

//  var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');


function registerReflector(srv) {

    if (global.configuration.reflector === undefined)
        global.configuration.reflector = false;

    if (global.configuration.reflector) {

        //logger.info('register reflector server...\n');
        console.log('register reflector server...\n');
        var reflectorServer = require('lcs-reflector'),
            sio = require('socket.io')(srv);

        sio.set('transports', ['websocket']);
        sio.sockets.on('connection', reflectorServer.OnConnection);

        global.instances = {};
    }

}


function startServer() {

    //logger.info('Welcome to LiveCoding.space App server!\n');
    console.log('Welcome to LiveCoding.space App server!\n');
    config.readConfigFile();

    app.use(compression());
    app.use(serveStatic(__dirname + '/public'));
    app.use(cors());

    // app.use(function(req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //   next();
    // });

    app.use(morgan('combined'));

    /*=====Site specific paths=====*/

    // optional functions to load defaults (not required if DB is already bootstrapped)

    function readDirR(dir) {

        if (fs.statSync(dir).isDirectory()) {
            return Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f))
            ))
        } else {
            if ((dir.indexOf('.yaml') !== -1) || (dir.indexOf('.js') !== -1) || (dir.indexOf('.html') !== -1)
                || (dir.indexOf('.json') !== -1))
                // a little hack to resolve serving file paths under PC/Windows file system...
                return dir.replace(__dirname, '').replace(/\\/g, '/').replace('/public/', "/");
        }
    }

    app.get('/proxy-files', function (req, res) {
        // console.log(allFilesSync(__dirname + '/public/proxy/'));
        res.writeHead(200, { "Content-Type": "application/json" });
        let json = JSON.stringify(readDirR(__dirname + '/public/defaults/proxy/'));
        res.end(json);
    });

    app.get('/world-files', function (req, res) {
        // console.log(allFilesSync(__dirname + '/public/defaults/templates/'));
        res.writeHead(200, { "Content-Type": "application/json" });
        let json = JSON.stringify(readDirR(__dirname + '/public/defaults/worlds/'));
        res.end(json);
    });


    // send all requests to index.html so browserHistory in React Router works
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/', 'index.html'))
    })

    //=========end of specific===========

    // app.listen(port);
    // console.log('Web server is started on port: '+ port);

    var conf = config.parseConfigOptions();

    var srv = conf.ssl ? https.createServer(conf.sslOptions, app).listen(conf.port) : http.createServer(app).listen(conf.port);
    console.log('Serving on port ' + conf.port);

    registerReflector(srv);

}

exports.start = startServer;