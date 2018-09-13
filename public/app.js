import page from '/lib/page.mjs';
import { Lang } from '/lib/polyglot/language.js';
import { Helpers } from '/helpers.js';
import { IndexApp } from '/web/index-app.js';
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
      page('/:user/:space/:id', this.HandleParsableRequestWithID);
      page('/:user/:space/index.vwf/:id', this.HandleParsableRequestWithID);
      page('/:user/:space/load/:savename', this.HandleParsableLoadRequest);
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

      this.db = Gun(this.dbHost);
      this.user = this.db.user();
      window._LCSDB = this.db;
      window._LCSUSER = this.user;
      window._LCS_SYS_USER = undefined;
      window._LCS_WORLD_USER = undefined;

      _LCSDB.get('lcs/app').get('pub').once(res => {

        if (res) {
          window._LCS_SYS_USER = this.db.user(res);
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
    _LCSUSER.recall({ sessionStorage: 1 });
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
    //var userPub = _LCSUSER.is.pub;

    let proxyObj = {};

    for (var index in filterProxyFiles) {

      let el = filterProxyFiles[index];

      if (el) {
        var url = origin + el;
        var entryName = url.replace(origin + '/defaults/', "").split(".").join("_");
        let proxyFile = await fetch(url, { method: 'get' });
        let responseText = await proxyFile.text();

        if (responseText) {
          let obj = {
            //'owner': userPub,
            'file': responseText
          }
          proxyObj[entryName] = obj;
        }
      }
    }
    console.log(proxyObj);

    Object.keys(proxyObj).forEach(el => {
      _LCSDB.user().get('proxy').get(el).put(proxyObj[el]);
    })

  }

  async loadWorldsDefaults() {

   //load to DB default worlds

    let worldsResponse = await fetch('/world-files', { method: 'get' });
    let worldFiles = await worldsResponse.json();
    let filterworldFiles = worldFiles.filter(el => (el !== null));
    console.log(filterworldFiles);

    let worldsObj = {};

    for (var index in filterworldFiles) {

      let el = filterworldFiles[index];

      if (el) {
        let url = window.location.origin + el;
        var entryName = url.replace(window.location.origin + '/defaults/worlds/', "").split(".").join("_");

        let worldName = entryName.split("/")[0];
        let userPub = _LCSUSER.is.pub;

        let worldFile = await fetch(url, { method: 'get' });
        let worldSource = await worldFile.text();
        if (worldSource) {
          let modified = new Date().valueOf();

          let obj = {
            'file': worldSource,
            'modified': modified

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

    Object.entries(worldsObj).forEach(el => {

      let worldName = el[0];
      let files = el[1];
      Object.entries(files).forEach(file => {

        _LCSDB.user().get('worlds').get(worldName).get(file[0]).put(file[1]);

      })
    })
  }

  async loadEmptyDefaultProto() {

     //empty proto world
     let userPub = _LCSUSER.is.pub;
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

      "index_vwf_html": JSON.stringify ("<!-- DEFAULT HTML -->"),
      "appui_js": JSON.stringify ("//appui in JS"),
      "info_json": JSON.stringify ({
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
      })
    }

    worldsObj['empty'] = {
      'parent': '-',
      'owner': userPub,
      'featured': true,
      'published': true
    }

    Object.keys(emptyWorld).forEach(el=>{
      let modified = new Date().valueOf();
      let obj = {
        'file': emptyWorld[el],
        'modified': modified
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

    _app.initReflectorGUI();

  }

  HandleSetupIndex() {

    window._app.hideProgressBar();
    window._app.hideUIControl();

    let el = document.createElement("div");
    el.setAttribute("id", "admin");
    document.body.appendChild(el);

   
    _LCSDB.on('auth',
      async function (ack) {

        if (_LCSUSER.is) {

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
                  _LCSDB.get('lcs/app').get('pub').put(_LCSUSER.is.pub);
                }
              }
            ]
      
          }
      
          let adminComponents = [];
      

          let defaultPub = await _LCSDB.get('lcs/app').get('pub').once().then();
          if (!defaultPub) {
            adminComponents.push(setPubKey);
          }

          if (_LCSUSER.is.pub == defaultPub) {

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
                    window._app.loadWorldsDefaults();
                  }
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
                  onclick: function (e) {
                    console.log("admin action");
                    window._app.loadProxyDefaults();
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
        if(ack.pub){
          document.querySelector("#profile")._status = "User: " + _LCSUSER.is.alias //+' pub: ' + _LCSUSER.is.pub;
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
        $init: function(){
          this._status = "user is not signed in..."
        },
        $update: function(){
          this.$components = [
            {
                $type: "h1",
                class: "mdc-typography--headline4",
                $text: this._status //"Profile for: " + _LCSUSER.is.alias
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

        if (_LCSUSER.is) {

          if (_LCSUSER.is.alias == user) {

            var worldType = 'worlds';
            var file = fileOriginal;
            if (type == 'state') {
              worldType = 'documents';
              file = _app.helpers.replaceSubStringALL(fileOriginal, "~", '/');
            }

            let worldFile = await _LCSUSER.get(worldType).get(worldName).get(file).once().then();
            if (worldFile) {
              console.log(worldFile.file);

              let el = document.createElement("div");
              el.setAttribute("id", "worldFILE");
              document.body.appendChild(el);


              let aceEditorCell = {

                $type: "div",
                $components: [
                  {
                    class: "aceEditor",
                    id: "aceEditor",
                    //style: "width:1200px; height: 800px",
                    $type: "div",
                    $text: worldFile.file,
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
                    }
                  },
                  {
                    $type: "button",
                    class: "mdc-button mdc-button--raised",
                    $text: "Save",
                    onclick: async function (e) {
                      console.log("save new info");
                      let editor = document.querySelector("#aceEditor").env.editor;
                      let newInfo = editor.getValue();
                      _LCSUSER.get(worldType).get(worldName).get(file).get('file').put(newInfo, res => {
                        if (res) {
                          let modified = new Date().valueOf();
                          _LCSUSER.get(worldType).get(worldName).get(file).get('modified').put(modified);
                        }
                      })
                    }
                  },
                  {
                    $type: "button",
                    class: "mdc-button mdc-button--raised",
                    $text: "Close",
                    onclick: function (e) {
                      console.log("close");
                      if (type == "proto")
                        window.location.pathname = "/" + user + '/worlds/protos'
                      if (type == "state")
                        window.location.pathname = "/" + user + '/worlds/states'
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
      document.querySelector('head').innerHTML += '<link rel="stylesheet" href="/web/index-app.css">';
    }

    if (!document.querySelector('#app')) {
      await _app.indexApp.initApp();
    }

    if (type == 'protos') {
      await _app.indexApp.getWorldsProtosFromUserDB(user);
    } else if (type == 'states') {
      await _app.indexApp.getWorldsFromUserDB(user);
    }

  }

  async HandleIndex() {

    console.log("INDEX");

    window._app.hideProgressBar();
    window._app.hideUIControl();

    _app.indexApp = new IndexApp;
    document.querySelector('head').innerHTML += '<link rel="stylesheet" href="/web/index-app.css">';

    await _app.indexApp.generateFrontPage();
    await _app.indexApp.initApp();
    await _app.indexApp.getAppDetailsFromDB();

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

    await _LCSDB.get('users').get(user).get('pub').once(res => {
      if (res)
        window._LCS_WORLD_USER = _LCSDB.user(res);
    }).then();

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

    app.helpers.Process(pathToParse).then(async function(parsedRequest) {

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

    let userAlias = await _LCS_WORLD_USER.get('alias').once().then();
    let userPub = await _LCSDB.get('users').get(userAlias).get('pub').once().then();

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
    _LCS_SYS_USER.get('proxy').load(res=>{
      if (res) 
      {console.log('proxy loaded');

      _LCSDB.user(userPub).get('worlds').get(loadObj.path.public_path.slice(1)).load(w=>{
        if (w) {
          console.log('world files loaded');
          vwf.ready( vwf.application, loadObj)
        }
      }, {wait: 200});

      

    }
    }, {wait: 200});

    

    return loadObj

  }

  // LookupSaveRevisions takes the public path and the name of a save, and provides
  // an array of all revisions for that save. (If the save does not exist, this will be
  // an empty array).

  async lookupSaveRevisions(public_path, save_name) {
    var result = [];
    var states = [];
    let docName = 'savestate_/' + public_path + '/' + save_name + '_vwf_json';

    let revs = await _LCS_WORLD_USER.get('documents').get(public_path).get(docName).get('revs').once().then();
    if (revs) {
      for (const res of Object.keys(revs)) {
        if (res !== '_') {
          let el = await _LCS_WORLD_USER.get('documents').get(public_path).get(docName).get('revs').get(res).once().then();
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

    let objName = "savestate_" + loadInfo['application_path'] + '/' + loadInfo['save_name'] + '_vwf_json';
    let objNameRev = "savestate_" + loadInfo['save_revision'] + loadInfo['application_path'] + '/' + loadInfo['save_name'] + '_vwf_json';

    // if(loadInfo[ 'save_revision' ]){
    // } 

    let worldName = this.helpers.appPath //loadInfo[ 'application_path' ].slice(1);

    let saveObject = await _LCS_WORLD_USER.get('documents').get(worldName).get(objName).get('revs').get(objNameRev).once().then();
    let saveInfo = saveObject ? JSON.parse(saveObject.jsonState) : saveObject;

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
    let worldFileNames = Object.keys(fileNamesAll).filter(el => (el !== '_') && (el !== 'owner') && (el !== 'parent')
      && (el !== 'info_json'));

    let worldObj = {};
    for (var el in worldFileNames) {
      let fn = worldFileNames[el];
      let res = await _LCSDB.user(userPub).get('worlds').get(worldName).get(fn).once().then();
      var data = {
        'file': res.file,
        'modified': res.modified
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

    let userPub = await _LCSDB.get('users').get(userName).get('pub').once().then();
    //let worldProto = await _LCSDB.user(userPub).get('worlds').get(worldName).once().then();

    var worldID = window._app.helpers.GenerateInstanceID().toString();
    if (newWorldName) {
      worldID = newWorldName
    }

    //let modified = new Date().valueOf();
    console.log('clone: ' + worldName + 'to: ' + worldID);

    let newOwner = _LCSUSER.is.pub;

    let worldObj = {
      'owner': newOwner,
      'parent': userName + '/' + worldName,
      'featured': true,
      'published': true
    };

    let fileNamesAll = await _LCSDB.user(userPub).get('worlds').get(worldName).once().then();
    let worldFileNames = Object.keys(fileNamesAll).filter(el => (el !== '_') && (el !== 'owner') && (el !== 'parent') && (el !== 'featured') && (el !== 'published'));

    for (var el in worldFileNames) {

      let fn = worldFileNames[el];
      let res = await _LCSDB.user(userPub).get('worlds').get(worldName).get(fn).once().then();
      let data = {
        'file': res.file,
        'modified': res.modified
      }
      worldObj[fn] = data;
    }
    console.log(worldObj);

    Object.keys(worldObj).forEach(el => {
      _LCSUSER.get('worlds').get(worldID).get(el).put(worldObj[el]);
    })
  }

  async cloneWorldState(filename) {

    let myWorldProtos = await _LCSUSER.get('worlds').once().then();
    let userName = this.helpers.worldUser;
    let userPub = await _LCSDB.get('users').get(userName).get('pub').once().then();
    let protoUserRoot = this.helpers.getRoot(true).root;
    //let myName = _LCSUSER.is.alias;

    //let proto = Object.keys(myWorldProtos).filter(el => el == protoUserRoot);

    var protosKeys = [];
    if (myWorldProtos)
      protosKeys = Object.keys(myWorldProtos);

    if (protosKeys.includes(protoUserRoot)) {

      let userProtoFiles = await this.getProtoWorldFiles(userPub, protoUserRoot);
      let myProtoFiles = await this.getProtoWorldFiles(_LCSUSER.is.pub, protoUserRoot);

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
  saveStateAsFile(filename, otherProto) // invoke with the view as "this"
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

    //var documents = _LCSUSER.get('documents');

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
    _LCSUSER.get('documents').get(root).get(docName).put(stateForStore, res => {

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

    _LCSUSER.get('worlds').get(root).get('info_json').once(res => {

      if (res) {

        let modified = new Date().valueOf();
        let newOwner = _LCSUSER.is.pub;
        let userName = _LCSUSER.is.alias;

        let obj = {
          'parent': userName + '/' + root,
          'owner': newOwner,
          'file': res.file,
          'modified': modified

        }

        let docInfoName = 'savestate_/' + root + '/' + filename + '_info_vwf_json';

        _LCSUSER.get('documents').get(root).get(docInfoName).not(res => {
          _LCSUSER.get('documents').get(root).get(docInfoName).put(obj);
        });
      }
    });

    var docNameRev = 'savestate_' + saveRevision.toString() + '/' + root + '/' + filename + '_vwf_json';
    _LCSUSER.get('documents').get(root).get(docName).get('revs').get(docNameRev).put(stateForStore)
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
    // let documentSaveConfigState = _LCSUSER.get(configName).put(configStateForStore);
    // //documents.path(root).set(documentSaveConfigState);

    // let configNameRev = 'savestate_' + saveRevision.toString() + '/' + root + '/' + filename + '_config_vwf_json';
    // _LCSUSER.get(configNameRev).put(configStateForStore);
    // _LCSUSER.get(configNameRev).path("revision").put(saveRevision);

    //documentSaveConfigState.path('revs').set(documentSaveStateRevision);


    // Save config file to server
    // var xhrConfig = new XMLHttpRequest();
    // xhrConfig.open("POST", "/" + root + "/save/" + filename, true);
    // xhrConfig.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhrConfig.send("root=" + root + "/" + filename + "&filename=saveState&inst=" + inst + "&timestamp=" + timestamp + "&extension=.vwf.config.json" + "&jsonState=" + jsonConfig);


  }

  // LoadSavedState 

  async loadSavedState(filename, applicationpath, revision) {
    console.log("Loading: " + filename);

    let userName = await _LCS_WORLD_USER.get('alias').once().then();

    if (revision) {
      window.location.pathname = '/' + userName + applicationpath + '/load/' + filename + '/' + revision + '/';
    }
    else { // applicationpath + "/" + inst + '/load/' + filename + '/';
      window.location.pathname = '/' + userName + applicationpath + '/load/' + filename + '/';
    }

  }

  hideUIControl() {

    var el = document.getElementById("ui-controls");
    if (el) {
      el.classList.remove("visible");
      el.classList.add("not-visible");
    }
  }

  showUIControl() {

    var el = document.getElementById("ui-controls");
    if (el) {
      el.classList.remove("not-visible");
      el.classList.add("visible");
    }
  }


  hideProgressBar() {

    var progressbar = document.getElementById("load-progressbar");
    if (progressbar) {
      progressbar.classList.remove("visible");
      progressbar.classList.add("not-visible");
      progressbar.classList.add("mdc-linear-progress--closed");

    }

  }

  showProgressBar() {

    let progressbar = document.getElementById("load-progressbar");
    if (progressbar) {
      progressbar.classList.add("visible");
      progressbar.classList.add("mdc-linear-progress--indeterminate");
    }
  }


  initReflectorGUI() {

    let reflectorGUI =
    {
        $type: "div",
        id: "reflectorGUI",
        //style:"background-color: #efefef",
        class: "mdc-layout-grid mdc-layout-grid--align-left",
        _reflectorHost: null,
        _dbHost: null,
        _refHostField: null,
        _dbHostField: null,
        _initData: function () {
            this._reflectorHost = '';
            this._dbHost = '';

            let config = JSON.parse(localStorage.getItem('lcs_config'));

            if (config.reflector) {
                this._reflectorHost = config.reflector
            }
            if (config.dbhost) {
                this._dbHost =config.dbhost
            }
        },
        $init: function () {
            this._initData();
        },
        $update: function () {

            this.$components = [
                {
                    $type: "div",
                    class: "mdc-layout-grid__inner",
                    $components: [
                        {
                            $type: "div",
                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                            $components: [
                            {
                                $type: "h4",
                                class: "mdc-typography--headline4",
                                $text: "Connection settings"
                            }
                        ]
                        },
                        {
                            $type: "div",
                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                            $components: [
                                {
                                    $type: "span",
                                    class: "mdc-typography--headline5",
                                    $text: "Reflector: "
                                },
                                window._app.widgets.inputTextFieldOutlined({
                                    "id": 'reflectorInput',
                                    "label": "Reflector",
                                    "value": this._reflectorHost,
                                    "type": "text",
                                    "init": function() {
                                                this._refHostField = new mdc.textField.MDCTextField(this);
                                            },
                                    "style": 'width: 400px;'
                                }),
                            ]
                        },
                        {
                            $type: "div",
                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                            $components: [
                                {
                                    $type: "span",
                                    class: "mdc-typography--headline5",
                                    $text: "DB Host: "
                                },
                                window._app.widgets.inputTextFieldOutlined({
                                    "id": 'dbhostInput',
                                    "label": "DB Host",
                                    "value": this._dbHost,
                                    "type": "text",
                                    "init": function() {
                                        this._dbHostField = new mdc.textField.MDCTextField(this);
                                    },
                                    "style": 'width: 400px;'
                                }),
                            ]
                        },
                        {
                            $type: "div",
                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                            $components: [
                                window._app.widgets.buttonRaised(
                                    {
                                        "label": 'Update',
                                        "onclick": function (e) {
                                            e.preventDefault();

                                            let config = JSON.parse(localStorage.getItem('lcs_config'));

                                            config.reflector = this._refHostField.value;
                                            config.dbhost = this._dbHostField.value;

                                            localStorage.setItem('lcs_config', JSON.stringify(config));
                                            window.location.reload(true);
                                        }
                                    }),
                                    {
                                      $type: 'span',
                                      $text: " "
                                    },
                                    {
                                      $type: "button",
                                      class: "mdc-button mdc-button--raised",
                                      $text: "Close",
                                      onclick: function (e) {
                                          window.location.pathname = '/'
                                      }
                                    }
                            ]
                        }

                    ]
                }
            ]
        }

    }

    document.querySelector("#appGUI").$cell({
        id: "appGUI",
        $cell: true,
        $type: "div",
        $components: [reflectorGUI]
    }
    );

}



}

export { App }