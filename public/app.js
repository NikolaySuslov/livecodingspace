/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

import page from '/lib/page.mjs';
import { Lang } from '/lib/polyglot/language.js';
import { Helpers } from '/helpers.js';
import { IndexApp } from '/web/index-app.js';
import { WorldApp } from '/web/world-app.js';
import { Widgets } from '/lib/widgets.js';


class App {
  constructor() {
    console.log("app constructor");
    this.widgets = new Widgets;

    //globals
    window._app = this;
    window._cellWidgets = this.widgets;
    window._LangManager = new Lang;
    window._noty = new Noty;

    _LangManager.setLanguage().then(res => {
      return this.initDB()
    }).then(res => {

      this.helpers = new Helpers;
      this.initUser();

      //client routes
      page('/', this.HandleIndex);
      page('/setup', this.HandleSetupIndex);
      page('/settings', this.HandleSettingsIndex);
      page('/profile', this.HandleUserIndex);
      page('/worlds', this.HandleIndex);
      page('/:user/worlds', this.HandleUserWorlds);
      page('/:user/worlds/:type', this.HandleUserWorldsWithType);
      page('/:user/:type/:name/edit/:file', this.HandleFileEdit);
      page('/:user/:space', this.HandleParsableRequestGenID);
      page('/:user/:space/about', this.HandleWorldAbout);
      page('/:user/:space/:id', this.HandleParsableRequestWithID);
      page('/:user/:space/index.vwf/:id', this.HandleParsableRequestWithID);
      page('/:user/:space/load/:savename', this.HandleParsableLoadRequest);
      page('/:user/:space/load/:savename/about', this.HandleWorldAbout);
      page('/:user/:space/:id/load/:savename', this.HandleParsableRequestWithID);

      page('/:user/:space/load/:savename/:rev', this.HandleParsableLoadRequestWithRev);
      page('/:user/:space/:id/load/:savename/:rev', this.HandleParsableRequestWithID);

      page('*', this.HandleNoPage);

      page();


    })


  }

  initDB() {

    var config = JSON.parse(localStorage.getItem('lcs_config'));
    if (!config) {
      config = {
        'dbhost': 'https://' + window.location.hostname + ':8080/gun', //'http://localhost:8080/gun',
        'reflector': 'https://' + window.location.hostname + ':3002',
        'language': 'en'
      }
      localStorage.setItem('lcs_config', JSON.stringify(config));
    }

    const dbConnection = new Promise((resolve, reject) => {

      const opt = { peers: this.dbHost, localStorage: false, store: null }
      opt.store = RindexedDB(opt);
      this.db = Gun(opt);

      this.user = this.db.user();
      window._LCSDB = this.db;
      window._LCSUSER = this.user;
      window._LCS_SYS_USER = undefined;
      window._LCS_WORLD_USER = undefined;

      _LCSDB.get('lcs/app').load();
      _LCSDB.get('users').load();

      _LCSDB.get('lcs/app').get('pub').once(function(res){

        if (res) {
          window._LCS_SYS_USER = _LCSDB.user(res);
        }
      });

      _LCSDB.on('hi', function (peer) {

        let msg = 'Connected to ' + peer.url;

        let noty = new Noty({
          text: msg,
          timeout: 2000,
          theme: 'mint',
          layout: 'bottomRight',
          type: 'success'
        });
        noty.show();
        console.log(msg)
      })

      _LCSDB.on('bye', function (peer) {

        let msg = 'No connection to ' + peer.url;
        let noty = new Noty({
          text: msg,
          timeout: 1000,
          theme: 'mint',
          layout: 'bottomRight',
          type: 'error'
        });
        noty.show();
        console.log(msg)
      })
      resolve('ok');
    });
    return dbConnection
  }

  initUser() {
    _LCSDB.user().recall({ sessionStorage: 1 });
  }


  get reflectorHost() {

    var res = "";
    let config = localStorage.getItem('lcs_config');
    if (config) {
      res = JSON.parse(config).reflector;
    }
    return res;
  }

  get dbHost() {

    var res = "";
    let config = localStorage.getItem('lcs_config');
    if (config) {
      res = JSON.parse(config).dbhost;
    }
    return res;
  }

  async loadProxyDefaults() {

    //load to DB default proxy files (VWF & A-Frame components)

    let proxyResponse = await fetch('/proxy-files', { method: 'get' });
    let proxyFiles = await proxyResponse.json();
    let filterProxyFiles = proxyFiles.filter(el => (el !== null));
    console.log(filterProxyFiles);

    var origin = window.location.origin;
    //var userPub = this.db.user().is.pub;

    let proxyObj = {};

    for (var index in filterProxyFiles) {

      let doc = filterProxyFiles[index];

      if (doc) {
        var url = origin + doc;
        var entryName = url.replace(origin + '/defaults/', "").split(".").join("_");
        let proxyFile = await fetch(url, { method: 'get' });
        let responseText = await proxyFile.text();

        if (responseText) {

          let created = new Date().valueOf();

          let obj = {
            //'owner': userPub,
            'file': responseText,
            'modified': created,
            'created': created
          }
          proxyObj[entryName] = obj;
        }
      }
    }
    console.log(proxyObj);
    let proxy = _LCSDB.user().get('proxy');
    proxy.put(proxyObj);

    // for (const key of Object.keys(proxyObj)) {
    //   let proxy = _LCSDB.user().get('proxy');
    //   let newDoc = proxy.get(key);
    //   await newDoc.put(proxyObj[key]).then();
    // }

    // Object.keys(proxyObj).forEach(res => {
    //   let proxy = _LCSDB.user().get('proxy');
    //   let newDoc = proxy.get(res);
    //   newDoc.put(proxyObj[res]);
    // })

  }

  async loadWorldsDefaults(replace) {

    //load to DB default worlds

    let worldsResponse = await fetch('/world-files', { method: 'get' });
    let worldFiles = await worldsResponse.json();
    let filterworldFiles = worldFiles.filter(el => (el !== null));
    console.log(filterworldFiles);

    let worldsObj = {};

    for (var index in filterworldFiles) {

      let doc = filterworldFiles[index];

      if (doc) {
        let url = window.location.origin + doc;
        var entryName = url.replace(window.location.origin + '/defaults/worlds/', "").split(".").join("_");

        let worldName = entryName.split("/")[0];
        let userPub = _LCSDB.user().is.pub;

        let worldFile = await fetch(url, { method: 'get' });
        let worldSource = await worldFile.text();
        if (worldSource) {
          //let modified = new Date().valueOf();
          let created = new Date().valueOf();

          let obj = {
            'file': worldSource,
            'modified': created,
            'created': created

          }

          if (!worldsObj[worldName]) {
            worldsObj[worldName] = {
              'parent': '-',
              'owner': userPub,
              'featured': true,
              'published': true
            }
          }

          let entry = entryName.replace(worldName + '/', "");
          worldsObj[worldName][entry] = obj;

        }
      }
    }

    console.log(worldsObj);

    if (replace) {
       //force replace all default worlds
      let worlds = _LCSDB.user().get('worlds');
      worlds.put(worldsObj);

      // Object.entries(worldsObj).forEach(res => {

      //   let worldName = res[0];
      //   let files = res[1];
      //   Object.entries(files).forEach(file => {

      //     _LCSDB.user().get('worlds').get(worldName).get(file[0]).put(file[1]);

      //   })
      // })
    } else {
     
      Object.entries(worldsObj).forEach(res => {

        let worldName = res[0];
        let files = res[1];
        Object.entries(files).forEach(file => {

          _LCSDB.user().get('worlds').get(worldName).get(file[0]).not(function(res){
            _LCSDB.user().get('worlds').get(worldName).get(file[0]).put(file[1]);
          })

        })
      })

    }

  }

  async loadEmptyDefaultProto() {

    //empty proto world
    let userPub = _LCSDB.user().is.pub;
    let worldsObj = {};
    let emptyWorld = {

      "index_vwf_yaml": YAML.stringify(
        {
          "extends": "http://vwf.example.com/aframe/ascene.vwf"
        }, 4),

      "index_vwf_config_yaml": YAML.stringify(
        {
          "info": {
            "title": "Empty World"
          },
          "model": {
            "vwf/model/aframe": null
          },
          "view": {
            "vwf/view/aframe": null,
            "vwf/view/editor-new": null
          }
        }, 4),
      "assets_json": JSON.stringify({}),
      "index_vwf_html": JSON.stringify("<!-- DEFAULT HTML -->"),
      "appui_js": JSON.stringify("//appui in JS"),
      "info_json": JSON.stringify({
        "info": {
          "en": {
            "title": "Empty World",
            "imgUrl": "",
            "text": "Empty World"
          },
          "ru": {
            "title": "Новый Мир",
            "imgUrl": "",
            "text": "Новый Мир"
          }
        }
      }, null, 4)
    }

    worldsObj['empty'] = {
      'parent': '-',
      'owner': userPub,
      'featured': true,
      'published': true
    }

    Object.keys(emptyWorld).forEach(el => {
      //let modified = new Date().valueOf();
      let created = new Date().valueOf();
      let obj = {
        'file': emptyWorld[el],
        'modified': created,
        'created': created
      }
      worldsObj['empty'][el] = obj;
    })

    console.log(worldsObj);

    Object.entries(worldsObj).forEach(el => {

      let worldName = el[0];
      let files = el[1];
      Object.entries(files).forEach(file => {

        _LCSDB.user().get('worlds').get(worldName).get(file[0]).put(file[1]);

      })
    })

  }

  //load defaults for first registered user running ./setup

  HandleSettingsIndex() {

    window._app.hideProgressBar();
    window._app.hideUIControl();

    let el = document.createElement("div");
    el.setAttribute("id", "appGUI");
    document.body.appendChild(el);

    _cellWidgets.reflectorGUI();

  }

  async HandleWorldAbout(ctx) {

    console.log("about world");

    let userAlias = ctx.params.user;
    let worldName = ctx.params.space;
    let saveName = ctx.params.savename;

    window._app.hideProgressBar();
    window._app.hideUIControl();

    if (!_app.indexApp) {
      _app.indexApp = new IndexApp;
      _app.indexApp.initHTML();
      _app.indexApp.initApp();
    }

    let worldApp = new WorldApp(userAlias, worldName, saveName);
    await worldApp.initWorldGUI();

  }

  HandleSetupIndex() {

    window._app.hideProgressBar();
    window._app.hideUIControl();

    let el = document.createElement("div");
    el.setAttribute("id", "admin");
    document.body.appendChild(el);


    _LCSDB.on('auth',
      async function (ack) {

        if (_LCSDB.user().is) {

          let setPubKey = {

            $cell: true,
            $components: [
              {
                $type: "p",
                class: "mdc-typography--headline5",
                $text: "1. Set app system user PUB key"
              },
              {
                $type: "button",
                class: "mdc-button mdc-button--raised",
                $text: "Set app PUB key",
                onclick: function (e) {
                  console.log("admin action");
                  _LCSDB.get('lcs/app').get('pub').put(_LCSDB.user().is.pub);
                }
              }
            ]

          }

          let adminComponents = [];


          let defaultPub = await _LCSDB.get('lcs/app').get('pub').once().then();
          if (!defaultPub) {
            adminComponents.push(setPubKey);
          }

          if (_LCSDB.user().is.pub == defaultPub) {

            let loadEmpty = {
              $cell: true,
              $components: [
                {
                  $type: "p",
                  class: "mdc-typography--headline5",
                  $text: "3. Initialize empty World proto"
                },
                {
                  $type: "button",
                  id: "loadDefaults",
                  class: "mdc-button mdc-button--raised",
                  $text: "Init empty world",
                  onclick: function (e) {
                    console.log("admin action");
                    window._app.loadEmptyDefaultProto();
                  }
                }
              ]
            }


            let loadDefaults = {
              $cell: true,
              _replaceSwitch: null,
              $components: [
                {
                  $type: "p",
                  class: "mdc-typography--headline5",
                  $text: "4. Load Sample Worlds protos from server (optional)"
                },
                {
                  $type: "button",
                  id: "loadDefaults",
                  class: "mdc-button mdc-button--raised",
                  $text: "Load default worlds (from server)",
                  onclick: function (e) {
                    console.log("admin action");
                    let forceReplace = this._replaceSwitch.checked;
                    //console.log(forceReplace);
                    window._app.loadWorldsDefaults(forceReplace);
                  }
                },
                {
                  $type: 'p'
                },
                _cellWidgets.switch({
                  'id': 'forceReplace',
                  'init': function () {
                    this._switch = new mdc.switchControl.MDCSwitch(this);
                    this._replaceSwitch = this._switch;
                    this._switch.checked = false;
                  }
                }
                ),
                {
                  $type: 'label',
                  for: 'input-forceReplace',
                  $text: 'Force replace'
                }

              ]
            }

            let loadDefaultsProxy = {
              $cell: true,
              $components: [
                {
                  $type: "p",
                  class: "mdc-typography--headline5",
                  $text: "3. Load VWF & A-Frame default components"
                },
                {
                  $type: "button",
                  class: "mdc-button mdc-button--raised",
                  $text: "Load defaults Proxy",
                  onclick: async function (e) {
                    console.log("admin action");
                    await window._app.loadProxyDefaults();
                  }
                }
              ]
            }
            adminComponents.push(setPubKey, loadDefaultsProxy, loadEmpty, loadDefaults);
          }

          document.querySelector("#admin").$cell({
            $cell: true,
            id: 'adminComponents',
            $type: "div",
            $components: adminComponents
          });

        }
      })
  }

  //TODO: profile

  HandleUserIndex(ctx) {

    console.log("USER INDEX");
    window._app.hideProgressBar();
    window._app.hideUIControl();

    _LCSDB.on('auth',
      async function (ack) {
        if (ack.sea.pub) {
          document.querySelector("#profile")._status = "User: " + _LCSDB.user().is.alias //+' pub: ' + this.db.user().is.pub;
          document.querySelector("#profile").$update();
        }
      })

    let el = document.createElement("div");
    el.setAttribute("id", "userProfile");
    document.body.appendChild(el);

    let userProfile = {
      $type: 'div',
      id: "profile",
      _status: "",
      $init: function () {
        this._status = "user is not signed in..."
      },
      $update: function () {
        this.$components = [
          {
            $type: "h1",
            class: "mdc-typography--headline4",
            $text: this._status //"Profile for: " + this.db.user().is.alias
          }
        ]
      }
    }

    document.querySelector("#userProfile").$cell({
      $cell: true,
      $type: "div",
      $components: [userProfile]
    })
  }


  async HandleUserWorlds(ctx) {

    console.log("USER WORLDS INDEX");
    console.log(ctx.params);
    let user = ctx.params.user;

    page.redirect('/' + user + '/worlds/protos');

  }

  async HandleFileEdit(ctx) {

    console.log("USER WORLD FILE EDIT");

    let user = ctx.params.user;
    let worldName = ctx.params.name;
    let fileOriginal = ctx.params.file;
    let type = ctx.params.type;

    window._app.hideProgressBar();
    window._app.hideUIControl();


    _LCSDB.on('auth',
      async function (ack) {

        if (_LCSDB.user().is) {

          if (_LCSDB.user().is.alias == user) {

            var worldType = 'worlds';
            var file = fileOriginal;
            if (type == 'state') {
              worldType = 'documents';
              file = _app.helpers.replaceSubStringALL(fileOriginal, "~", '/');
            }

            var worldFile = await _LCSDB.user().get(worldType).get(worldName).get(file).once().then();
            if (worldFile) {
              var source = worldFile.file;
              if (type == 'state') {

                if (!file.includes('_info_vwf_json')){
                source = worldFile.jsonState;
                var saveName = worldFile.filename;
              }
              }
              //console.log(source);

              //var source = (typeof(sourceToEdit) =="object") ? JSON.stringify(sourceToEdit): sourceToEdit;
              if (file.includes('_json')) {
                source = JSON.stringify(source, null, '\t');
              } 


              let el = document.createElement("div");
              el.setAttribute("id", "worldFILE");
              document.body.appendChild(el);

              var saveGUI = {};
              if(type == 'proto' || file.includes('_info_vwf_json')){

                saveGUI =  {
                  $type: "button",
                  class: "mdc-button mdc-button--raised",
                  $text: "Save",
                  onclick: async function (e) {
                    console.log("save new info");
                    let editor = document.querySelector("#aceEditor").env.editor;
                    let newInfo = editor.getValue();
                    _LCSDB.user().get(worldType).get(worldName).get(file).get('file').put(newInfo, function(res) {
                      if (res) {

                        let noty = new Noty({
                          text: 'Saved!',
                          timeout: 2000,
                          theme: 'mint',
                          layout: 'bottomRight',
                          type: 'success'
                        });
                        noty.show();

                        let modified = new Date().valueOf();
                        _LCSDB.user().get(worldType).get(worldName).get(file).get('modified').put(modified);
                      }
                    })
                  }
                }

              }
              if (type == 'state' && !file.includes('_info_vwf_json')) {
                saveGUI =  
                
                {
                  $type: "div",
                  class: "",
                  $components: [
                      {    
                        $type: "button",
                        class: "mdc-button mdc-button--raised",
                        $text: "Replace state",
                        onclick: async function (e) {
                          console.log("fix state");
                          let editor = document.querySelector("#aceEditor").env.editor;
                          let newInfo = editor.getValue();
                          let fixedState = newInfo; //_app.fixSaveState(newInfo, worldName, oldProtoName);

                          let userPub = await _LCSDB.get('users').get(user).get('pub').then();
                          let revs = await _app.lookupSaveRevisions(worldName, saveName, userPub);
                          let lastRevision = revs.sort()[0];

                          var newFile = file.replace('savestate_','savestate_' + lastRevision.toString());
                          
                          _LCSDB.user().get(worldType).get(worldName).get(file).get('revs').get(newFile).get('jsonState').put(fixedState);
                          _LCSDB.user().get(worldType).get(worldName).get(file).get('jsonState').put(fixedState, function(res) {
                            if (res) {
      
                              let noty = new Noty({
                                text: 'Repalced!',
                                timeout: 2000,
                                theme: 'mint',
                                layout: 'bottomRight',
                                type: 'success'
                              });
                              noty.show();
      
                              let modified = new Date().valueOf();
                              _LCSDB.user().get(worldType).get(worldName).get(file).get('modified').put(modified);
                            }
                          })
                        }
      
                      } 
                  ]
              }
                
              }

              let aceEditorCell = {

                $type: "div",
                $components: [
                  {
                    class: "aceEditor",
                    id: "aceEditor",
                    //style: "width:1200px; height: 800px",
                    $type: "div",
                    $text: source,
                    $init: function () {
                      var mode = "ace/mode/json";
                      if (file.includes('_yaml'))
                        mode = "ace/mode/yaml"
                      if (file.includes('_js'))
                        mode = "ace/mode/javascript"

                      var editor = ace.edit("aceEditor");
                      editor.setTheme("ace/theme/monokai");
                      editor.setFontSize(16);
                      editor.getSession().setMode(mode);
                      editor.setOptions({
                        maxLines: Infinity
                      });
                      editor.session.setUseWrapMode(true);
                      
                    }
                  },
                  saveGUI,
                  {
                    $type: "button",
                    class: "mdc-button mdc-button--raised",
                    $text: "Close",
                    onclick: function (e) {
                      console.log("close");
                      window.history.back();
                      // if (type == "proto")
                      //   window.location.pathname = "/" + user + '/' + worldName + '/about'
                      // if (type == "state")
                      //   window.location.pathname = "/" + user + '/' + worldName + '/about'
                    }
                  }
                ]
              }
              document.querySelector("#worldFILE").$cell({
                $cell: true,
                $type: "div",
                $components: [aceEditorCell
                ]
              })
            }
          }
        }
      })
  }

  async HandleUserWorldsWithType(ctx) {

    console.log("USER WORLDS INDEX");
    console.log(ctx.params);
    let user = ctx.params.user;
    let type = ctx.params.type;

    window._app.hideProgressBar();
    window._app.hideUIControl();

    if (!_app.indexApp) {
      _app.indexApp = new IndexApp;
      _app.indexApp.initHTML();
      _app.indexApp.initApp();
    }

    if (type == 'protos') {
      await _app.indexApp.initWorldsProtosListForUser(user)//.getWorldsProtosListForUser(user); 
    } else if (type == 'states') {
      await _app.indexApp.initWorldsStatesListForUser(user);

      //await _app.indexApp.getWorldsFromUserDB(user);
    }

  }

  async HandleIndex() {

    console.log("INDEX");

    window._app.hideProgressBar();
    window._app.hideUIControl();

    if (!_app.indexApp) {
      _app.indexApp = new IndexApp;
      await _app.indexApp.generateFrontPage();
      _app.indexApp.initHTML();
    }

    _app.indexApp.initApp();
    await _app.indexApp.initWorldsProtosListForUser('app');
    //await _app.indexApp.getAppDetailsFromDB();

  }


  HandleNoPage() {

    console.log("no such page")

  }

  //handle parcable requests

  HandleParsableLoadRequest(ctx) {

    let app = window._app;
    console.log(ctx.params);
    //var pathname = ctx.pathname;
    var spaceName = ctx.params.space;
    var saveName = ctx.params.savename;
    let user = ctx.params.user;

    page.redirect('/' + user + '/' + spaceName + '/' + app.helpers.GenerateInstanceID() + '/load/' + saveName);

  }

  HandleParsableLoadRequestWithRev(ctx) {

    let app = window._app;
    console.log(ctx.params);
    //var pathname = ctx.pathname;
    var spaceName = ctx.params.space;
    var saveName = ctx.params.savename;
    var rev = ctx.params.rev;
    let user = ctx.params.user;

    page.redirect('/' + user + '/' + spaceName + '/' + app.helpers.GenerateInstanceID() + '/load/' + saveName + '/' + rev);

  }

  async setUserPaths(user) {

      let users = await _LCSDB.get('users');
     await _LCSDB.get('users').get(user).get('pub').once(function(res) {
      if (res)
        window._LCS_WORLD_USER = {
          alias: user,
          pub: res
        }   
    }).then();


    // await _LCSDB.get('users').get(user).get('pub').once(res => {
    //   if (res)
    //     window._LCS_WORLD_USER = _LCSDB.user(res);
    // }).then();

  }

  async HandleParsableRequestGenID(ctx) {

    let app = window._app;
    console.log(ctx.params);
    let user = ctx.params.user;
    var pathname = ctx.pathname;

    await app.setUserPaths(user);

    if (pathname[pathname.length - 1] == '/') {
      pathname = pathname.slice(0, -1)
    }

    let pathToParse = pathname.replace('/' + user, "");

    app.helpers.Process(pathToParse).then(parsedRequest => {

      localStorage.setItem('lcs_app', JSON.stringify({ path: parsedRequest }));
      console.log(parsedRequest);

      if ((parsedRequest['instance'] == undefined) && (parsedRequest['private_path'] == undefined) && (parsedRequest['public_path'] !== "/") && (parsedRequest['application'] !== undefined)) {

        page.redirect(pathname + '/' + app.helpers.GenerateInstanceID());

      }
    });

  }


  async HandleParsableRequestWithID(ctx) {

    let app = window._app;
    console.log(ctx.params);
    var pathname = ctx.pathname;
    let user = ctx.params.user;

    if (pathname[pathname.length - 1] == '/') {
      pathname = pathname.slice(0, -1)
    }

    await app.setUserPaths(user);

    let pathToParse = pathname.replace('/' + user, "");

    app.helpers.Process(pathToParse).then(async function (parsedRequest) {

      localStorage.setItem('lcs_app', JSON.stringify({ path: parsedRequest }));
      console.log(parsedRequest);

      var userLibraries = { model: {}, view: {} };
      var application;

      await vwf.loadConfiguration(application, userLibraries, compatibilityCheck);
    });
  }

  async HandleParsableRequest(ctx) {

    let app = window._app;
    console.log(ctx.params);
    var pathname = ctx.pathname;

    if (pathname[pathname.length - 1] == '/') {
      pathname = pathname.slice(0, -1)
    }

    var parsedRequest = await app.helpers.Process(pathname);
    localStorage.setItem('lcs_app', JSON.stringify({ path: parsedRequest }));
    console.log(parsedRequest);

    if ((parsedRequest['instance'] == undefined) && (parsedRequest['private_path'] == undefined) && (parsedRequest['public_path'] !== "/") && (parsedRequest['application'] !== undefined)) {

      // Redirect if the url request does not include an application/file && a default 'index.vwf.yaml' exists
      // page.redirect(pathname + '/' + app.helpers.GenerateInstanceID());
      window.location.pathname = pathname + '/' + app.helpers.GenerateInstanceID()

      //return true;
    } else {

      //return false;
    }

    var userLibraries = { model: {}, view: {} };
    var application;

    await vwf.loadConfiguration(application, userLibraries, compatibilityCheck);

  }

  //get DB application state information for reflector (called from VWF)

  async getApplicationState() {

    let dataJson = JSON.parse(localStorage.getItem('lcs_app'));
    if (dataJson) {
      if (!dataJson.path['instance']) return undefined;
    }

    //let userAlias = await _LCS_WORLD_USER.get('alias').once().then();
    // let userPub = await _LCSDB.get('users').get(userAlias).get('pub').once().then();
    let userAlias = _LCS_WORLD_USER.alias;
    let userPub = _LCS_WORLD_USER.pub;

    let loadInfo = await this.getLoadInformation(dataJson);
    let saveInfo = await this.loadSaveObject(loadInfo);
    let loadObj = {
      loadInfo: loadInfo,
      path: dataJson.path,
      saveObject: saveInfo,
      user: userAlias
    }

    //dataJson.app = loadObj;
    localStorage.setItem('lcs_app', JSON.stringify(loadObj));

    console.log(loadObj);

    //temporary solution for syncing DB replicas using Gun.load()
    // _LCS_SYS_USER.get('proxy').load(res=>{
    //   if (res) 
    //   {console.log('proxy loaded');
    //   _LCSDB.user(userPub).get('worlds').get(loadObj.path.public_path.slice(1)).load(w=>{
    //     if (w) {
    //       console.log('world files loaded');
    //       vwf.ready( vwf.application, loadObj)
    //     }
    //   });
    // }
    // });

    return loadObj
  }

  // LookupSaveRevisions takes the public path and the name of a save, and provides
  // an array of all revisions for that save. (If the save does not exist, this will be
  // an empty array).

  async lookupSaveRevisions(public_path, save_name, userPub) {

    var pub = "";

    if(!_LCS_WORLD_USER) {
      pub = userPub;
    } else {
      pub = _LCS_WORLD_USER.pub
    }
  
    let userDB = _LCSDB.user(pub);

    var result = [];
    var states = [];
    let docName = 'savestate_/' + public_path + '/' + save_name + '_vwf_json';

    let revs = await userDB.get('documents').get(public_path).get(docName).get('revs').once().then();
    if (revs) {
      for (const res of Object.keys(revs)) {
        if (res !== '_') {
          let el = await userDB.get('documents').get(public_path).get(docName).get('revs').get(res).once().then();
          if (el)
            result.push(parseInt(el.revision));
        }
      }
      return result
    }
  }

  // GetLoadInformation receives a parsed request {private_path, public_path, instance, application} and returns the
  // details of the save that is designated by the initial request. The details are returned in an object
  // composed of: save_name (name of the save) save_revision (revision of the save), explicit_revision (boolean, true if the request
  // explicitly specified the revision, false if it did not), and application_path (the public_path of the application this is a save for).

  async getLoadInformation(response) {
    let parsedRequest = response.path;
    var result = { 'save_name': undefined, 'save_revision': undefined, 'explicit_revision': undefined, 'application_path': undefined };
    if (parsedRequest['private_path']) {
      var segments = this.helpers.GenerateSegments(parsedRequest['private_path']);
      if ((segments.length > 1) && (segments[0] == "load")) {
        var potentialRevisions = await this.lookupSaveRevisions((parsedRequest['public_path']).slice(1), segments[1]);

        console.log('!!!!! - ', potentialRevisions);
        if (potentialRevisions.length > 0) {
          result['save_name'] = segments[1];

          if (segments.length > 2) {
            var requestedRevision = parseInt(segments[2]);
            if (requestedRevision) {
              if (potentialRevisions.indexOf(requestedRevision) > -1) {
                result['save_revision'] = requestedRevision;
                result['explicit_revision'] = true;
                result['application_path'] = parsedRequest['public_path'];
              }
            }
          }
          if (result['explicit_revision'] == undefined) {
            result['explicit_revision'] = false;
            potentialRevisions.sort();
            result['save_revision'] = potentialRevisions.pop();
            result['application_path'] = parsedRequest['public_path'];
          }
        }
      }

    }
    return result;
  }

  async loadSaveObject(loadInfo) {

    //let objName = loadInfo[ 'save_name' ] +'/'+ "savestate_" + loadInfo[ 'save_revision' ];

    let userDB = _LCSDB.user(_LCS_WORLD_USER.pub);

    if (!loadInfo.save_name) {
      return undefined
    }

    let objName = "savestate_" + loadInfo['application_path'] + '/' + loadInfo['save_name'] + '_vwf_json';
    let objNameRev = "savestate_" + loadInfo['save_revision'] + loadInfo['application_path'] + '/' + loadInfo['save_name'] + '_vwf_json';

    // if(loadInfo[ 'save_revision' ]){
    // } 

    let worldName = this.helpers.appPath //loadInfo[ 'application_path' ].slice(1);

    let saveObject = await userDB.get('documents').get(worldName).get(objName).get('revs').get(objNameRev).then();
    
    var saveInfo = null;
    if(saveObject){
      saveInfo = (typeof(saveObject.jsonState) == 'object') ? saveObject.jsonState: JSON.parse(saveObject.jsonState);
    }
    //typeof(saveObject == 'object')
    

    return saveInfo;

  }

  // GetSaveInformation is a helper function that takes the application_path (/path/to/application).
  // It returns an array of all saves found for that
  // application (including separate entries for individual revisions of saves ).
  async getSaveInformation(application_path, userPUB) {
    var result = [];
    let user = _LCSDB.user(userPUB);

    var docName = application_path.slice(1);
    let potentialSaveNames = await user.get('documents').get(docName).once().then();

    if (potentialSaveNames) {

      for (const res of Object.keys(potentialSaveNames)) {
        if (res !== '_') {

          let el = await user.get('documents').path(docName).get(res).once().then();

          let revisionList = await this.lookupSaveRevisions(application_path.slice(1), el.filename);
          var latestsave = true;
          revisionList.sort();
          while (revisionList.length > 0) {
            var newEntry = {};
            newEntry['applicationpath'] = application_path;
            newEntry['savename'] = el.filename;
            newEntry['revision'] = revisionList.pop().toString();
            newEntry['latestsave'] = latestsave;
            if (latestsave) {
              newEntry['url'] = this.helpers.JoinPath(window.location.origin, application_path, "load", el.filename + "/");
            }
            else {
              newEntry['url'] = this.helpers.JoinPath(window.location.origin, application_path, "load", el.filename + "/", newEntry['revision'] + "/");
            }
            latestsave = false;
            result.push(newEntry);
          }
        }
      }
    }
    return result;
  }

  async getProtoWorldFiles(userPub, worldName, date) {

    let fileNamesAll = await _LCSDB.user(userPub).get('worlds').get(worldName).once().then();
    let worldFileNames = Object.keys(fileNamesAll).filter(el => (el !== '_') && (el !== 'owner') && (el !== 'parent') && (el !== 'featured') && (el !== 'published') && (el !== 'info_json') && (el !== '_config_yaml') && (el !== '_yaml') && (el !== '_html'));

    let worldObj = {};
    for (var doc in worldFileNames) {
      let fn = worldFileNames[doc];
      let res = await _LCSDB.user(userPub).get('worlds').get(worldName).get(fn).once().then();
      var data = {
        'file': res.file,
        'modified': res.modified,
        'created': res.created
      }
      if (!date) {
        data = {
          'file': res.file
        }
      }
      worldObj[fn] = data;
    }
    console.log(worldObj);
    return worldObj
  }

  async cloneWorldPrototype(worldName, userName, newWorldName) {

    _app.showProgressBar();

    let users = await _LCSDB.get('users');
    let userPub = await _LCSDB.get('users').get(userName).get('pub').then();
    let newOwner = _LCSDB.user().is.pub;

    if(newWorldName){

    let worldProto = await _LCSDB.user(newOwner).get('worlds').get(newWorldName).then();
    if(worldProto) {
      console.log('already exist!');
        return
    }
  }

    var worldID = window._app.helpers.GenerateInstanceID().toString();
    if (newWorldName) {
      worldID = newWorldName
    }

    //let modified = new Date().valueOf();
    console.log('clone: ' + worldName + 'to: ' + worldID);

    
    let created = new Date().valueOf();

    let worldObj = {
      'owner': newOwner,
      'parent': userName + '/' + worldName,
      'featured': true,
      'published': true
    };

    let fileNamesAll = await _LCSDB.user(userPub).get('worlds').get(worldName).once().then();
    let worldFileNames = Object.keys(fileNamesAll).filter(el => (el !== '_') && (el !== 'owner') && (el !== 'parent') && (el !== 'featured') && (el !== 'published') && (el !== '_config_yaml') && (el !== '_yaml') && (el !== '_html'));

    for (var doc in worldFileNames) {

      let fn = worldFileNames[doc];
      let res = await _LCSDB.user(userPub).get('worlds').get(worldName).get(fn).once().then();
      let data = {
        'file': res.file,
        'modified': created
      }
      worldObj[fn] = data;
    }
    console.log(worldObj);

    // for (const obj of Object.keys(worldObj)) {
    //   let myWorlds = _LCSDB.user().get('worlds');
    //   let myNewWorld = myWorlds.get(worldID);
    //   myNewWorld.get(obj).put(worldObj[obj]);
    // }

    let myWorlds = _LCSDB.user().get('worlds');
    myWorlds.get(worldID).put(worldObj);

    _app.hideProgressBar();
    console.log('CLONED!!!');

    let appEl = document.createElement("div");
    appEl.setAttribute("id", 'cloneLink');
    let entry = document.querySelector('#worldActionsGUI');
    if (entry) {
      entry.appendChild(appEl);

      document.querySelector("#cloneLink").$cell({
        id: 'cloneLink',
        $cell: true,
        $type: "div",
        $components: [
          {
            $type: "a",
            class: "mdc-button mdc-button--raised mdc-card__action",
            $text: "Go to new cloned World!",
            onclick: function (e) {
              let myName = _LCSDB.user().is.alias;
              window.location.pathname = '/' + myName + '/' + worldID + '/about'
            }
          }
        ]
      })
    }

    //window.location.pathname = '/' + userName + '/' + worldID + '/about'
    //page()

    // Object.keys(worldObj).forEach(el => {
    //   this.db.user().get('worlds').get(worldID).get(el).put(worldObj[el]);
    // })


  }

  async cloneWorldState(filename) {

    let myWorldProtos = await _LCSDB.user().get('worlds').once().then();
    let userName = this.helpers.worldUser;

    let users = await _LCSDB.get('users');

    let userPub = await _LCSDB.get('users').get(userName).get('pub').then();
    let protoUserRoot = this.helpers.getRoot(true).root;
    //let myName = this.db.user().is.alias;

    //let proto = Object.keys(myWorldProtos).filter(el => el == protoUserRoot);

    var protosKeys = [];
    if (myWorldProtos)
      protosKeys = Object.keys(myWorldProtos);

    if (protosKeys.includes(protoUserRoot)) {

      let userProtoFiles = await this.getProtoWorldFiles(userPub, protoUserRoot);
      let myProtoFiles = await this.getProtoWorldFiles(_LCSDB.user().is.pub, protoUserRoot);

      let hashUP = await this.helpers.sha256(JSON.stringify(userProtoFiles));
      let hashMP = await this.helpers.sha256(JSON.stringify(myProtoFiles));

      if (hashUP == hashMP) {
        this.saveStateAsFile(filename);
      } else {

        let noty = new Noty({
          text: 'world prototype is modified.. could not clone world state',
          timeout: 2000,
          theme: 'mint',
          layout: 'bottomRight',
          type: 'error'
        });
        noty.show();
      }
    } else {
      await this.cloneWorldPrototype(protoUserRoot, userName, protoUserRoot);
      this.saveStateAsFile(filename);
    }
  }

  //TODO: refactor and config save
  async saveStateAsFile(filename, otherProto) // invoke with the view as "this"
  {
    console.log("Saving: " + filename);

    //var clients = this.nodes["http://vwf.example.com/clients.vwf"];

    // Save State Information
    var state = vwf.getState();
    state.nodes[0].children = {};

    var timestamp = state["queue"].time;
    timestamp = Math.round(timestamp * 1000);

    var objectIsTypedArray = function (candidate) {
      var typedArrayTypes = [
        Int8Array,
        Uint8Array,
        // Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
      ];

      var isTypedArray = false;

      if (typeof candidate == "object" && candidate != null) {
        typedArrayTypes.forEach(function (typedArrayType) {
          isTypedArray = isTypedArray || candidate instanceof typedArrayType;
        });
      }

      return isTypedArray;
    };

    var transitTransformation = function (object) {
      return objectIsTypedArray(object) ?
        Array.prototype.slice.call(object) : object;
    };


    let jsonValuePure = require("vwf/utility").transform(
      state, transitTransformation
    );

    //remove all Ohm generated grammarsfrom state

    let jsonValue = _app.helpers.removeGrammarObj(jsonValuePure);
    var jsonState = JSON.stringify(jsonValue);

    let rootPath = this.helpers.getRoot(true);

    var inst = rootPath.inst;
    if (filename == '') filename = inst;
    //if (root.indexOf('.vwf') != -1) root = root.substring(0, root.lastIndexOf('/'));
    var root = rootPath.root;

    var json = jsonState;

    if (otherProto) {

      console.log('need to modify state...');
      json = this.helpers.replaceSubStringALL(jsonState, '/' + root + '/', '/' + otherProto + '/');//jsonState.replace(('/' + root + '/'), ('/' + otherProto +'/') );
      root = otherProto;
      console.log(json);
    }

    //var documents = this.db.user().get('documents');

    var saveRevision = new Date().valueOf();

    var stateForStore = {
      "root": root,
      "filename": filename,
      "inst": inst,
      "timestamp": timestamp,
      "extension": ".vwf.json",
      "jsonState": json,
      "publish": true
    };

    //let objName = loadInfo[ 'save_name' ] +'/'+ "savestate_" + loadInfo[ 'save_revision' ];
    // "savestate_" + loadInfo[ 'save_revision' ] + '/' + loadInfo[ 'save_name' ] + '_vwf_json'

    var docName = 'savestate_/' + root + '/' + filename + '_vwf_json';
    _LCSDB.user().get('documents').get(root).get(docName).put(stateForStore, function(res) {

      if (res) {

        let noty = new Noty({
          text: 'Saved to ' + docName,
          timeout: 2000,
          theme: 'mint',
          layout: 'bottomRight',
          type: 'success'
        });
        noty.show();
      }
    });

   // let docInfo  =  await _LCSDB.user().get('worlds').get(root).get('info_json').get('file').then();
    _LCSDB.user().get('worlds').get(root).get('info_json').get('file').once(function(file) {

      if (file) {

        let modified = saveRevision;
        let newOwner = _LCSDB.user().is.pub;
        let userName = _LCSDB.user().is.alias;

        let obj = {
          'parent': userName + '/' + root,
          'owner': newOwner,
          'file': JSON.stringify(file),
          //'modified': modified,
          'created': modified

        }

        let docInfoName = 'savestate_/' + root + '/' + filename + '_info_vwf_json';

        _LCSDB.user().get('documents').get(root).get(docInfoName).not(function(res) {
          _LCSDB.user().get('documents').get(root).get(docInfoName).put(obj);
        });

        _LCSDB.user().get('documents').get(root).get(docInfoName).get('created').not(function(res) {
          _LCSDB.user().get('documents').get(root).get(docInfoName).get('created').put(modified);
        });

        _LCSDB.user().get('documents').get(root).get(docInfoName).get('modified').put(modified);

      }
    }, {wait: 200});

    var docNameRev = 'savestate_' + saveRevision.toString() + '/' + root + '/' + filename + '_vwf_json';
    _LCSDB.user().get('documents').get(root).get(docName).get('revs').get(docNameRev).put(stateForStore)
      .path("revision").put(saveRevision);


    // Save Config Information
    var config = { "info": {}, "model": {}, "view": {} };

    // Save browser title
    config["info"]["title"] = document.title//$('title').html();

    // Save model drivers
    Object.keys(vwf_view.kernel.kernel.models).forEach(function (modelDriver) {
      if (modelDriver.indexOf('vwf/model/') != -1) config["model"][modelDriver] = "";
    });

    // If neither glge or threejs model drivers are defined, specify nodriver
    if (config["model"]["vwf/model/glge"] === undefined && config["model"]["vwf/model/threejs"] === undefined) config["model"]["nodriver"] = "";

    // Save view drivers and associated parameters, if any
    Object.keys(vwf_view.kernel.kernel.views).forEach(function (viewDriver) {
      if (viewDriver.indexOf('vwf/view/') != -1) {
        if (vwf_view.kernel.kernel.views[viewDriver].parameters) {
          config["view"][viewDriver] = vwf_view.kernel.kernel.views[viewDriver].parameters;
        }
        else config["view"][viewDriver] = "";
      }
    });

    //var jsonConfig = $.encoder.encodeForURL(JSON.stringify(config));
    var jsonConfig = JSON.stringify(config);



    let configStateForStore = {
      "root": root,
      "filename": filename,
      "inst": inst,
      "timestamp": timestamp,
      "extension": "config.vwf.json",
      "jsonState": jsonConfig
    };

    //let objName = loadInfo[ 'save_name' ] +'/'+ "savestate_" + loadInfo[ 'save_revision' ];
    // "savestate_" + loadInfo[ 'save_revision' ] + '/' + loadInfo[ 'save_name' ] + '_vwf_json'

    // let configName = 'savestate_/' + root + '/' + filename + '_config_vwf_json';
    // let documentSaveConfigState = this.db.user().get(configName).put(configStateForStore);
    // //documents.path(root).set(documentSaveConfigState);

    // let configNameRev = 'savestate_' + saveRevision.toString() + '/' + root + '/' + filename + '_config_vwf_json';
    // this.db.user().get(configNameRev).put(configStateForStore);
    // this.db.user().get(configNameRev).path("revision").put(saveRevision);

    //documentSaveConfigState.path('revs').set(documentSaveStateRevision);


    // Save config file to server
    // var xhrConfig = new XMLHttpRequest();
    // xhrConfig.open("POST", "/" + root + "/save/" + filename, true);
    // xhrConfig.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhrConfig.send("root=" + root + "/" + filename + "&filename=saveState&inst=" + inst + "&timestamp=" + timestamp + "&extension=.vwf.config.json" + "&jsonState=" + jsonConfig);


  }

  fixSaveState(jsonState, otherProto, oldProtoName) {

      console.log('fix proto in state...');
      let json = this.helpers.replaceSubStringALL(jsonState, '/' + oldProtoName + '/', '/' + otherProto + '/');//jsonState.replace(('/' + root + '/'), ('/' + otherProto +'/') );
      console.log(json);

      return json
  }

  // LoadSavedState 

  async loadSavedState(filename, applicationpath, revision) {
    console.log("Loading: " + filename);

    let userDB = _LCSDB.user(_LCS_WORLD_USER.pub);

    let userName = await userDB.get('alias').once().then();

    if (revision) {
      window.location.pathname = '/' + userName + applicationpath + '/load/' + filename + '/' + revision + '/';
    }
    else { // applicationpath + "/" + inst + '/load/' + filename + '/';
      window.location.pathname = '/' + userName + applicationpath + '/load/' + filename + '/';
    }

  }

  hideUIControl() {

    let el = document.getElementById("ui-controls");
    if (el) {
      el.classList.remove("visible");
      el.classList.add("not-visible");
    }
  }

  showUIControl() {

    let el = document.getElementById("ui-controls");
    if (el) {
      el.classList.remove("not-visible");
      el.classList.add("visible");
    }
  }


  hideProgressBar() {

    var progressbar = document.getElementById("load-progressbar");
    if (progressbar) {
      progressbar.classList.remove("visible");
      progressbar.classList.remove("mdc-linear-progress--indeterminate");

      progressbar.classList.add("not-visible");
      progressbar.classList.add("mdc-linear-progress--closed");

    }

  }

  showProgressBar() {

    let progressbar = document.getElementById("load-progressbar");
    if (progressbar) {
      progressbar.classList.remove("not-visible");
      progressbar.classList.remove("mdc-linear-progress--closed");

      progressbar.classList.add("visible");
      progressbar.classList.add("mdc-linear-progress--indeterminate");
    }
  }

  // SUPPORT of DELETE USER WORLDS & SAVE STATES (experimental)
  // TODO: manual garbage collection

  async deleteWorldState(worldName, indexState) {

    let revs = await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').once().then();
    if (revs) {
      for (const el of Object.keys(revs)) {
        if (el !== '_') {
          let doc = await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').get(el).once().then();
          for (const rev of Object.keys(doc)) {
            if (rev !== '_') {
              await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').get(el).get(rev).put(null).then();
            }
          }
          await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').get(el).put(null).then();
        }
      }
    }

    // clear all state params
    let stateDoc = await _LCSDB.user().get('documents').get(worldName).get(indexState).once().then();
    for (const state of Object.keys(stateDoc)) {
      if (state !== '_' && state !== 'revs') {
        await _LCSDB.user().get('documents').get(worldName).get(indexState).get(state).put(null).then();
      }
    }

    await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').put(null).then();
    await _LCSDB.user().get('documents').get(worldName).get(indexState).put(null).then();

  }

  async deleteWorld(name, type) {

    if (type == 'proto') {

      let worldName = name;
      //TODO check for states (ask for deleting all states first...)
      //delete states

      let documents = await _LCSDB.user().get('documents').once().then();
      if (documents) {
        let states = await _LCSDB.user().get('documents').get(worldName).once().then();
        if (states) {
          for (const st of Object.keys(states)) {
            if (st !== '_') {
              if (states[st]) {
                await this.deleteWorldState(worldName, st);
              }

            }
          }
        }
      }

      let worldFiles = await _LCSDB.user().get('worlds').get(worldName).once().then();
      if (worldFiles) {
        for (const el of Object.keys(worldFiles)) {
          if (el !== '_') {
            let doc = await _LCSDB.user().get('worlds').get(worldName).get(el).once().then();
            if (doc) {
              if (doc.file) {
                for (const fEl of Object.keys(doc)) {
                  if (fEl !== '_') {
                    await _LCSDB.user().get('worlds').get(worldName).get(el).get(fEl).put(null).then();
                  }
                }
                await _LCSDB.user().get('worlds').get(worldName).get(el).put(null).then();
              } else {
                await _LCSDB.user().get('worlds').get(worldName).get(el).put(null).then()
              }
            }
          }
        }
      }

      //  this.db.user().get('worlds').get(worldName).map((res, index) => {

      //       if(typeof res == 'object'){
      //         this.db.user().get('worlds').get(worldName).get(index)
      //         .get('file').put("null")
      //         .back(1)
      //         .get('modified').put("null")
      //         .back(1)
      //         .get('created').put("null")
      //         .back(1).put("null")
      //       } else {
      //         this.db.user().get('worlds').get(worldName).get(index).put("null")
      //       }
      //  })

      await _LCSDB.user().get('worlds').get(worldName).put(null).then();

    } else if (type == 'state') {

      let worldName = name.split('/')[0];
      let stateName = name.split('/')[2];

      let stateEntryInfo = 'savestate_/' + worldName + '/' + stateName + '_info_vwf_json';
      let stateEntry = 'savestate_/' + worldName + '/' + stateName + '_vwf_json';
      await this.deleteWorldState(worldName, stateEntryInfo);
      await this.deleteWorldState(worldName, stateEntry);
    }

    let noty = new Noty({
      text: "World Deleted!",
      timeout: 2000,
      theme: 'mint',
      layout: 'bottomRight',
      type: 'success'
    });
    noty.show();

  }


  parseAppInstancesData(data) {

    let jsonObj = JSON.parse(data);
    var parsed = {};
    let listData = {};

    for (var prop in jsonObj) {
      var name = prop.split('/')[1];
      if (parsed[name]) {
        parsed[name][prop] = jsonObj[prop];
      } else {
        parsed[name] = {};
        parsed[name][prop] = jsonObj[prop];
      }

    }
    //console.log(parsed);
    for (var prop in parsed) {
      var name = prop;
      let obj = Object.entries(parsed[prop]);
      var lists = {};
      obj.forEach(el => {
        if (el[1].loadInfo['save_name']) {
          let saveName = prop + '/load/' + el[1].loadInfo.save_name;
          if (!lists[saveName])
            lists[saveName] = {};
          lists[saveName][el[0]] = el[1]
        } else {
          if (!lists[name])
            lists[name] = {};
          lists[name][el[0]] = el[1]
        }
      });

      // console.log(lists);

      Object.entries(lists).forEach(list => {
        listData[list[0]] = list[1];
      })
    }

    return listData
    // console.log(data)
  }

  async getAllStateWorldsInfoForUser(userAlias, cb) {

    let users = await _LCSDB.get('users');

    let userPub = await _LCSDB.get('users').get(userAlias).get('pub').then();

    var db = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == userAlias)
        db = _LCSDB.user();
    }


   // db.get('worlds').once().map().once((val, index)=>{

      //db.get('documents').get(index).once().map().load((res, datI)=>{

    let myWorlds = await db.get('documents').once().then();

    if (myWorlds) {

    Object.keys(myWorlds).filter(el => el!=='_').forEach(w=>{

      db.get('documents').get(w).map(function(res, datI){
        var doc = {};

         if (datI.includes('_info_vwf_json')){

          if (res && res !== 'null') {

            if (res.file && res.file !== 'null') {
  
              let saveName = datI.split('/')[2].replace('_info_vwf_json', "");

             // let worldDesc = JSON.parse(res.file);
             var worldDesc = {};
             if(typeof(res.file) == 'object'){
               worldDesc = res.file
             } else {
               worldDesc = JSON.parse(res.file)
             }


              let root = Object.keys(worldDesc)[0];
              var appInfo = worldDesc[root]['en'];
  
              let langID = localStorage.getItem('krestianstvo_locale');
              if (langID) {
                appInfo = worldDesc[root][langID]
              }
  
              doc = {
                'worldName': w + '/load/' + saveName,
                'created': res.created ? res.created : res.modified,
                'modified': res.modified,
                'type': 'saveState',
                'userAlias': userAlias,
                'info': appInfo
              }
            }
          }
         }

         if (Object.keys(doc).length !== 0)
            cb({[doc.worldName]: doc})
      })


    })
  
  }
    //})
  }


  async getAllStateWorldsInfoForUserPromise(userAlias) {

    let users = await _LCSDB.get('users');
    let userPub = await _LCSDB.get('users').get(userAlias).get('pub').then();

    var db = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == userAlias)
        db = _LCSDB.user();
    }

    var states = {};

    let worldDocs = await db.get('worlds').once().then();
    if (worldDocs) {
      let protos = Object.keys(worldDocs).filter(el => el !== '_');

      if (protos) {
        for (const el of protos) {
          let info = await this.getSaveStates(userAlias, el);
          if (Object.keys(info).length !== 0)
            states[el] = info;
        }
      }
    }

    return states

  }


  async getAllProtoWorldsInfoForUser (userAlias, cb){

    let users = await _LCSDB.get('users');
    let userPub = await _LCSDB.get('users').get(userAlias).get('pub').then();

    var db = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == userAlias)
        db = _LCSDB.user();
    }

    db.get('worlds').map(function(val, index){
     db.get('worlds').get(index).get('info_json').load(function(res){
        
       var doc = {};

        if (res && res !== 'null') {

          if (res.file && res.file !== 'null') {

            //let worldDesc = JSON.parse(res.file);

            var worldDesc = {};
            if(typeof(res.file) == 'object'){
              worldDesc = res.file
            } else {
              worldDesc = JSON.parse(res.file)
            }

            let root = Object.keys(worldDesc)[0];
            var appInfo = worldDesc[root]['en'];

            let langID = localStorage.getItem('krestianstvo_locale');
            if (langID) {
              appInfo = worldDesc[root][langID]
            }

           doc = {
              'worldName': index,
              'created': res.created ? res.created : res.modified,
              'modified': res.modified,
              'type': 'proto',
              'userAlias': userAlias,
              'info': appInfo
            }
          }
        }

        if (Object.keys(doc).length !== 0)
            cb({[index]: doc})
      })
    })

  }

  async getAllProtoWorldsInfoForUserPromise(userAlias) {

    let users = await _LCSDB.get('users');
    let userPub = await _LCSDB.get('users').get(userAlias).get('pub').then();

    var db = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == userAlias)
        db = _LCSDB.user();
    }

    var worlds = {};

    let worldDocs = await db.get('worlds').once().then();
    if (worldDocs) {
      let protos = Object.keys(worldDocs).filter(el => el !== '_');

      if (protos) {
        for (const el of protos) {
          let info = await this.getWorldInfo(userAlias, el);
          if (Object.keys(info).length !== 0)
            worlds[el] = info;
        }
      }
    }

    return worlds
  }

  async getSaveStates(userInfo, worldName) {

    //let userPub = await _LCSDB.get('users').get(userAlias).get('pub').once().then();

    let userPub = userInfo.pub;
    let userAlias =  userInfo.user;

    var db = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == userAlias)
        db = _LCSDB.user();
    }

    var states = {};

    let documents = await db.get('documents').then();
    if(documents) {
    let docs = await db.get('documents').get(worldName).then();
    if (docs) {
      let saves = Object.keys(docs).filter(el => el.includes('_info_vwf_json'));
      if (saves) {
        for (const el of saves) {
          let stateName = el.split('/')[2].replace('_info_vwf_json', "");
          let info = await this.getStateInfo(userInfo, worldName, stateName);
          if (Object.keys(info).length !== 0){
            if(info.info)
                states[stateName] = info;
          }
           
        }
      }
    }
  }
    return states
  }

  async getStateInfo(userInfo, space, saveName) {


    //let userPub = await _LCSDB.get('users').get(user).get('pub').once().then();

    let userPub = userInfo.pub;
    let user =  userInfo.user;

    var db = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == user)
        db = _LCSDB.user();
    }

    var info = {};
    let worlds = await db.get('documents').then();
    let docName = 'savestate_/' + space + '/' + saveName + '_info_vwf_json';
    let world = await db.get('documents').get(space).get(docName).then();
    if (world) {
      let res = world;//await db.get('documents').get(space).get(docName).then();

        if (res && res !== 'null') {

          if (res.file && res.file !== 'null') {

           // let worldDesc = JSON.parse(res.file);

           var worldDesc = {};
           if(typeof(res.file) == 'object'){
             worldDesc = res.file
           } else {
             worldDesc = JSON.parse(res.file)
           }

            let root = Object.keys(worldDesc)[0];
            var appInfo = worldDesc[root]['en'];

            let langID = localStorage.getItem('krestianstvo_locale');
            if (langID) {
              appInfo = worldDesc[root][langID]
            }

            info = {
              'worldName': space + '/load/' + saveName,
              'created': res.created ? res.created : res.modified,
              'modified': res.modified,
              'type': 'saveState',
              'userAlias': user,
              'info': appInfo
            }
          }
        }
    
    }
    
    return info
  }


  async getWorldInfo(userInfo, space) {
    //get space for userA

    let userPub = userInfo.pub;//await _LCSDB.get('users').get(user).get('pub').then();
    let user =  userInfo.user;

    var userdb = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == user)
      userdb = _LCSDB.user();
    }

    var info = {};

    let worlds = await userdb.get('worlds').then();
    let world = await userdb.get('worlds').get(space).then();
    if (world) {
      let res = await userdb.get('worlds').get(space).get('info_json').then();

        if (res && res !== 'null') {

          if (res.file && res.file !== 'null') {

            var worldDesc = {};
            if(typeof(res.file) == 'object'){
              worldDesc = res.file
            } else {
              worldDesc = JSON.parse(res.file)
            }

            //let worldDesc = JSON.parse(res.file);
            let root = Object.keys(worldDesc)[0];
            var appInfo = worldDesc[root]['en'];
            let settings = worldDesc[root].settings;

            let langID = localStorage.getItem('krestianstvo_locale');
            if (langID) {
              appInfo = worldDesc[root][langID]
            }

            info = {
              'worldName': space,
              'created': res.created ? res.created : res.modified,
              'modified': res.modified,
              'type': 'proto',
              'userAlias': user,
              'info': appInfo,
              'settings': settings
            }

          }
        }
      
    }

    return info

  }


}

export { App }