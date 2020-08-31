/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

import page from '/lib/page.mjs';
import { Helpers } from '/core/helpers.js';
import { VWF } from '/core/vwf.js';
import { WorldApp } from '/web/world-app.js';
import { Widgets } from '/lib/ui/widgets.js';

import { createAdapter } from '/lib/fun/@most/adapter/dist/index.mjs';
import *  as mostSubject from '/lib/fun/@most/subject/dist/index.all.js';

class App {
  constructor() {
    console.log("app constructor");
    this.widgets = new Widgets;
    //globals
    window._app = this;
    window._cellWidgets = this.widgets;

    //global functional objects M - for MostJS Core; R - for Ramda; L - for Partial Lenses  
    window.M = mostCore;
    M.createAdapter = createAdapter;
    M.subject = mostSubject;
    M.scheduler = mostScheduler;
    M.prelude = mostPrelude;
    M.e = mostDomEvent;
    ///

    window._noty = new Noty;
    this.helpers = new Helpers;
    this.log = this.helpers.log;
    this.hashids = new Hashids.default();

    this.clearLocalStorage();

    // this.luminary = new Luminary;


    this.config = {};

    this.initDB()
    new Promise(res => { this.initUser(); res });


    import('/lib/locale/locale.js').then(res => {
      window._LangManager = new res.default;
      return new Promise(r => r(_LangManager.setLanguage()))
    })
      .then(res => {
        window._l = _LangManager.language;
      })
      .then(res => {
        return import('/web/index-app.js');
      }).then(res => {
        window.IndexApp = res.default;
        this.setPageRoutes();
      });

  }

  setPageRoutes() {
    //client routes
    page('/', this.HandleIndex);
    page('/setup', this.HandleSetupIndex);
    page('/debug', this.HandleDebugIndex);
    page('/settings', this.HandleSettingsIndex);
    page('/profile', this.HandleUserIndex);
    page('/worlds', this.HandleIndex);
    page('/:user/worlds', this.HandleUserWorlds);
    page('/:user/:type/:name/edit/:file', this.HandleFileEdit);
    page('/:user/:space', this.HandleParsableRequestGenID);
    page('/:user/:space/about', this.HandleWorldAbout);
    page('/:user/:space/:id', this.HandleParsableRequestWithID);
    page('/:user/:space/index.vwf/:id', this.HandleParsableRequestWithID);
    page('/:user/:space/load/:savename', this.HandleParsableLoadRequest);
    page('/:user/:space/:id/load/:savename', this.HandleParsableRequestWithID);
    page('/:user/:space/index.vwf/:id/load/:savename', this.HandleParsableRequestWithID);

    // page('/:user/worlds/:type', this.HandleUserWorldsWithType);
    // page('/:user/:space/load/:savename/about', this.HandleWorldAbout);
    // page('/:user/:space/load/:savename/:rev', this.HandleParsableLoadRequestWithRev);
    // page('/:user/:space/:id/load/:savename/:rev', this.HandleParsableRequestWithID);

    page('*', this.HandleNoPage);

    page();
  }

  initDB() {
    let configDefaults = {
      'luminary': false,
      'luminaryPath': 'https://localhost:8081',
      'luminaryGlobalHBPath': 'server/heartbeat',
      'luminaryGlobalHB': false,
      'dbhost': window.location.origin + '/gun', // 'https://' + window.location.hostname + ':8080/gun', //'http://localhost:8080/gun',
      'reflector': 'https://' + window.location.hostname + ':3002',
      'webrtc': false,
      'language': 'en',
      'd3DoF': false,
      'd6DoF': false,
      'streamMsg': false,
      'multisocket': false 
    }

    let conf = JSON.parse(localStorage.getItem('lcs_config'));
    let config = conf ? conf : {};

    if(conf){
      Object.keys(configDefaults).forEach(el => {
        config[el] = config[el] ? config[el] : configDefaults[el]
    })
    } else {
      Object.assign(config, configDefaults);
    }

    localStorage.setItem('lcs_config', JSON.stringify(config));
    this.config = config;


    let webrtcConnection = this.config.webrtc;

    const opt = { peers: this.dbHost, localStorage: false, multicast: false, RTCPeerConnection: webrtcConnection, axe: false } //localStorage: false,
    //const opt = { peers: this.dbHost, localStorage: false, until: 1000, chunk: 5, axe: false} //until: 5000, chunk: 5
    //opt.store = RindexedDB(opt);
    this.db = Gun(opt);

    //In production
    //Gun.log.off = true;

    //window._LCS_SYS_USER = undefined;
    window._LCSDB = this.db;
    window._LCS_WORLD_USER = undefined;

    _LCSDB.on('hi', function (peer) {

      let msg = peer.url ? 'Connected to DB at: ' + peer.url : 'Peer added!';

      let noty = new Noty({
        text: msg,
        timeout: 100,
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
        timeout: 100,
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
    let lcsappConfig = localStorage.getItem('lcs_app');

    localStorage.clear();

    if (config)
      localStorage.setItem('lcs_config', config);

    if (langConfig)
      localStorage.setItem('krestianstvo_locale', langConfig);

    if (manualConfig)
      localStorage.setItem('lcs_app_manual_settings', manualConfig);

    if (lcsappConfig)
      localStorage.setItem('lcs_app', lcsappConfig);

  }

  initUser() {

    function recall() {
      _LCSDB.user().recall({ sessionStorage: 1 }, res => {
        console.log('User is: ', _LCSDB.user().is);
        if (_LCSDB.user().is)
          _app.helpers.checkUserCollision();
      });
    }
    setTimeout(
      recall, 1000)
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

    // Optional req from server
    // load to DB default proxy files (VWF & A-Frame components)

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
          proxyObj[entryName] = responseText;
        }
      }
    }
    console.log(proxyObj);
    let proxy = _LCSDB.user().get('proxy');
    proxy.put(proxyObj);
  }

  async loadWorldsDefaults(replace) {

    // Optional req from server
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

      "index_vwf_json": JSON.stringify(
        {
          "extends": "proxy/aframe/ascene.vwf"
        }, null, 4),

      "index_vwf_config_json": JSON.stringify(
        {
          "info": {
            "title": "Empty World"
          },
          "model": {
            "/drivers/model/aframe": null,
            "/drivers/model/aframeComponent": null
          },
          "view": {
            "/drivers/view/aframe": null,
            "/drivers/view/aframeComponent": null,
            "/drivers/view/editor": null
          }
        }, null, 4),
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

    let created = new Date().valueOf();

    worldsObj['empty'] = {
      'parent': '-',
      'owner': userPub,
      'featured': true,
      'published': true,
      'proxy': userPub,
      'created': created,
      'modified': created
    }

    Object.keys(emptyWorld).forEach(el => {
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

  HandleDebugIndex() {

    window._app.hideProgressBar();
    //window._app.hideUIControl();

    _app.generalIndex().then(r=>{

    let el = document.createElement("div");
    el.setAttribute("id", "appGUI");
    document.body.appendChild(el);

    _cellWidgets.debugGUI();

    })

  }

  HandleSettingsIndex() {

    window._app.hideProgressBar();
    //window._app.hideUIControl();


    _app.generalIndex().then(res=>{

    let el = document.createElement("div");
    el.setAttribute("id", "appGUI");
    document.body.appendChild(el);

    _cellWidgets.reflectorGUI();
    })

  }

  HandleWorldAbout(ctx) {

    console.log("about world");

    let userAlias = ctx.params.user;
    let worldName = ctx.params.space;
    let saveName = ctx.params.savename;

    window._app.hideProgressBar();
    //window._app.hideUIControl();


    _app.generalIndex().then(res=>{

    if (!_app.indexApp) {
      _app.indexApp = new IndexApp;
    }

    let worldApp = new WorldApp(userAlias, worldName, saveName);
    _app.helpers.getUserPub(userAlias).then(res => {
      worldApp.makeGUI(res)
    })
  })

  }

  HandleSetupIndex() {
    window._app.hideProgressBar();
    //window._app.hideUIControl();

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

          document.querySelector("#admin").$update();

          if (_LCSDB.user().is) {

            let loadEmpty = {
              $cell: true,
              $components: [
                {
                  $type: "p",
                  class: "mdc-typography--headline5",
                  $text: "Initialize empty World proto"
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
                  $text: "Load Sample Worlds protos from server (optional)"
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
                  $text: "Load VWF & A-Frame default components"
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
            adminComponents.push(loadDefaultsProxy, loadEmpty, loadDefaults);
            document.querySelector("#admin").$update();
          }
        }
      })
  }

  //TODO: profile

  HandleUserIndex(ctx) {

    console.log("USER INDEX");
    window._app.hideProgressBar();
    //window._app.hideUIControl();

    _app.generalIndex().then(r=>{

    import('/web/header.js').then(res => {
      let gui = new res.Header();
      gui.init();
    })

    _LCSDB.on('auth',
      async function (ack) {
        if (ack.sea.pub) {

          _app.helpers.checkUserCollision();

          let alias = _LCSDB.user().is.alias;
          let pub = _LCSDB.user().is.pub;
          document.querySelector("#profile")._refresh(
            {
              user: {
                alias: alias,
                pub: pub
              }
            }
          );
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
              self._refresh(directories.map(el => { return el.name }).toString());
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
              let proxy = _LCSDB.user().get('proxy').put({ id: 'proxy' });

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
                    if (entryName.slice(0, 6) !== 'proxy/') {
                      entryName = 'proxy/' + entryName
                    }
                    // let userPub = _LCSDB.user().is.pub;
                    // let created = new Date().valueOf();

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
              console.log('files array', files)
              console.log('FileList object', fileList)
              console.log('directories array', directories)
              self._refresh(directories.map(el => { return el.name }).toString());
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

    let proxySource =
    {
      $type: "div",
      id: "tree_proxy",
      _tree: [],
      _treeComp: {},
      $init: function () {
        let selfComp = this;
        _LCSDB.user().get('proxy').load(res => {
          // console.log(res);
          if (res) {
            selfComp._tree = [{
              name: 'Proxy sources: ',
              children: []
            }];
            Object.keys(res).filter(el => el.includes('_js') || el.includes('_json')).forEach(el => {
              selfComp._tree[0].children.push({
                name: el
              })
            })
            selfComp._treeComp = new TreeView(selfComp._tree, 'tree_proxy');
            selfComp._treeComp.on('select', function (evt) {
              console.log(evt);
              //window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/' + evt.data.name
            });
          }
        })

      },
      $components: [

      ]
    }


    let userProfile = {
      $type: 'div',
      id: "profile",
      _user: {},
      _refresh: function (data) {
        this._user = data.user;
      },
      $init: function () {
        this._user = { alias: "", pub: "" }
      },
      $update: function () {

        if (_LCSDB.user().is) {

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
                          $type: "h5",
                          class: "mdc-typography--headline4 unselectable",
                          $text: "User alias: " + this._user.alias //"Profile for: " + this.db.user().is.alias
                        },
                        {
                          $type: "h5",
                          class: "mdc-typography--headline5 unselectable",
                          $text: "User public key: " + this._user.pub//"Profile for: " + this.db.user().is.alias
                        },
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
                        dragDropWorldsArea, _app.widgets.emptyDiv,
                        {
                          $text: 'or'
                        },
                        _app.widgets.p,
                        loadEmpty
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
                        {
                          $text: 'or'
                        },
                        _app.widgets.p,
                        loadDefaultsProxy,
                        _app.widgets.p,
                        _app.widgets.divider,
                        proxySource
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
              $text: "user is not signed in..." //"Profile for: " + this.db.user().is.alias
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


  })


  }

  HandleUserWorlds(ctx) {

    console.log("USER WORLDS INDEX");
    console.log(ctx.params);
    let user = ctx.params.user;
    let type = ctx.params.type;

    window._app.hideProgressBar();
   // window._app.hideUIControl();

    _app.generalIndex().then(r=>{

    if (!_app.indexApp) {
      _app.indexApp = new IndexApp;
    }
    _app.indexApp.allWorldsForUser(user)

  })

  }

  HandleFileEdit(ctx) {

    console.log("USER WORLD FILE EDIT");

    let user = ctx.params.user;
    let worldName = ctx.params.name;
    let fileOriginal = ctx.params.file;
    let type = ctx.params.type;

    window._app.hideProgressBar();
    //window._app.hideUIControl();

    _app.generalIndex().then(r=>{

    _LCSDB.on('auth',
      async function (ack) {

        if (_LCSDB.user().is) {

          _app.helpers.checkUserCollision();

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
                source = _app.helpers.convertFileSource(file, source);

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

                          _app.helpers.notyOK('Saved!');

                          // let modified = new Date().valueOf();
                          // _LCSDB.user().get(worldType).get(worldName).get(file).get('modified').put(modified);
                        }
                      })
                    }
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

    })
  }


  async generateFrontPage() {

    let infoEl = document.createElement("div");
    infoEl.setAttribute("id", "indexPage");
    //infoEl.classList.add("mdc-typography");

    let lang = _LangManager.locale;

    let infoElHTML = await _app.helpers.getHtmlText('/web/locale/' + lang + '/index.html');
    infoEl.innerHTML = infoElHTML;
    document.body.appendChild(infoEl);

  }

  async loadIndexLibs() {

    return loadjs([
      '/lib/ui/cell.js',
      '/lib/ui/treeview/treeview.min.css',
      '/lib/ui/treeview/treeview.min.js',
      '/lib/ui/mdc/dist/material-components-web.min.css',
      '/lib/ui/mdc/dist/material-components-web.min.js',
      '/lib/ui/mdc.css',
      '/lib/ui/ace/ace.js',
      '/lib/ui/drag-drop.js',
      '/lib/buffer5.6.0.min.js',
    ], {
      async: false,
      returnPromise: true
    })
  }


  generalIndex() {

    let p = new Promise(res => res())
    .then(res=>{
      return _app.loadIndexLibs();
    })
    .then(res=>{
      document.querySelector('body').classList.add("mdc-typography");
      mdc.autoInit();
    })
    return p
  }

  HandleIndex() {

    console.log("INDEX");

    //window._app.hideUIControl();
    _app.generateFrontPage();

    _app.generalIndex().then(res=>{
      if (!_app.indexApp) {
        _app.indexApp = new IndexApp('index');
        window._app.hideProgressBar();
      }
    })

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

  HandleParsableRequestGenID(ctx) {

    let app = window._app;
    console.log(ctx.params);
    let user = ctx.params.user;
    let space = ctx.params.space;
    var pathname = ctx.pathname;

    //await app.setUserPaths(user);

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

    let vwfApp = {}
    //await app.setUserPaths(user);
    _app.helpers.getUserPub(user).then(function (res) {
      if (res)
        window._LCS_WORLD_USER = {
          alias: user,
          pub: res
        }
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

      let fileConf = val['index_vwf_config_json'];
      vwfApp.conf = {};

      if (fileConf) {
        let config = JSON.parse(fileConf);
        vwfApp.conf = config
      }

      let infoFile = val['info_json'];
      let infoSettings = infoFile ? JSON.parse(infoFile).info.settings: null;
      if(infoSettings){
      let manualSettings = localStorage.getItem('lcs_app_manual_settings');
      if (manualSettings) {
        let manualConf = JSON.parse(manualSettings);
        vwfApp.conf.model = manualConf.model;
        vwfApp.conf.view = manualConf.view;
      }
    } 

      //check & set default proxy for world
      vwfApp.proxy = val.proxy ? val.proxy : _LCS_WORLD_USER.pub

      // Try to load all required docs from Gun DB...
      let promises = []

      let worldPromise = new Promise(res => _LCSDB.user(_LCS_WORLD_USER.pub).get('worlds').get(space).load(res));
      promises.push(worldPromise);

      if (savename) {
        let entryPath = 'savestate_/' + space + '/' + savename + '_vwf_json';
        let savePromise = new Promise(res => _LCSDB.user(_LCS_WORLD_USER.pub).get('documents').get(space).path(entryPath).load(res, { wait: 400 }));
        promises.push(savePromise);
      }

      let proxyPromise = new Promise(res => _LCSDB.user(vwfApp.proxy).get('proxy').load(res, { wait: 400 }));
      promises.push(proxyPromise);

      return Promise.all(promises)


    }).then(res => {
      //Load vwf_view Document
      let dbPath = _app.helpers.appName + '_js';
      vwfApp.doc = res[0][dbPath];
      //Load libs for selected config drivers
      let libs = app.getLibsForConfig(vwfApp.conf);
      if(libs.length !== 0)
          return app.loadAppLibs(libs); 
      
      return 'nodriver'

    })
    .then(res => {
      //Load VWF libs
        return app.loadVWF();
    }).then(res => {

      let connectionConf = {
        luminary: _app.isLuminary,
        luminaryGlobalHB: _app.isLuminaryGlobalHB,
        luminaryGlobalHBPath: _app.luminaryGlobalHBPath
      }

       //Load main VWF app
      window.vwf = new VWF(vwfApp.conf, vwfApp.proxy, vwfApp.doc, connectionConf)
      let userLibraries = { model: {}, view: {} };
      let application = undefined;

      vwf.loadConfiguration(application, userLibraries, null);
    })

  }

  getLibsForConfig(conf){

    //Load not ES6 standard libs before driver loads
    //Use import in drivers by default

    const confLibsDefaults = {
      '/drivers/model/aframe':[
          '/drivers/model/aframe/aframe-master.js',
          '/drivers/model/aframe/addon/SkyShader.js',
          '/drivers/model/aframe/addon/BVHLoader.js',
          '/drivers/model/aframe/addon/TransformControls.js',
          '/drivers/model/aframe/addon/THREE.MeshLine.js',
          '/drivers/model/aframe/addon/three/BufferGeometryUtils.js',
          '/drivers/model/aframe/addon/virtualgc/virtual-gamepad-controls.css',
          '/drivers/model/aframe/addon/virtualgc/nipplejs.js',
          '/drivers/model/aframe/addon/aframe-sun-sky.min.js',
          '/drivers/model/aframe/extras/aframe-extras.loaders.min.js',
          '/drivers/model/aframe/extras/aframe-extras.controls.min.js',
          '/drivers/model/aframe/addon/aframe-teleport-controls.js',
          '/drivers/model/aframe/kframe/aframe-aabb-collider-component.min.js',
          '/drivers/model/aframe/addon/aframe-interpolation.js',
          '/drivers/model/aframe/addon/aframe-components.js'
      ],

      '/drivers/view/webrtc': [
        '/drivers/view/webrtc/adapter-latest.js'
      ],
      '/drivers/view/editor': [
        '/lib/ui/cell.js',
        '/lib/ui/treeview/treeview.min.css',
        '/lib/ui/treeview/treeview.min.js',
        '/lib/ui/mdc/dist/material-components-web.min.css',
        '/lib/ui/mdc/dist/material-components-web.min.js',
        '/lib/ui/mdc.css',
        '/lib/ui/ace/ace.js',
        '/lib/ui/screenfull/screenfull.min.js',
        '/lib/ui/drag-drop.js',
        '/lib/buffer5.6.0.min.js',
        '/drivers/view/editor/draggabilly/draggabilly.pkgd.js',
        '/drivers/view/editor/colorpicker/colorpicker.min.js',
        '/drivers/view/editor/colorpicker/themes.css',
        '/drivers/view/editor/editorLive.css'
      ],
        '/drivers/view/aframe-ar-driver':[
          '/drivers/view/arjs/aframe-ar.js'
      ],
      '/drivers/view/lego-boost':[
        '/drivers/view/lego-boost/bundle.js'
      ],
      '/drivers/view/osc':[
        '/drivers/view/oscjs/osc-browser.min.js'
      ]
    }


    var appLibs = [];

    Object.keys(conf.model).concat(Object.keys(conf.view)).forEach(el => {
      let driver = confLibsDefaults[el];
      if(driver)
        appLibs = appLibs.concat(confLibsDefaults[el])
    });

    return appLibs
  }


  async loadVWF() {

    return loadjs([
      '/lib/async.min.js',
      '/lib/ohm/ohm.min.js',
      '/lib/qheap.js',
      '/lib/lively.vm_standalone.js',
      '/lib/crypto.js',
      '/lib/md5.js',
      '/lib/alea.js',
      '/lib/mash.js'
    ], {
      async: false,
      returnPromise: true
    })
  }


  async loadAppLibs(libs) {

    return loadjs(libs, {
      async: false,
      returnPromise: true
    });
  }

  //get DB application state information for reflector (called from VWF)

  async getApplicationState() {

    let dataJson = JSON.parse(localStorage.getItem('lcs_app'));
    if (dataJson) {
      if (!dataJson.path['instance']) return undefined;
    }

    let userAlias = _LCS_WORLD_USER.alias;

    let parsedRequest = dataJson.path;
    if (parsedRequest['private_path']) {

      var loadInfo = {
        application_path: parsedRequest.public_path,
        save_name: parsedRequest.private_path.split('/')[1]
      }
      var saveInfo = await this.loadSaveObject(loadInfo);
    }

    let loadObj = {
      loadInfo: loadInfo ? loadInfo : {},
      path: dataJson.path,
      saveObject: saveInfo,
      user: userAlias
    }

    localStorage.setItem('lcs_app', JSON.stringify(loadObj));

    console.log(loadObj);

    return loadObj
  }


  async loadSaveObject(loadInfo) {

    if (!loadInfo.save_name) {
      return undefined
    }

    let objName = "savestate_" + loadInfo['application_path'] + '/' + loadInfo['save_name'] + '_vwf_json';
    let worldName = this.helpers.appPath;

    let dbNode = _LCSDB.user(_LCS_WORLD_USER.pub).get('documents').get(worldName).get(objName);

    let saveObject = await new Promise(res => dbNode.load(res, { wait: 300 }));

    if (saveObject) {
      let saveInfo = (typeof (saveObject.jsonState) == 'object') ? saveObject.jsonState : JSON.parse(saveObject.jsonState);
      return saveInfo;
    }
    return undefined
  }

  async getProtoWorldFiles(userPub, worldName, date) {

    return (new Promise(res => _LCSDB.user(userPub).get('worlds').get(worldName).once(res))).then(res => {
      let worldFiles = Object.entries(res).filter(el => (el[0].includes('_json')) || (el[0].includes('_yaml')) || (el[0].includes('_html')) || (el[0].includes('_js')))
        .filter(el => (el[0] !== 'info_json'));
      console.log(worldFiles);
      return worldFiles
    });
  }

  get worldName() {
    return vwf.application().split('/')[1];
  }

  async cloneWorld(worldName, userName, name, currentState) {

    //if(worldName == name && userName == _LCSDB.user().is.alias

    var userPub = _LCSDB.user().is.pub;

    if (userName !== _LCSDB.user().is.alias) {
      userPub = await _app.helpers.getUserPub(userName);
    }

    let newOwner = _LCSDB.user().is.pub;

    let db = _LCSDB.user();
    let newWorldName = name ? name : 'world' + this.helpers.randId();
    let myWorlds = await (new Promise(res => db.get('worlds').load(res, { wait: 400 })));

    if (myWorlds) {
      let checkExist = Object.keys(myWorlds).filter(el => el == newWorldName);
      if (checkExist.length > 0 && myWorlds[newWorldName]) {
        _app.helpers.notyOK('World already exists!')
        return
      }
    }

    let created = new Date().valueOf();

    await _LCSDB.user(userPub).get('worlds').get(worldName).load(all => {

      let worldObj = Object.assign({}, all);

      worldObj.owner = newOwner;
      worldObj.parent = userName + '/' + worldName;
      worldObj.featured = true
      worldObj.published = true
      worldObj.created = created

      if (!all.proxy) {
        worldObj.proxy = userPub;
      } else {
        worldObj.proxy = all.proxy;
      }

      console.log(worldObj);

      let myWorld = _LCSDB.user().get('worlds').get(newWorldName).put({ id: newWorldName });
      myWorld.put(worldObj, function (res) {
        if (currentState) {
          _app.saveWorld(newWorldName);
        }
        _app.helpers.notyOK('World cloned!')
      });
    })
  }

  async saveWorld(wn) {

    let name = wn ? wn : _app.helpers.appPath;

    let proto = this.helpers.getWorldProto();
    _LCSDB.user().get('worlds').get(name).get('index_vwf_json').put(JSON.stringify(proto), res => {
      _app.helpers.notyOK('World current saved!')
    });

  }

  async saveState(filename) // invoke with the view as "this"
  {

    //var clients = this.nodes["http://vwf.example.com/clients.vwf"];

    // Save State Information
    //let filename = self.helpers.appPath;

    console.log("Saving: " + filename);
    var state = vwf.getState();
    state.nodes[0].children = {};

    var timestamp = state["queue"].time;
    timestamp = Math.round(timestamp * 1000);

    let jsonValuePure = _app.helpers.replaceFloatArraysInNodeDef(state);
    //remove all Ohm generated grammarsfrom state

    let jsonValue = _app.helpers.removeGrammarObj(jsonValuePure);
    var jsonState = JSON.stringify(jsonValue, null, '\t'); //JSON.stringify(jsonValue);

    let rootPath = this.helpers.getRoot();

    var inst = rootPath.inst;
    var root = rootPath.root;

    var json = jsonState;

    //var documents = this.db.user().get('documents');
    _LCSDB.user().get('documents').not(res => {
      _LCSDB.user().get('documents').put({ id: 'documents' })
    })

    var saveRevision = new Date().valueOf();

    var stateForStore = {
      "root": root,
      "filename": filename,
      "inst": inst,
      "timestamp": timestamp,
      "extension": ".vwf.json",
      "jsonState": json,
      "publish": true,
      "saveRevision": saveRevision
    };

    let stateObj = Object.assign({}, stateForStore);

    var docName = 'savestate_/' + root + '/' + filename + '_vwf_json';
    let myNewWorldState = _LCSDB.user().get('documents').get(root).get(docName).put({ 'id': docName });

    //_LCSDB.user().get('documents').get(root).get(docName).put(stateWithRev, function(res) {
    myNewWorldState.put(stateObj, function (res) {
      if (res) {
        _app.helpers.notyOK('Saved to ' + docName);
      }
    });

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

    NProgress.done();
    NProgress.remove();
    //TODO:

    // var progressbar = document.getElementById("load-progressbar");
    // if (progressbar) {
    //   progressbar.classList.remove("visible");
    //   progressbar.classList.remove("mdc-linear-progress--indeterminate");

    //   progressbar.classList.add("not-visible");
    //   progressbar.classList.add("mdc-linear-progress--closed");

    // }

  }

  showProgressBar() {

    //TODO:
    // let progressbar = document.getElementById("load-progressbar");
    // if (progressbar) {
    //   progressbar.classList.remove("not-visible");
    //   progressbar.classList.remove("mdc-linear-progress--closed");

    //   progressbar.classList.add("visible");
    //   progressbar.classList.add("mdc-linear-progress--indeterminate");
    // }

  }

  // SUPPORT of DELETE USER WORLDS & SAVE STATES (experimental)
  // TODO: manual garbage collection
  async deleteWorldState(worldName, stateName) {

    let db = _LCSDB.user();
    let stateEntry = 'savestate_/' + worldName + '/' + stateName + '_vwf_json';
    db.get('documents').get(worldName).get(stateEntry).put(null, res => { });

  }

  async deleteWorld(name, type) {

    let self = this;

    if (type == 'proto') {

      let worldName = name;
      //TODO check for states (ask for deleting all states first...)
      //delete states

      let db = _LCSDB.user();

      db.get('documents').once().map((res, k) => { if (k == worldName) return res }).once((res, k) => {


        if (res) {
          let worldStatesInfo = Object.entries(res).filter(el => el[0].includes('_info_vwf_json'));
          worldStatesInfo.map(el => {

            let saveName = el[0].split('/')[2].replace('_info_vwf_json', "");
            console.log(saveName);
            self.deleteWorldState(worldName, saveName)
            //let stateEntry = 'savestate_/' + k + '/' + saveName + '_vwf_json';
          })
        }


      })

      db.get('worlds').get(worldName).put(null, res => {
        let id = 'worldCard_' + _LCSDB.user().is.alias + '_' + worldName + '_';
        let doc = document.querySelector('#' + id);
        if (doc)
          doc._refresh({})
      })


    } else if (type == 'state') {

      let worldName = name.split('/')[0];
      let stateName = name.split('/')[2];

      await this.deleteWorldState(worldName, stateName);

    }
    app.helpers.notyOK("World Deleted!");
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
        if (!lists[name])
          lists[name] = {};
        lists[name][el[0]] = el[1]
      });

      // console.log(lists);

      Object.entries(lists).forEach(list => {
        listData[list[0]] = list[1];
      })
    }

    return listData
    // console.log(data)
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
        if (objEl) {
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


  async setNewProxyForWorld(worldName, proxyName) {

    if (_LCSDB.user().is) {
      let newProxy = await _app.helpers.getUserPub(proxyName)
      if (newProxy)
        _LCSDB.user().get('worlds').get(worldName).put({ 'proxy': newProxy })
    }
  }

}

export { App }