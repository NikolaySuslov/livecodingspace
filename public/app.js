/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

import page from '/lib/page.mjs';
//import { Lang } from '/lib/polyglot/language.js';
//import { IndexApp } from '/web/index-app.js';
//import { Query } from '/lib/utils/query.js';
import { log } from '/lib/utils/log.js';
import { Helpers } from '/helpers.js';
import { WorldApp } from '/web/world-app.js';
import { Widgets } from '/lib/widgets.js';
import { ReflectorClient } from './reflector-client.js';
import { Luminary } from '/luminary.js';



class App {
  constructor() {
    console.log("app constructor");
    this.widgets = new Widgets;
    //globals
    window._app = this;
    window._cellWidgets = this.widgets;
    // window._LangManager = new Lang;
    window._noty = new Noty;
    this.helpers = new Helpers;
    //window._q = this.q = Query;
    this.log = log;
    this.hashids = new Hashids.default();

    //new Promise(res=> {this.clearLocalStorage(); return res()}).then(res=>{

    this.clearLocalStorage();

    this.luminary = new Luminary;
    this.reflectorClient = new ReflectorClient;
    this.config = {};

    this.initDB()
    new Promise(res=> {this.initUser(); res});
    

    import('/lib/polyglot/language.js').then(res => {
      window._LangManager = new res.default;
      _LangManager.setLanguage();
    }).then(res => {
      return import('/web/index-app.js');
    }).then(res => {
      window.IndexApp = res.default;
      this.setPageRoutes();
    });

    //});


  }

  setPageRoutes() {
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
  }

  initDB() {

    var config = JSON.parse(localStorage.getItem('lcs_config'));
    if (!config) {
      config = {
        'luminary': false,
        'luminaryPath': 'luminary',
        'luminaryGlobalHBPath': 'server/heartbeat',
        'luminaryGlobalHB': false,
        'dbhost': window.location.origin + '/gun', // 'https://' + window.location.hostname + ':8080/gun', //'http://localhost:8080/gun',
        'reflector': 'https://' + window.location.hostname + ':3002',
        'webrtc': false,
        'language': 'en'
      }
      localStorage.setItem('lcs_config', JSON.stringify(config));
    }

    if (!config.luminaryPath) {
      config.luminaryPath = 'luminary';
      localStorage.setItem('lcs_config', JSON.stringify(config));
    }

    if (!config.luminaryGlobalHBPath) {
      config.luminaryGlobalHBPath = 'server/heartbeat';
      localStorage.setItem('lcs_config', JSON.stringify(config));
    }

    if (!config.luminaryGlobalHB) {
      config.luminaryGlobalHB = false;
      localStorage.setItem('lcs_config', JSON.stringify(config));
    }

    if (!config.webrtc) {
      config.webrtc = false;
      localStorage.setItem('lcs_config', JSON.stringify(config));
    }

    this.config = config;

    let webrtcConnection = this.config.webrtc;

    const opt = { peers: this.dbHost, localStorage: true, RTCPeerConnection: webrtcConnection, axe: false } //localStorage: false,
    //const opt = { peers: this.dbHost, localStorage: false, until: 1000, chunk: 5, axe: false} //until: 5000, chunk: 5
    //opt.store = RindexedDB(opt);
    this.db = Gun(opt);

    this.user = this.db.user();
    window._LCSDB = this.db;
    window._LCSUSER = this.user;
    //window._LCS_SYS_USER = undefined;
    window._LCS_WORLD_USER = undefined;

    // _LCSDB.get('lcs/app').load();
    // _LCSDB.get('users').load();

    // _q(_LCSDB).get('lcs/app').get('pub').data().then(function (res) {

    //   if (res) {
    //     window._LCS_SYS_USER = _LCSDB.user(res);
    //   }
    // });

    // _LCSDB.get('lcs/app').get('pub').once(function (res) {

    //   if (res) {
    //     window._LCS_SYS_USER = _LCSDB.user(res);
    //   }
    // });

    _LCSDB.on('hi', function (peer) {

      let msg = peer.url ? 'Connected to DB at: ' + peer.url : 'Peer added!';

      let noty = new Noty({
        text: msg,
        timeout: 1000,
        theme: 'mint',
        layout: 'bottomRight',
        type: 'success'
      });

      if (peer.url) {
        noty.show();
      }

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

  }

  clearLocalStorage() {
    let config = localStorage.getItem('lcs_config');
    let langConfig = localStorage.getItem('krestianstvo_locale');
    let manualConfig = localStorage.getItem('lcs_app_manual_settings');

    localStorage.clear();

    if (config)
      localStorage.setItem('lcs_config', config);
    
    if (langConfig)
      localStorage.setItem('krestianstvo_locale', langConfig);

    if (manualConfig)
      localStorage.setItem('lcs_app_manual_settings', manualConfig);

  }

  initUser() {

    function recall() {
      _LCSDB.user().recall({ sessionStorage: 1 })
    }

    setTimeout(
      recall, 1000)

  }


  async chooseConnection(data) {
    if (this.isLuminary) {
      return await _app.luminary.connect(data) //use Luminary
    } else {
      return data //use Reflector
    }
  }

  get isLuminary() {

    return this.config.luminary;

  }

  get isLuminaryGlobalHB() {

    return this.config.luminaryGlobalHB;

  }

  get isWebRTC() {

    return this.config.webrtc;

  }

  get luminaryGlobalHBPath() {

    var res = "";
    let config = localStorage.getItem('lcs_config');
    if (config) {
      res = JSON.parse(config).luminaryGlobalHBPath;
    }
    return res;
  }

  get luminaryPath() {

    var res = "";
    let config = localStorage.getItem('lcs_config');
    if (config) {
      res = JSON.parse(config).luminaryPath;
    }
    return res;
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

          // let obj = {
          //   //'owner': userPub,
          //   'file': responseText,
          //   'modified': created,
          //   'created': created
          // }
          proxyObj[entryName] = responseText;
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

          // let obj = {
          //   'file': worldSource,
          //   'modified': created,
          //   'created': created

          // }

          if (!worldsObj[worldName]) {
            worldsObj[worldName] = {
              'parent': '-',
              'owner': userPub,
              'featured': true,
              'published': true,
              'proxy': userPub,
              'created': created,
              'modified': created
            }
          }

          let entry = entryName.replace(worldName + '/', "");
          worldsObj[worldName][entry] = worldSource

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

          _LCSDB.user().get('worlds').get(worldName).get(file[0]).not(function (res) {
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
      // let obj = {
      //   'file': emptyWorld[el],
      //   'modified': created,
      //   'created': created
      // }
      worldsObj['empty'][el] = emptyWorld[el];
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

  HandleWorldAbout(ctx) {

    console.log("about world");

    let userAlias = ctx.params.user;
    let worldName = ctx.params.space;
    let saveName = ctx.params.savename;

    window._app.hideProgressBar();
    window._app.hideUIControl();

    if (!_app.indexApp) {
      _app.indexApp = new IndexApp;
      //_app.indexApp.initHTML()
      //_app.indexApp.initApp();
    }

    let worldApp = new WorldApp(userAlias, worldName, saveName);
    
       _app.helpers.getUserPub(userAlias).then(res=>{
          worldApp.makeGUI(res)
       })

  }

  HandleSetupIndex() {

    window._app.hideProgressBar();
    window._app.hideUIControl();




    _LCSDB.on('auth',
      function (ack) {

        let el = document.createElement("div");
        el.setAttribute("id", "admin");
        document.body.appendChild(el);

        if (_LCSDB.user().is) {

          let adminComponents = [];

          document.querySelector("#admin").$cell({
            $cell: true,
            id: 'admin',
            $type: "div",
            $components: adminComponents,
            $update: function () {
              this.$components = adminComponents
            }
          });

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




          let defaultPub = _LCSDB.get('lcs/app').get('pub').once(res => {
            if (!res) {
              adminComponents.push(setPubKey);
              document.querySelector("#admin").$update();
            }



            if (_LCSDB.user().is.pub == res) {

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
                    $text: "2. Load VWF & A-Frame default components"
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
              document.querySelector("#admin").$update();
            }

          })

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
          document.querySelector("#profile")._refresh("User alias: " + _LCSDB.user().is.alias); //+' pub: ' + this.db.user().is.pub;
          //document.querySelector("#profile").$update();
        }
      })

    let el = document.createElement("div");
    el.setAttribute("id", "userProfile");
    document.body.appendChild(el);

    let dragDropWorldsArea = {
      $cell: true,
      $type: 'div',
      id: "ddWorlds",
      class: 'dragdropArea',
      _ddText: '',
      _refresh: function (aText) {
        this._ddText = aText;

      },
      $init: function () {
        console.log('init d&d area for worlds protos');
        this._refresh('Drag & Drop a folder with world files here...');
        let self = this;
        DragDrop("#ddWorlds",
        {
          onDrop: function (files, pos, fileList, directories) {
            console.log('onDrop: ' + files.length + ' files at ' + pos.x + ', ' + pos.y);
            //let worldsObj = {};
            let worlds = _LCSDB.user().get('worlds');

            files.forEach(function (file) {
              let world = {};

              if ((file.name.indexOf('.yaml') !== -1) ||
                (file.type == "text/javascript") || 
                (file.type == "text/html") || 
                (file.type == "application/json")) {

              console.log('- ' + file.name + ' (' + file.size + ') (' + file.type + ')');

              // convert the file to a Buffer that we can use!
              const reader = new FileReader()
              reader.addEventListener('load', e => {
                // e.target.result is an ArrayBuffer
                const arr = new Uint8Array(e.target.result)
                const fileBuffer = new buffer.Buffer(arr);
                const fileSource = fileBuffer.toString();
                // do something with the buffer!

                  var entryName = file.fullPath.slice(1).split(".").join("_");
                  let worldName = entryName.split("/")[0];
                  let userPub = _LCSDB.user().is.pub;
          
                    //let modified = new Date().valueOf();
                    let created = new Date().valueOf();
          
                    // let obj = {
                    //   'file': fileSource,
                    //   'modified': created,
                    //   'created': created
          
                    // }

                      world[worldName] = {
                        'parent': '-',
                        'owner': userPub,
                        'featured': true,
                        'published': true,
                        'proxy': userPub,
                        'created': created,
                        'modified': created
                      }
                    
          
                    let entry = entryName.replace(worldName + '/', "");
                    world[worldName][entry] = fileSource;
                    console.log(world);

                    worlds.put(world);
                  
              })
              reader.addEventListener('error', err => {
                console.error('FileReader error' + err)
              })
              reader.readAsArrayBuffer(file)

            }

            })
            //console.log('Worlds', worldsObj);
            console.log('files array', files)
            console.log('FileList object', fileList)
            console.log('directories array', directories)
            self._refresh(directories.map(el=>{return el.name}).toString());
          },
          onDropText: function (text, pos) {
            console.log('onDropText: ' + text + ' at ' + pos.x + ', ' + pos.y)
          }
        }
        )
      },
      $update: function () {

        this.$components = [
          {
            $type: "h5",
            class: "mdc-typography--headline5",
            $text: this._ddText
          }
        ]

      }
    }

 
    let dragDropProxyArea = {
      $cell: true,
      $type: 'div',
      id: "ddProxy",
      class: 'dragdropArea',
      _ddText: '',
      _refresh: function (aText) {
        this._ddText = aText;

      },
      $init: function () {
        console.log('init d&d area for proxy files');
        this._refresh('Drag & Drop a folder with proxy files here...');
        let self = this;
        DragDrop("#ddProxy",
        {
          onDrop: function (files, pos, fileList, directories) {
            console.log('onDrop: ' + files.length + ' files at ' + pos.x + ', ' + pos.y);
            //let worldsObj = {};
            let proxy = _LCSDB.user().get('proxy').put({id:'proxy'});

            files.forEach(function (file) {

              let proxyObj = {};

              if ((file.name.indexOf('.yaml') !== -1) ||
                (file.type == "text/javascript") || 
                (file.type == "text/html") || 
                (file.type == "application/json")) {

              console.log('- ' + file.name + ' (' + file.size + ') (' + file.type + ')');

              // convert the file to a Buffer that we can use!
              const reader = new FileReader()
              reader.addEventListener('load', e => {
                // e.target.result is an ArrayBuffer
                const arr = new Uint8Array(e.target.result)
                const fileBuffer = new buffer.Buffer(arr);
                const fileSource = fileBuffer.toString();
                // do something with the buffer!

                  var entryName = file.fullPath.slice(1).split(".").join("_");
                  let userPub = _LCSDB.user().is.pub;
          
                  let created = new Date().valueOf();
            
                      // let obj = {
                      //   'owner': userPub,
                      //   'file': fileSource,
                      //   'modified': created,
                      //   'created': created
                      // }
                    proxyObj[entryName] = fileSource;
                    console.log(proxyObj);
                    proxy.put(proxyObj);

                  
              })
              reader.addEventListener('error', err => {
                console.error('FileReader error' + err)
              })
              reader.readAsArrayBuffer(file)

            }

            })
            //console.log('Worlds', worldsObj);
            console.log('files array', files)
            console.log('FileList object', fileList)
            console.log('directories array', directories)
            self._refresh(directories.map(el=>{return el.name}).toString());
          },
          onDropText: function (text, pos) {
            console.log('onDropText: ' + text + ' at ' + pos.x + ', ' + pos.y)
          }
        }
        )
      },
      $update: function () {

        this.$components = [
          {
            $type: "h5",
            class: "mdc-typography--headline5",
            $text: this._ddText
          }
        ]

      }
    }

    let loadDefaultsProxy = {
      $type: 'div',
      $components: [
        {
          $type: "button",
          class: "mdc-button mdc-button--raised",
          $text: "Load default Proxy from LiveCoding.space server",
          onclick: async function (e) {
            console.log("user action");
            await window._app.loadProxyDefaults();
          }
        }
      ]
    }

    let loadEmpty = {
      $type: 'div',
      $components: [
        {
          $type: "button",
          id: "loadDefaults",
          class: "mdc-button mdc-button--raised",
          $text: "Init empty world",
          onclick: function (e) {
            console.log("user action");
            window._app.loadEmptyDefaultProto();
          }
        }
      ]
    }

    let userProfile = {
      $type: 'div',
      id: "profile",
      _status: "",
      _refresh: function(status){
        this._status = status;
      },
      $init: function () {
        this._status = "user is not signed in..."
      },
      $update: function () {

        if(_LCSDB.user().is){

          this.$components = [

            {
              $type: "div",
              class: "mdc-layout-grid",
              $components: [
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
                                  $text: this._status //"Profile for: " + this.db.user().is.alias
                                }
                              ]
                          },
                          {
                            $type: "div",
                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                            $components: [
                              {
                                $type: "h3",
                                class: "mdc-typography",
                                $text: 'Load my world\'s protos:' //"Profile for: " + this.db.user().is.alias
                              },
                              dragDropWorldsArea, _app.widgets.emptyDiv, loadEmpty
                            ]
                        },
                        {
                          $type: "div",
                          class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                          $components: [
                            {
                              $type: "h3",
                              class: "mdc-typography",
                              $text: 'Load proxy files:' //"Profile for: " + this.db.user().is.alias
                            },
                            dragDropProxyArea,
                            _app.widgets.emptyDiv,
                            loadDefaultsProxy
                          ]
                      }
                      ]
                  }
              ]

          }

          ]
        } else {
          this.$components = [
            {
              $type: "h3",
              class: "mdc-typography--headline3",
              $text: this._status //"Profile for: " + this.db.user().is.alias
            },
            _app.widgets.divider
          ]

        }

       
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

            _LCSDB.user().get(worldType).get(worldName).get(file).load(worldFile => {

              if (worldFile) {
                var source = worldFile;
                if (type == 'state') {

                  if (!file.includes('_info_vwf_json')) {
                    source = worldFile.jsonState;
                    var saveName = worldFile.filename;
                  }
                }
                //console.log(source);

                //var source = (typeof(sourceToEdit) =="object") ? JSON.stringify(sourceToEdit): sourceToEdit;
                if (file.includes('_json') && (typeof source !== 'object')) {
                  source = (typeof JSON.parse(source) == 'object') ? JSON.stringify(JSON.parse(source), null, '\t') : source
                  //source = source;//JSON.stringify(source, null, '\t');
                } else if (typeof source == 'object') {
                  source = JSON.stringify(source, null, '\t')
                }


                let el = document.createElement("div");
                el.setAttribute("id", "worldFILE");
                document.body.appendChild(el);

                var saveGUI = {};
                if (type == 'proto' || file.includes('_info_vwf_json')) {

                  saveGUI = {
                    $type: "button",
                    class: "mdc-button mdc-button--raised",
                    $text: "Save",
                    onclick: async function (e) {
                      console.log("save new info");
                      let editor = document.querySelector("#aceEditor").env.editor;
                      let newInfo = editor.getValue();
                      _LCSDB.user().get(worldType).get(worldName).get(file).put(newInfo, function (res) {
                        if (res) {

                          let noty = new Noty({
                            text: 'Saved!',
                            timeout: 2000,
                            theme: 'mint',
                            layout: 'bottomRight',
                            type: 'success'
                          });
                          noty.show();

                          // let modified = new Date().valueOf();
                          // _LCSDB.user().get(worldType).get(worldName).get(file).get('modified').put(modified);
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

                          //let userPub = (await _LCSDB.get('users').get(user).get('pub').promOnce()).data;
                          let userPub = await _app.helpers.getUserPub(user);
                          let revs = await _app.lookupSaveRevisions(worldName, saveName, userPub);
                          let lastRevision = revs.sort()[0];

                          var newFile = file.replace('savestate_', 'savestate_' + lastRevision.toString());

                          _LCSDB.user().get(worldType).get(worldName).get(file).get('revs').get(newFile).get('jsonState').put(fixedState);
                          _LCSDB.user().get(worldType).get(worldName).get(file).get('jsonState').put(fixedState, function (res) {
                            if (res) {

                              let noty = new Noty({
                                text: 'Repalced!',
                                timeout: 2000,
                                theme: 'mint',
                                layout: 'bottomRight',
                                type: 'success'
                              });
                              noty.show();

                              // let modified = new Date().valueOf();
                              // _LCSDB.user().get(worldType).get(worldName).get(file).get('modified').put(modified);
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
                        //window.location.pathname = "/" + user + '/' + worldName + '/about'
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
            });

          }
        }
      })
  }

  HandleUserWorldsWithType(ctx) {

    console.log("USER WORLDS INDEX");
    console.log(ctx.params);
    let user = ctx.params.user;
    let type = ctx.params.type;

    window._app.hideProgressBar();
    window._app.hideUIControl();

    if (!_app.indexApp) {
      _app.indexApp = new IndexApp;
      //_app.indexApp.initHTML();
      //_app.indexApp.initApp();
    }

    if (type == 'protos') {
      _app.indexApp.allWorldsProtosForUser(user)//.getWorldsProtosListForUser(user); 
    } else if (type == 'states') {
      _app.indexApp.allWorldsStatesForUser(user)
     // _app.indexApp.initWorldsStatesListForUser(user);
      //await _app.indexApp.getWorldsFromUserDB(user);
    }

  }

  async generateFrontPage() {

    let infoEl = document.createElement("div");
    infoEl.setAttribute("id", "indexPage");

    let lang = _LangManager.locale;

    let infoElHTML = await _app.helpers.getHtmlText('/web/locale/' + lang + '/index.html');
    infoEl.innerHTML = infoElHTML;
    document.body.appendChild(infoEl);

    // document.querySelector('#ruLang').addEventListener('click', function (e) {
    //     _LangManager.locale = 'ru';
    //     window.location.reload(true);
    // });

    // document.querySelector('#enLang').addEventListener('click', function (e) {
    //     _LangManager.locale = 'en';
    //     window.location.reload(true);
    // });

}

  HandleIndex() {

    console.log("INDEX");

    window._app.hideProgressBar();
    window._app.hideUIControl();

   (new Promise(res => res(_app.generateFrontPage()))).then(res=>{


    if (!_app.indexApp) {
      _app.indexApp = new IndexApp('index');
    }

  
    //_app.indexApp.initApp();


    // _q(_LCSDB).get('~@app').data().then(res => {
    //   if (res) {
    //     _app.indexApp.initWorldsProtosListForUser('app');
    //   }
    // })

   })

    

    // _LCSDB.get('~@app').once(res=>{
    //   if (res){
    //     _app.indexApp.initWorldsProtosListForUser('app');
    //   }
    // })

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

  // async setUserPaths(user) {

  //   await _q(_LCSDB).get('users').get(user).get('pub').data().then(function (res) {
  //     if (res)
  //       window._LCS_WORLD_USER = {
  //         alias: user,
  //         pub: res
  //       }
  //   })


  //   //let users = _LCSDB.get('users');
  //   // await _LCSDB.get('users').get(user).get('pub').then(function (res) {
  //   //   if (res)
  //   //     window._LCS_WORLD_USER = {
  //   //       alias: user,
  //   //       pub: res
  //   //     }
  //   // })


  //   // await _LCSDB.get('users').get(user).get('pub').once(res => {
  //   //   if (res)
  //   //     window._LCS_WORLD_USER = _LCSDB.user(res);
  //   // }).then();

  // }

  HandleParsableRequestGenID(ctx) {

    let app = window._app;
    console.log(ctx.params);
    let user = ctx.params.user;
    let space = ctx.params.space;
    var pathname = ctx.pathname;

    //await app.setUserPaths(user);

   // _q(_LCSDB).get('users').get(user).get('pub').data().then(function (res) {
    _app.helpers.getUserPub(user).then(function (res) {
      if (res)
        window._LCS_WORLD_USER = {
          alias: user,
          pub: res
        }


      if (pathname[pathname.length - 1] == '/') {
        pathname = pathname.slice(0, -1)
      }

      let pathToParse = '/' + space; // pathname.replace('/' + user, "");

      let parsedRequest = {
        application: "index.vwf",
        instance: undefined,
        private_path: undefined,
        public_path: pathToParse
      }

      localStorage.setItem('lcs_app', JSON.stringify({ path: parsedRequest }));
      console.log(parsedRequest);

      if ((parsedRequest['instance'] == undefined) && (parsedRequest['private_path'] == undefined) && (parsedRequest['public_path'] !== "/") && (parsedRequest['application'] !== undefined)) {

        //page.redirect(pathname + '/' + app.helpers.GenerateInstanceID());
        window.location.pathname = pathname + '/' + app.helpers.GenerateInstanceID()
      }

    })

  }


  HandleParsableRequestWithID(ctx) {

    let app = window._app;
    console.log(ctx.params);
    var pathname = ctx.pathname;
    let user = ctx.params.user;
    let genID = ctx.params.id;
    let space = ctx.params.space;
    let savename = ctx.params.savename;

    if (pathname[pathname.length - 1] == '/') {
      pathname = pathname.slice(0, -1)
    }

    //await app.setUserPaths(user);

    //_q(_LCSDB).get('users').get(user).get('pub').data()
    //new Promise(res => _LCSDB.get('users').get(user).get('pub').once(res)).then(function (res) {
    _app.helpers.getUserPub(user).then(function (res) {
      if (res)
        window._LCS_WORLD_USER = {
          alias: user,
          pub: res
        }
    }).then(res => {

      return app.loadAppLibs()

    }).then(res => {

      let pathToParse = '/' + space; //pathname.replace('/' + user, "");

      let parsedRequest = {
        application: "index.vwf",
        instance: genID,
        private_path: undefined,
        public_path: pathToParse
      }

      if (savename) {
        parsedRequest.private_path = 'load/' + savename;
      }

      localStorage.setItem('lcs_app', JSON.stringify({ path: parsedRequest }));
      return parsedRequest
    }).then(pr => {

      let cpath = pr.public_path;
      return new Promise(res => _LCSDB.user(_LCS_WORLD_USER.pub).get('worlds').get(cpath.slice(1)).load(res)) //, { wait: 400 }

    }).then(val => {

      let res = val['index_vwf_config_yaml'];
      var conf = "";

      if (res) {
        let config = YAML.parse(res);
        conf = config
      }

      let manualSettings = localStorage.getItem('lcs_app_manual_settings');
      if (manualSettings) {
        let manualConf = JSON.parse(manualSettings);
        conf.model = manualConf.model;
        conf.view = manualConf.view;
      }

      //check & set default proxy for world
      if(val.proxy){
        vwf.proxy = val.proxy;
      }


      return conf

    }).then(res => {
      var userLibraries = { model: {}, view: {} };
      var application;
      vwf.loadConfiguration(application, userLibraries, res, compatibilityCheck);

    })

  }

  async loadAppLibs() {

    await loadjs([
      '/vwf/model/aframe/aframe-master.min.js',
      '/vwf/model/aframe/extras/aframe-extras.loaders.js',
      '/vwf/model/aframe/extras/aframe-extras.controls.min.js',
      '/vwf/model/aframe/kframe/aframe-aabb-collider-component.min.js',
      '/vwf/model/aframe/addon/aframe-interpolation.js',
      '/vwf/model/aframe/addon/aframe-sun-sky.js',
      '/vwf/model/aframe/addon/SkyShader.js',
      '/vwf/model/aframe/addon/BVHLoader.js',
      '/vwf/model/aframe/addon/TransformControls.js',
      '/vwf/model/aframe/addon/THREE.MeshLine.js',
      '/vwf/model/aframe/addon/aframe-components.js'
      //'/vwf/view/arjs/aframe-ar.js' //load in aframe-ar-driver
    ], {
      async: false,
      returnPromise: true
    });

    return loadjs([
      '/lib/compatibilitycheck.js',
      '/vwf/view/webrtc/adapter-latest.js',
      '/lib/draggabilly/draggabilly.pkgd.js',
      '/vwf/model/aframe/addon/virtualgc/nipplejs.js',
      '/lib/lively.vm_standalone.js',
      '/lib/require.js',
      '/lib/crypto.js',
      '/lib/md5.js',
      '/lib/alea.js',
      '/lib/mash.js',
      '/vwf.js'
    ], {
      async: false,
      returnPromise: true
    })

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

    let parsedRequest = dataJson.path;
    if (parsedRequest['private_path']) {
      var segments = this.helpers.GenerateSegments(parsedRequest['private_path']);
      if ((segments.length > 1) && (segments[0] == "load")) {
        var potentialRevs = await this.lookupSaveRevisions((parsedRequest['public_path']).slice(1), segments[1]);
      }

      var loadInfo = this.getLoadInformation(dataJson, potentialRevs);
      var saveInfo = await this.loadSaveObject(loadInfo);

    }


    let loadObj = {
      loadInfo: loadInfo ? loadInfo: {},
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

    if (!_LCS_WORLD_USER) {
      pub = userPub;
    } else {
      pub = _LCS_WORLD_USER.pub
    }

    //let userDB = _LCSDB.user(pub);

    var result = [];
    let docName = 'savestate_/' + public_path + '/' + save_name + '_vwf_json';

    let node = _LCSDB.user(pub).get('documents').get(public_path).get(docName).get('revs');
    let revs = await new Promise(res => node.load(res, { wait: 400 })); 

    if (revs) {
      for (const res of Object.values(revs)) {
        result.push(parseInt(res.revision));
      }
      return result

    }

  }

  // GetLoadInformation receives a parsed request {private_path, public_path, instance, application} and returns the
  // details of the save that is designated by the initial request. The details are returned in an object
  // composed of: save_name (name of the save) save_revision (revision of the save), explicit_revision (boolean, true if the request
  // explicitly specified the revision, false if it did not), and application_path (the public_path of the application this is a save for).

  getLoadInformation(response, potentialRevisions) {
    let parsedRequest = response.path;
    let segments = this.helpers.GenerateSegments(parsedRequest['private_path']);
    let result = { 'save_name': undefined, 'save_revision': undefined, 'explicit_revision': undefined, 'application_path': undefined };

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

    return result;
  }

  async loadSaveObject(loadInfo) {

    //let objName = loadInfo[ 'save_name' ] +'/'+ "savestate_" + loadInfo[ 'save_revision' ];

    //let userDB = _LCSDB.user(_LCS_WORLD_USER.pub);

    if (!loadInfo.save_name) {
      return undefined
    }

    let objName = "savestate_" + loadInfo['application_path'] + '/' + loadInfo['save_name'] + '_vwf_json';
    let objNameRev = "savestate_" + loadInfo['save_revision'] + loadInfo['application_path'] + '/' + loadInfo['save_name'] + '_vwf_json';

    // if(loadInfo[ 'save_revision' ]){
    // } 

    let worldName = this.helpers.appPath //loadInfo[ 'application_path' ].slice(1);

    let dbNode = _LCSDB.user(_LCS_WORLD_USER.pub).get('documents').get(worldName).get(objName).get('revs').get(objNameRev);

    let saveObject = await new Promise(res => dbNode.load(res, { wait: 300 }));
    //(await userDB.get('documents').get(worldName).get(objName).get('revs').get(objNameRev).promOnce()).data;

    var saveInfo = null;
    if (saveObject) {
      saveInfo = (typeof (saveObject.jsonState) == 'object') ? saveObject.jsonState : JSON.parse(saveObject.jsonState);
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
    let potentialSaveNames = (await user.get('documents').get(docName).promOnce()).data;

    if (potentialSaveNames) {

      for (const res of Object.keys(potentialSaveNames)) {
        if (res !== '_') {

          let el = (await user.get('documents').path(docName).get(res).promOnce()).data;

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

     return (new Promise(res=>_LCSDB.user(userPub).get('worlds').get(worldName).once(res))).then(res=>{
      let worldFiles = Object.entries(res).filter(el => (el[0].includes('_json')) || (el[0].includes('_yaml')) || (el[0].includes('_html')) || (el[0].includes('_js')))
      .filter(el => (el[0] !== 'info_json'));


      console.log(worldFiles);
      return worldFiles
    });
   
    //let worldObj = {};
    // for (var doc in worldFileNames) {
    //   let fn = worldFileNames[doc];
    //   let res = (await _LCSDB.user(userPub).get('worlds').get(worldName).get(fn).promOnce()).data;
    //   // var data = {
    //   //   'file': res.file,
    //   //   'modified': res.modified,
    //   //   'created': res.created
    //   // }
    //   // if (!date) {
    //   //   data = {
    //   //     'file': res.file
    //   //   }
    //   // }
    //   worldObj[fn] = res;
    // }

  }

  async cloneWorldPrototype(worldName, userName, newWorldName, stateFileName) {

    let self = this;

    _app.showProgressBar();

    //let users = await _LCSDB.get('users').then();
    //let userPub = (await _LCSDB.get('users').get(userName).get('pub').promOnce()).data;
    let userPub = await _app.helpers.getUserPub(userName);
    let newOwner = _LCSDB.user().is.pub;

    let myWorlds = (await _LCSDB.user(newOwner).get('worlds').promOnce()).data;
    //if (!myWorlds) _LCSDB.user(newOwner).get('worlds').put({});

    _LCSDB.user(newOwner).get('worlds').not(res => {
      _LCSDB.user(newOwner).get('worlds').put({});
    })

    if (myWorlds) {
      let checkExist = Object.keys(myWorlds).filter(el => el == newWorldName);

      if (newWorldName) {

        //let worldProto = (await _LCSDB.user(newOwner).get('worlds').get(newWorldName).promOnce()).data;
        if (checkExist.length > 0 && myWorlds[newWorldName]) {
          console.log('already exist!');
          return
        }
      }
    }

    let worldID = window._app.helpers.GenerateInstanceID().toString();
    if (newWorldName) {
      worldID = newWorldName
    }

    //let modified = new Date().valueOf();
    console.log('clone: ' + worldName + 'to: ' + worldID);

    let created = new Date().valueOf();
    

    // let worldObj = {
    //   'owner': newOwner,
    //   'parent': userName + '/' + worldName,
    //   'featured': true,
    //   'published': true,
    //   'created': created
    // };

    // let fileNamesAll = 
    await _LCSDB.user(userPub).get('worlds').get(worldName).load(all => {

      let worldObj = Object.assign({}, all);

      worldObj.owner = newOwner;
      worldObj.parent = userName + '/' + worldName;
      worldObj.featured = true
      worldObj.published =true
      worldObj.created = created
      
      if(!all.proxy){
        worldObj.proxy = userPub;
      } else {
        worldObj.proxy = all.proxy;
      }

      console.log(worldObj);

      // for (const obj of Object.keys(worldObj)) {
      //   let myWorlds = _LCSDB.user().get('worlds');
      //   let myNewWorld = myWorlds.get(worldID);
      //   myNewWorld.get(obj).put(worldObj[obj]);
      // }

      //let myWorlds = await _LCSDB.user(newOwner).get('worlds').once().then();
      //let myWorld = _LCSDB.user(newOwner).get('worlds').get(worldID).put({id:worldID});
      let myWorld = _LCSDB.user(newOwner).get('worlds').get(worldID).put({id:worldID});
      myWorld.put(worldObj, function (res) {
        if (stateFileName) {
          self.saveStateAsFile(stateFileName)
        }
        console.log(res)
      }); //.get(worldID) let myWorld =

      // let myWorld = _LCSDB.user().get(worldID).put(worldObj);
      // _LCSDB.user().get('worlds').set(myWorld);

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

    }, { wait: 500 }).then();


    //window.location.pathname = '/' + userName + '/' + worldID + '/about'
    //page()

    // Object.keys(worldObj).forEach(el => {
    //   this.db.user().get('worlds').get(worldID).get(el).put(worldObj[el]);
    // })


  }

  async cloneWorldState(filename) {

    let myWorldProtos = (await _LCSDB.user().get('worlds').promOnce()).data;
    let userName = this.helpers.worldUser;

    // let users = await _LCSDB.get('users').then();

    // let userPub = (await _LCSDB.get('users').get(userName).get('pub').promOnce()).data;
    let userPub = await _app.helpers.getUserPub(userName);
    let protoUserRoot = this.helpers.getRoot(true).root;
    //let myName = this.db.user().is.alias;

    //let proto = Object.keys(myWorldProtos).filter(el => el == protoUserRoot);

    var protosKeys = [];
    if (myWorldProtos)
      protosKeys = Object.keys(myWorldProtos);

    if (protosKeys.includes(protoUserRoot) && myWorldProtos[protoUserRoot]) {

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
      await this.cloneWorldPrototype(protoUserRoot, userName, protoUserRoot, filename);
      //this.saveStateAsFile(filename);

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

    let jsonValuePure = _app.helpers.replaceFloatArraysInNodeDef(state);
    //remove all Ohm generated grammarsfrom state

    let jsonValue = _app.helpers.removeGrammarObj(jsonValuePure);
    var jsonState = JSON.stringify(jsonValue, null, '\t'); //JSON.stringify(jsonValue);

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
    _LCSDB.user().get('documents').not(res=>{
    _LCSDB.user().get('documents').put({id:'documents'})
  })

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

    let rev = JSON.stringify(saveRevision);
    var docNameRev = 'savestate_' + rev + '/' + root + '/' + filename + '_vwf_json';
    let stateWithRev = Object.assign({}, stateForStore);
    stateWithRev.revs = { [docNameRev]: stateForStore };
    stateWithRev.revs[docNameRev].revision = saveRevision;


    //let objName = loadInfo[ 'save_name' ] +'/'+ "savestate_" + loadInfo[ 'save_revision' ];
    // "savestate_" + loadInfo[ 'save_revision' ] + '/' + loadInfo[ 'save_name' ] + '_vwf_json'
    var docName = 'savestate_/' + root + '/' + filename + '_vwf_json';
    let myNewWorldState = _LCSDB.user().get('documents').get(root).get(docName).put({'id': docName});
    //_LCSDB.user().get('documents').get(root).get(docName).put(stateWithRev, function(res) {
    myNewWorldState.put(stateWithRev, function (res) {
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
    _LCSDB.user().get('worlds').get(root).get('info_json').once(function (file) {

      if (file) {

        // let modified = saveRevision;
        // let newOwner = _LCSDB.user().is.pub;
        // let userName = _LCSDB.user().is.alias;

        let fileData = (typeof file == 'object') ? JSON.stringify(file) : file;

        // let obj = {
        //   'parent': userName + '/' + root,
        //   'owner': newOwner,
        //   'file': fileData, //file, //JSON.stringify(file),
        //   //'modified': modified,
        //   'created': modified

        // }

        let docInfoName = 'savestate_/' + root + '/' + filename + '_info_vwf_json';

        _LCSDB.user().get('documents').get(root).get(docInfoName).put(fileData);

        // _LCSDB.user().get('documents').get(root).get(docInfoName).get('file').not(function (res) {
        //   _LCSDB.user().get('documents').get(root).get(docInfoName).put(obj);
        // });

        // _LCSDB.user().get('documents').get(root).get(docInfoName).get('created').not(function (res) {
        //   _LCSDB.user().get('documents').get(root).get(docInfoName).get('created').put(modified);
        // });

        // _LCSDB.user().get('documents').get(root).get(docInfoName).get('modified').put(modified);

      }
    });


    // // Save Config Information
    // var config = { "info": {}, "model": {}, "view": {} };

    // // Save browser title
    // config["info"]["title"] = document.title//$('title').html();

    // // Save model drivers
    // Object.keys(vwf_view.kernel.kernel.models).forEach(function (modelDriver) {
    //   if (modelDriver.indexOf('vwf/model/') != -1) config["model"][modelDriver] = "";
    // });

    // // If neither glge or threejs model drivers are defined, specify nodriver
    // if (config["model"]["vwf/model/glge"] === undefined && config["model"]["vwf/model/threejs"] === undefined) config["model"]["nodriver"] = "";

    // // Save view drivers and associated parameters, if any
    // Object.keys(vwf_view.kernel.kernel.views).forEach(function (viewDriver) {
    //   if (viewDriver.indexOf('vwf/view/') != -1) {
    //     if (vwf_view.kernel.kernel.views[viewDriver].parameters) {
    //       config["view"][viewDriver] = vwf_view.kernel.kernel.views[viewDriver].parameters;
    //     }
    //     else config["view"][viewDriver] = "";
    //   }
    // });

    // //var jsonConfig = $.encoder.encodeForURL(JSON.stringify(config));
    // var jsonConfig = JSON.stringify(config);



    // let configStateForStore = {
    //   "root": root,
    //   "filename": filename,
    //   "inst": inst,
    //   "timestamp": timestamp,
    //   "extension": "config.vwf.json",
    //   "jsonState": jsonConfig
    // };

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

    let userName = (await userDB.get('alias').promOnce()).data;

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

    let revs = (await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').promOnce()).data;
    if (revs) {
      for (const el of Object.keys(revs)) {
        if (el !== '_') {
          let doc = (await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').get(el).promOnce()).data;
          for (const rev of Object.keys(doc)) {
            if (rev !== '_') {
              await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').get(el).get(rev).put(null).promOnce();
            }
          }
          await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').get(el).put(null).promOnce();
        }
      }
    }

    // clear all state params
    let stateDoc = (await _LCSDB.user().get('documents').get(worldName).get(indexState).promOnce()).data;
    for (const state of Object.keys(stateDoc)) {
      if (state !== '_' && state !== 'revs') {
        await _LCSDB.user().get('documents').get(worldName).get(indexState).get(state).put(null).promOnce();
      }
    }

    await _LCSDB.user().get('documents').get(worldName).get(indexState).get('revs').put(null).promOnce();
    await _LCSDB.user().get('documents').get(worldName).get(indexState).put(null).promOnce();

  }

  async deleteWorld(name, type) {

    if (type == 'proto') {

      let worldName = name;
      //TODO check for states (ask for deleting all states first...)
      //delete states

      let documents = (await _LCSDB.user().get('documents').promOnce()).data;
      if (documents) {
        let states = (await _LCSDB.user().get('documents').get(worldName).promOnce()).data;
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

      let worldFiles = (await _LCSDB.user().get('worlds').get(worldName).promOnce()).data;
      if (worldFiles) {
        for (const el of Object.keys(worldFiles)) {
          if (el !== '_') {
            let doc = (await _LCSDB.user().get('worlds').get(worldName).get(el).promOnce()).data;
            if (doc) {
              if (doc.file) {
                for (const fEl of Object.keys(doc)) {
                  if (fEl !== '_') {
                    await _LCSDB.user().get('worlds').get(worldName).get(el).get(fEl).put(null).promOnce();
                  }
                }
                await _LCSDB.user().get('worlds').get(worldName).get(el).put(null).promOnce();
              } else {
                await _LCSDB.user().get('worlds').get(worldName).get(el).put(null).promOnce()
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

      await _LCSDB.user().get('worlds').get(worldName).put(null).promOnce();

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

  async getAllStateWorldsInfoForUser(userAlias, worldName, saveName) {


    //let userPub = await new Promise(res => _LCSDB.get('users').get(userAlias).get('pub').once(res));
    let userPub = await _app.helpers.getUserPub(userAlias);

    var db = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == userAlias)
        db = _LCSDB.user();
    }

    //let hasDocs = await (new Promise(res => db.get('documents').not(res(false)))).then(res=>{return res});
    
    let list = await (new Promise(res => db.get('documents').load(res, { wait: 400 })))
      .then(r => {
        if (!worldName) {
          return Promise.all(Object.keys(r).map(k => db.get('documents').get(k).then(res => { return [k, res] })))
        } else {
          return Promise.all([db.get('documents').get(worldName).then(res => { return [worldName, res] })])
        }
      }
      )
      .then(r => Promise.all(Object.keys(r).map(k => {
        let objEl = r[k][1];
        if(objEl){
        let obj = Object.entries(objEl).filter(el => el[0].includes('_info_vwf_json'));
        if (obj) {
          return { world: r[k][0], states: obj }
        }
      } else {
        return { world: r[k][0], states: [] }
      }

      }

      )

      )).then(r =>
        Promise.all(r.map(k =>
          Promise.all((k.states).map(el =>
            {
              let obj = el[1];
              if(obj){
            return _LCSDB.get(el[1]['#']).load().then(m => { return { world: k.world, stateName: el[0], stateInfo: m } })
              }
            }
            ))
        ))
      )


    //console.log('All states: ', list)


    let docs = {};

    list.map(el => {
      
      el.map(el => {
        if(el){

        let res = el.stateInfo;
        let doc = {};

        if (res && res !== 'null') {

          //if (res.file && res.file !== 'null') {

            let saveName = el.stateName.split('/')[2].replace('_info_vwf_json', "");

            var worldDesc = {};
            if (typeof (res) == 'object') {
              worldDesc = res
            } else {
              worldDesc = JSON.parse(res)
            }


            let root = Object.keys(worldDesc)[0];
            var appInfo = worldDesc[root]['en'];

            let langID = localStorage.getItem('krestianstvo_locale');
            if (langID) {
              appInfo = worldDesc[root][langID]
            }

            let settings = worldDesc[root]['settings'];

            doc = {
              'worldName': el.world + '/load/' + saveName,
              'created': res.created ? res.created : res.modified,
              'modified': res.modified,
              'type': 'saveState',
              'userAlias': userAlias,
              'info': appInfo,
              'settings': settings
            }
          //}
        }

        if (Object.keys(doc).length !== 0) {
          docs[doc.worldName] = doc;

        }
      }
      })
    
    })


    console.log(docs);

    if (saveName) {
      return docs[saveName]
    }

    return docs

  }



  async getAllProtoWorldsInfoForUser(userAlias, worldName) {

    //let userPub = await new Promise(res => _LCSDB.get('users').get(userAlias).get('pub').once(res));
    let userPub = await _app.helpers.getUserPub(userAlias);

    var db = _LCSDB.user(userPub);

    if (_LCSDB.user().is) {
      if (_LCSDB.user().is.alias == userAlias)
        db = _LCSDB.user();
    }

    let list = await (new Promise(res => db.get('worlds').load(res, { wait: 400 })))
      .then(r => {

        if (!worldName) {
          return Promise.all(Object.keys(r).map(k => db.get('worlds').get(k).then(res => { return [k, res] })))
        } else {
          return Promise.all([db.get('worlds').get(worldName).then(res => { return [worldName, res] })])
        }
      }
      )
      .then(r => Promise.all(Object.keys(r).map(k => {
        let objEl = r[k][1];
        if(objEl){
          let obj = objEl.info_json;
        if (obj) {
          return _LCSDB.get(obj["#"]).then(res => { return { world: r[k], info: res } })
        }
      }
      }))).then(r => { return r })

    //console.log(list);

    let docs = {};

    list.forEach(el => {
      if (el) {

        let doc = {}
        let res = el.info;
        let index = el.world[0];
        let proxy = el.world[1].proxy;

        if (res && res !== 'null') {

          //if (res.file && res.file !== 'null') {

            //let worldDesc = JSON.parse(res.file);

            var worldDesc = {};
            if (typeof (res) == 'object') {
              worldDesc = res
            } else {
              worldDesc = JSON.parse(res)
            }

            let root = Object.keys(worldDesc)[0];
            var appInfo = worldDesc[root]['en'];

            let langID = localStorage.getItem('krestianstvo_locale');
            if (langID) {
              appInfo = worldDesc[root][langID]
            }

            let settings = worldDesc[root]['settings'];

            doc = {
              'worldName': index,
              'created': res.created ? res.created : res.modified,
              'modified': res.modified,
              'proxy': proxy,
              'type': 'proto',
              'userAlias': userAlias,
              'info': appInfo,
              'settings': settings
            }
          //}
        }

        if (Object.keys(doc).length !== 0)
          docs[index] = doc;
      }

    })

    if (worldName) {
      return docs[worldName]
    }

    return docs

  }


  async setNewProxyForWorld(worldName, proxyName){

    if(_LCSDB.user().is){
      let newProxy = await _app.helpers.getUserPub(proxyName)
      if(newProxy)
        _LCSDB.user().get('worlds').get(worldName).put({'proxy': newProxy})
    }
    
  }


}

export { App }