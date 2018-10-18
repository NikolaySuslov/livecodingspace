/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)  
ADL VW Sandbox Apache 2.0 license(https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/ADL_Sandbox_LICENSE.md)
*/

var fs = require('fs'),
    argv = require('optimist').argv,
    logger = require('./logger')

function parseConfigOptions() {

  let conf = {
      sslOptions: {}
  }

  var ssl = (argv.s || argv.ssl);
  var pass = ((argv.w) ? (argv.w) : undefined);
  var sslOptions = {
      key: ((argv.k || argv.key) ? fs.readFileSync(argv.k || argv.key) : undefined),
      cert: ((argv.c || argv.cert) ? fs.readFileSync(argv.c || argv.cert) : undefined),
      ca: ((argv.t || argv.ca) ? fs.readFileSync(argv.t || argv.ca) : undefined),
      passphrase: JSON.stringify(pass)
  };
  conf.sslOptions = sslOptions;

  var port = ((argv.p || argv.port) ? (argv.p || argv.port) : undefined);

  if (!ssl) {
      if (global.configuration.ssl === undefined)
          ssl = false;

      if (global.configuration.ssl) {
          ssl = true;
          if (global.configuration.sslKey !== "")
              conf.sslOptions.key = fs.readFileSync(global.configuration.sslKey)

          if (global.configuration.sslCert !== "")
              conf.sslOptions.cert = fs.readFileSync(global.configuration.sslCert)

          if (global.configuration.sslCA !== "")
              conf.sslOptions.ca = fs.readFileSync(global.configuration.sslCA)

          if (global.configuration.certPwd !== "")
              conf.sslOptions.passphrase = JSON.stringify(global.configuration.certPwd)
      }
  }

  if (!port) {
      if (global.configuration.port === undefined)
          global.configuration.port = 3007

      if (global.configuration.port)
          port = global.configuration.port
  }


  conf.ssl = ssl;
  conf.port = port

  return conf
}

function readConfigFile() {
  var configSettings;
  var p = process.argv.indexOf('-config');

  //This is a bit ugly, but it does beat putting a ton of if/else statements everywhere
  var config = p >= 0 ? (process.argv[p + 1]) : './config.json';
  logger.warn('loading config from ' + config);
  //start the DAL, load configuration file
  try {
      configSettings = JSON.parse(fs.readFileSync(config).toString());
      logger.info('Configuration read.');
  } catch (e) {
      configSettings = {};
      logger.error(e.message);
      logger.error('Could not read config file. Loading defaults.');
  }
  //save configuration into global scope so other modules can use.
  global.configuration = configSettings;
}

exports.parseConfigOptions = parseConfigOptions;
exports.readConfigFile = readConfigFile;
