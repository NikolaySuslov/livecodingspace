var express = require('express'),
    compression = require('compression'),
    serveStatic = require('serve-static'),
    serveIndex = require('serve-index'),
    cors = require('cors'),
    morgan = require('morgan'),
    path = require('path'),
    fs = require('fs'),
    argv = require('optimist').argv,
    http = require('http'),
    https = require('https');

//  var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var app = express();
var port = 3007;

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

    if (fs.statSync(dir).isDirectory()) 
    {
      return Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f))
    ))
    } else {
      if ((dir.indexOf('.yaml') !== -1) || (dir.indexOf('.js') !== -1) || (dir.indexOf('.html') !== -1)
      || (dir.indexOf('.json') !== -1))
       // a little hack to resolve serving file paths under PC/Windows file system...
       return dir.replace(__dirname, '').replace(/\\/g, '/').replace('/public/',"/");
    }
}

app.get('/proxy-files', function (req, res) {
 // console.log(allFilesSync(__dirname + '/public/proxy/'));
  res.writeHead(200, {"Content-Type": "application/json"});
  let json = JSON.stringify(readDirR(__dirname + '/public/defaults/proxy/'));
  res.end(json);
});

app.get('/world-files', function (req, res) {
 // console.log(allFilesSync(__dirname + '/public/defaults/templates/'));
  res.writeHead(200, {"Content-Type": "application/json"});
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



var ssl = ( argv.s  || argv.ssl );
var pass = ( ( argv.w) ? ( argv.w) : undefined );
var sslOptions = {
    key: ( ( argv.k || argv.key ) ? fs.readFileSync( argv.k || argv.key ) : undefined ),
    cert: ( ( argv.c || argv.cert ) ? fs.readFileSync( argv.c || argv.cert ) : undefined ),
    ca: ( ( argv.t || argv.ca ) ? fs.readFileSync( argv.t || argv.ca ) : undefined ),
    passphrase: JSON.stringify(pass)
};

//create the server
var port = ( ( argv.p || argv.port ) ? ( argv.p || argv.port ) : 3007 );

var srv = ssl ? https.createServer( sslOptions, app ).listen( port ) : http.createServer( app ).listen( port );
console.log( 'Serving on port ' + port );