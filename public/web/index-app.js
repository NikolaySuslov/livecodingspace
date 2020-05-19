/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

//import page from '/lib/page.mjs';
//import { Header } from '/web/header.js';


class IndexApp {
    constructor(entry) {
        console.log("index app constructor");

        this.entry = entry;

        this.worlds = {};
        this.instances = {};

        if (!_app.isLuminary) {
            this.initReflectorConnection();
        }

        this.initHTML();


    }


    initReflectorConnection() {

        this.options = {

            query: 'pathname=' + window.location.pathname.slice(1,
                window.location.pathname.lastIndexOf("/")),
            secure: window.location.protocol === "https:",
            reconnection: false,
            path: '',
            transports: ['websocket']
        }

        //window.location.host
        var socket = io.connect(window._app.reflectorHost, this.options);

        const parse = (msg) => {
            this.parseOnlineData(msg)
        }
        socket.on('getWebAppUpdate', msg => parse.call(this, msg));
        socket.on("connect", function () {

            let noty = new Noty({
                text: 'Connected to Reflector!',
                timeout: 2000,
                theme: 'mint',
                layout: 'bottomRight',
                type: 'success'
            });
            noty.show();
        })

        socket.on('connect_error', function (err) {
            console.log(err);
            var errDiv = document.createElement("div");
            errDiv.innerHTML = "<div class='vwf-err' style='z-index: 10; position: absolute; top: 80px; right: 50px'>Connection error to Reflector!" + err + "</div>";
            document.querySelector('body').appendChild(errDiv);

            let noty = new Noty({
                text: 'Connection error to Reflector! ' + err,
                theme: 'mint',
                layout: 'bottomRight',
                type: 'error'
            });
            noty.show();

        });

    }

    initHTML() {

        let self = this;

        //first init from _app
        document.querySelector('head').innerHTML += '<link rel="stylesheet" href="/web/index-app.css">';


        //if(this.entry !== 'index'){
        import('/web/header.js').then(res => {
            let gui = new res.Header();
            gui.init();
        })
        // }

        import('/web/footer.js').then(res => {
            let gui = new res.Footer();
            gui.init();
        })



        //add HTML
        let entry = document.createElement("div");
        entry.setAttribute("id", 'app');
        document.body.appendChild(entry);

        let divs = ['appGUI', 'userLobby', 'worldsGUI'];
        divs.forEach(el => {
            let appEl = document.createElement("div");
            appEl.setAttribute("id", el);
            entry.appendChild(appEl);
        })

        document.querySelector("#worldsGUI").$cell({
            id: "worldsGUI",
            $cell: true,
            $type: "div",
            _comps: [],
            _wcards: {},
            $components: [],
            _refresh: function (comps) {
                //do update;
                //this._userAlias = user;
                this._comps = comps;
                this.$components = this._comps;
            },
            $init: function () {
                console.log('init comp...');
            },

            $update: function () {
                //do update;
                console.log('update me');
            }
        });

        //init CELL
        let userGUI = {
            $type: "div",
            id: "userGUI",
            // style:"background-color: #ffeb3b",
            class: "mdc-layout-grid mdc-layout-grid--align-left",
            _status: _l.t("welcome") + '!',//"Welcome!",
            $init: function () {
                //this._status = "Welcome!"
                //this._status = 'Welcome!';
                self.initUser();
                this._refresh(); //$update();
            },
            $update: function () { },
            _refresh: function () {

                var gui = {};

                if (_LCSDB.user().is) {
                    gui = [
                        window._app.widgets.buttonRaised(
                            {
                                "label": _l.t("sign out"), //'Sign OUT',
                                "onclick": function (e) {
                                    _LCSDB.user().leave();
                                    setTimeout(() => {
                                        window.location.reload(true);
                                    }, 1);

                                }
                            }),
                        {
                            $type: "p"
                        },
                        window._app.widgets.buttonStroked(
                            {
                                "label": _l.t("profile"),//'PROFILE',
                                "onclick": function (e) {
                                    e.preventDefault();
                                    //page("/profile")
                                    window.location.pathname = "/profile"
                                }
                            }),
                        {
                            $type: "p"
                        },
                        window._app.widgets.buttonStroked(
                            {
                                "label": _l.t("my world protos"),
                                "onclick": function (e) {
                                    e.preventDefault();
                                    let alias = _LCSDB.user().is.alias;
                                    window.location.pathname = '/' + alias + '/worlds/protos'
                                    //page('/' + alias + '/worlds/protos');
                                    //_app.indexApp.getWorldsProtosFromUserDB(alias);
                                }
                            }),
                        window._app.widgets.buttonStroked(
                            {
                                "label": _l.t("my world states"),
                                "onclick": function (e) {
                                    e.preventDefault();
                                    let alias = _LCSDB.user().is.alias;
                                    window.location.pathname = '/' + alias + '/worlds/states'
                                    //page('/' + alias + '/worlds/states');
                                    // page.redirect('/' + alias + '/worlds/states');
                                    //_app.indexApp.getWorldsFromUserDB(alias);       
                                }
                            })
                    ]
                }

                this.$components = [
                    {
                        $type: "h1",
                        class: "mdc-typography--headline3",
                        $text: this._status
                    }
                ].concat(gui)
            }
        }

        document.querySelector("#userLobby").$cell({
            id: "userLobby",
            $cell: true,
            $type: "div",
            $components: [],
            _comps: [],
            _refresh: function () {
                this.$components = this._comps.concat([userGUI, _app.widgets.getLoginGUI(), _app.widgets.divider, self.getLookWorlds()]);
            },
            $init: function () {
                //this._comps = self.initUserGUI()
                this._refresh();
            },
            $update: function () {
            }
        });
    }

    async allWorldsProtosForUser(userAlias) {

        let userPub = await _app.helpers.getUserPub(userAlias);
        //let db = _LCSDB.user(userPub);

        let doc = document.querySelector("#worldsGUI");

        var worlds = {};

        if (userPub) {
            worlds = this.createWorldsGUI('proto', userAlias, userPub)
        } else {

            worlds = {
                $type: 'div',
                $text: 'Could not find user with name: ' + userAlias,
                class: "mdc-typography--headline4"
            }
        }

        let components = [
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
                                        $type: "h1",
                                        class: "mdc-typography--headline4",
                                        $text: _l.t("protos for") + userAlias
                                    }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                $components: [worlds]
                            }
                        ]
                    }
                ]
            }
        ];

        doc._refresh(components);

    }

    async allWorldsStatesForUser(userAlias, worldName, elID) {

        let userPub = await _app.helpers.getUserPub(userAlias);
        //let db = _LCSDB.user(userPub);

        let doc = elID ? document.querySelector("#" + elID) : document.querySelector("#worldsGUI");

        var worlds = {};

        if (userPub) {
            if (!worldName) {
                worlds = this.createWorldsGUI('state', userAlias, userPub)
            } else {
                worlds = this.createWorldsGUI('state', userAlias, userPub, worldName)
            }

        } else {

            worlds = {
                $type: 'div',
                $text: 'Could not find user with name: ' + userAlias,
                class: "mdc-typography--headline4"
            }
        }

        let components = [
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
                                        $type: "h1",
                                        class: "mdc-typography--headline4",
                                        $text: _l.t("states for") + userAlias
                                    }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                $components: [].concat(worlds)
                            }
                        ]
                    }
                ]
            }
        ]

        doc._refresh(components);

    }


    authGUI() {

        let alias = _LCSDB.user().is.alias;
        let userEl = document.querySelector('#userGUI');
        userEl._status = _l.t("welcome") +', ' + alias + '!';
        //userEl.style.backgroundColor = '#e6e6e6';   
        userEl._refresh(); //$update();

        //_LCSDB.user().get('profile').once(function (data) { console.log(data) })

        let el = document.getElementById("loginGUI");
        if (el) {
            el.remove();
        }

        _LCSDB.user().get('profile').not(function (key) {
            let profile = { 'alias': alias };
            _LCSDB.user().get('profile').put(profile);
        })

        // not load proxy by default
        // _LCSDB.user().get('proxy').not(res=>{
        //     console.log('user has no proxy');
        //     window._app.loadProxyDefaults();
        // });

        let actionsGUI = document.querySelector('#worldActionsGUI');
        if (actionsGUI)
            actionsGUI._refresh();

        new Noty({
            text: alias + ' is succesfully authenticated!',
            timeout: 2000,
            theme: 'mint',
            layout: 'bottomRight',
            type: 'success'
        }).show();

        if (this.entry == 'index') {
            //change for LiveCoding.space to 'app'
            //this.initWorldsProtosListForUserNew(alias);
            this.allWorldsProtosForUser(alias)
        }





    }



    initUser() {
        let self = this;

        if (_LCSDB.user().is) {
            self.authGUI()
        } else {
            _LCSDB.on('auth', function (ack) {
                if (ack.sea.pub) {
                    _app.helpers.checkUserCollision();
                    self.authGUI();
                }
                console.log(_LCSDB.user().is);
            });
        }


    }

    getLookWorlds() {
        let self = this;
        let lookWorlds =
        {
            $type: "div",
            id: "lookWorlds",
            class: "mdc-layout-grid mdc-layout-grid--align-left",
            _status: '',
            $init: function () {
                this._status = "init";
            },
            $update: function () {

                //change for LiveCoding.space site 'app'
                let defaultName = '';

                let guiForAll = [
                    {
                        $type: "div",
                        style: "margin-top: 20px;",
                        _userName: null,
                        _userNameField: null,
                        $components:
                            [

                                _app.widgets.inputTextFieldOutlined({
                                    "id": 'worldsUserName',
                                    "label": _l.t("enter user name"),
                                    "value": defaultName,
                                    "type": "text",
                                    "init": function () {
                                        this._userNameField = new mdc.textField.MDCTextField(this);
                                    }
                                }),
                                _app.widgets.p,
                                // {
                                //     $type: "a",
                                //     class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                //     $text: 'World Protos', //self.language.t('set proxy'),//"clone",
                                //     onclick: function (e) {
                                //         //console.log('clone');
                                //         let searchName = this._userNameField.value;
                                //         self.initWorldsProtosListForUser(searchName);
                                //     }
                                // },
                                // {
                                //     $type: "a",
                                //     class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                //     $text: 'World States', //self.language.t('set proxy'),//"clone",
                                //     onclick: function (e) {
                                //         //console.log('clone');
                                //         let searchName = this._userNameField.value;
                                //         self.initWorldsStatesListForUser(searchName);
                                //     }
                                // }
                                _app.widgets.buttonRaised(
                                    {
                                        "label":  _l.t("world protos"),
                                        "onclick": function (e) {
                                            e.preventDefault();
                                            //page("/app/worlds/protos")
                                            let searchName = this._userNameField.value;
                                            if (searchName !== "")
                                                window.location.pathname = "/" + searchName + "/worlds/protos"
                                            //_app.indexApp.getAppDetailsFromDefaultDB('protos');

                                        }
                                    }),
                                _app.widgets.space,
                                _app.widgets.buttonRaised(
                                    {
                                        "label": _l.t("world states"),
                                        "onclick": function (e) {
                                            e.preventDefault();
                                            //page("/app/worlds/states")
                                            let searchName = this._userNameField.value;
                                            if (searchName !== "")
                                                window.location.pathname = "/" + searchName + "/worlds/states"
                                            //_app.indexApp.getAppDetailsFromDefaultDB('states');

                                        }
                                    })

                            ]
                    },
                    // window._app.widgets.buttonStroked(
                    //     {
                    //         "label": 'Default World Protos',
                    //         "onclick": function (e) {
                    //             e.preventDefault();
                    //             //page("/app/worlds/protos")
                    //             window.location.pathname = "/app/worlds/protos"
                    //             //_app.indexApp.getAppDetailsFromDefaultDB('protos');

                    //         }
                    //     }),
                    // window._app.widgets.buttonStroked(
                    //     {
                    //         "label": 'Default World States',
                    //         "onclick": function (e) {
                    //             e.preventDefault();
                    //             //page("/app/worlds/states")
                    //             window.location.pathname = "/app/worlds/states"
                    //             //_app.indexApp.getAppDetailsFromDefaultDB('states');

                    //         }
                    //     })
                ];

                this.$components = [
                    {
                        $type: "h1",
                        class: "mdc-typography--headline4",
                        $text: _l.t("show worlds")//"Looking for Worlds made by other Users!"
                    }
                ].concat(guiForAll, _app.widgets.p)
            }
        }
        return lookWorlds
    }



    refresh() {
        // socket.emit('getWebAppUpdate', "");
    }


    parseOnlineData(data) {

        let parcedData = _app.parseAppInstancesData(data);

        //if (Object.entries(parcedData).length !== 0)
        let onlineGUIs = document.querySelectorAll('.online');

        onlineGUIs.forEach(function (item) {
            item._refresh(parcedData)
        });

    }

    createWorldCard(worldType, userAlias, userPub, worldName, id, type, cb) {
        let self = this;

        let db = _LCSDB.user(userPub);

        let onlineGUI = {
            $cell: true,
            id: "onlineGUI_" + id,
            class: "online",
            $type: "div",
            _instances: {},
            _worldListItem: function (m) {
                return {
                    $type: "li",
                    class: "mdc-list-item",
                    $components: [
                        {
                            $type: "span",
                            class: "world-link mdc-list-item__text",
                            $components: [
                                {
                                    $type: "span",
                                    class: "mdc-list-item__primary-text",
                                    $components: [
                                        {
                                            $type: "a",
                                            $text: m[0],
                                            //target: "_blank",
                                            // href: window.location.protocol + "//" + window.location.host + "/" + m[1].user + m[0],
                                            onclick: function (e) {
                                                self.checkForManualSettings();
                                                window.location.pathname = "/" + m[1].user + m[0];
                                                //self.refresh();
                                            }
                                        },
                                    ]
                                },
                                {
                                    $type: "span",
                                    class: "mdc-list-item__secondary-text",
                                    $text: _app.isLuminary ? _LangManager.language.t('users') + Object.keys(m[1].clients).length : _LangManager.language.t('users') + m[1].clients
                                }
                            ]
                        }
                    ]
                }
            },
            $components: [],
            _refresh: function (data) {
                if (data) {
                    if (Object.entries(data).length !== 0) {
                        if (this._worldInfo) {
                            let insts = Object.entries(data).filter(el => el[0] == this._worldInfo.worldName);
                            if (insts.length !== 0)
                                this._instances = insts[0][1];
                        }
                    } else {
                        this._instances = {}
                    }

                }

            },
            $init: function () {

                if (_app.isLuminary) {
                    let luminaryPath = _app.luminaryPath;
                    let ref = _LCSDB.get(luminaryPath);
                    setInterval(function () {

                        ref.get('allclients').once().map().once(res => {

                            if (res) {
                                if (res.id) {
                                    let clientTime = Gun.state.is(res, 'live');
                                    let now = Gun.time.is();

                                    if (now - clientTime < 10000) {
                                        let instance = res.user + res.instance;
                                        //let data = JSON.stringify({[res.instance]: {instance: instance, clients: {}, user: res.user, loadInfo: {}}});
                                        //console.log(data);
                                        if (!self.instances[res.instance]) {
                                            self.instances[res.instance] = { id: res.instance, instance: instance, clients: { [res.id]: res }, user: res.user, loadInfo: {} }
                                        } else {
                                            self.instances[res.instance].clients[res.id] = res
                                        }
                                        let data = JSON.stringify(self.instances);
                                        self.parseOnlineData(data);

                                    } else {
                                        if (self.instances[res.instance]) {
                                            delete self.instances[res.instance].clients[res.id];
                                            if (Object.keys(self.instances[res.instance].clients).length == 0) {
                                                delete self.instances[res.instance];
                                                self.parseOnlineData(JSON.stringify({}));
                                            }
                                        }

                                        //ref.get('instances').get(res.instance).get(res.id).put(null);
                                    }

                                }
                            }
                        }
                        )
                    }, 5000);


                }

                this._refresh();
            },
            $update: function () {
                if (this._instances) {
                    let cardListData = Object.entries(this._instances).filter(el => el[1].user == this._worldInfo.userAlias);
                    this.$components = [
                        {
                            $type: "hr",
                            class: "mdc-list-divider"
                        }
                    ].concat(cardListData.map(this._worldListItem))
                }

            }
        }


        return {
            $cell: true,
            id: 'worldCard_' + id,
            $type: "div",
            _worldName: "",
            _worldInfo: {},
            _refresh: function (data) {
                this._worldInfo = data;
                this.$components = [this._updateCard()]
            },
            $init: function () {
                this._worldName = worldName;

                if (type == 'min') {
                    if (worldType == 'proto') {

                        db.get('worlds').get(this._worldName).path('info_json').on((res) => {
                            if (res) {

                                if (res.file) {
                                    let doc = {
                                        'worldName': this._worldName,
                                        'created': undefined,
                                        'modified': undefined,
                                        'type': 'proto',
                                        'userAlias': userAlias,
                                        'info': { title: 'Need to repair!' }
                                    }
                                    this._refresh(doc);
                                    return
                                }

                                console.log(res);

                                let worldDesc = JSON.parse(res);

                                let root = Object.keys(worldDesc)[0];
                                var appInfo = worldDesc[root]['en'];

                                let langID = localStorage.getItem('krestianstvo_locale');
                                if (langID) {
                                    appInfo = worldDesc[root][langID]
                                }

                                let doc = {
                                    'worldName': this._worldName,
                                    'created': undefined,
                                    'modified': undefined,
                                    'type': 'proto',
                                    'userAlias': userAlias,
                                    'info': appInfo
                                }
                                this._refresh(doc);

                                //callback
                                if (cb)
                                    cb(doc);
                            }
                        })
                    } else if (worldType == 'state') {
                        let pathName = 'savestate_/' + this._worldName.protoName + '/' + this._worldName.stateName + '_info_vwf_json';
                        db.get('documents').get(this._worldName.protoName).path(pathName).on((res) => {

                            if (res) {

                                if (res.file) {
                                    let doc = {
                                        'worldName': this._worldName.protoName + '/load/' + this._worldName.stateName,
                                        'created': undefined,
                                        'modified': undefined,
                                        'type': 'state',
                                        'userAlias': userAlias,
                                        'info': { title: 'Need to repair!' }
                                    }
                                    this._refresh(doc);
                                    return
                                }


                                console.log(res);

                                let worldDesc = JSON.parse(res);

                                let root = Object.keys(worldDesc)[0];
                                var appInfo = worldDesc[root]['en'];

                                let langID = localStorage.getItem('krestianstvo_locale');
                                if (langID) {
                                    appInfo = worldDesc[root][langID]
                                }

                                let doc = {
                                    'worldName': this._worldName.protoName + '/load/' + this._worldName.stateName,
                                    'created': undefined,
                                    'modified': undefined,
                                    'type': 'saveState',
                                    'userAlias': userAlias,
                                    'info': appInfo
                                }
                                this._refresh(doc);

                                //callback
                                if (cb)
                                    cb(doc);
                            }
                        })

                    }



                } else if (type == 'full') {

                    if (worldType == 'proto') {
                        db.get('worlds').get(this._worldName).on((res) => {
                            if (res) {

                                if (res["info_json"]['#']) {
                                    let doc = {
                                        'worldName': this._worldName,
                                        'created': undefined,
                                        'modified': undefined,
                                        'type': 'proto',
                                        'userAlias': userAlias,
                                        'info': { title: 'Need to repair!' }
                                    }
                                    this._refresh(doc);
                                    //   if(cb)
                                    //     cb(doc);

                                    return
                                }



                                console.log(res);

                                let worldDesc = JSON.parse(res['info_json']);


                                let root = Object.keys(worldDesc)[0];
                                var appInfo = worldDesc[root]['en'];

                                let langID = localStorage.getItem('krestianstvo_locale');
                                if (langID) {
                                    appInfo = worldDesc[root][langID]
                                }

                                let settings = worldDesc[root]['settings'];


                                let doc = {
                                    'worldName': this._worldName,
                                    'created': res.created ? res.created : "",
                                    'modified': res.modified ? res.modified : "",
                                    'proxy': res.proxy,
                                    'type': 'proto',
                                    'userAlias': userAlias,
                                    'info': appInfo,
                                    'settings': settings
                                }
                                this._refresh(doc);

                                //callback
                                if (cb)
                                    cb(doc);
                            } else {
                                //no world
                                this._refresh({})
                            }
                        })

                    } else if (worldType == 'state') {

                        let pathNameInfo = 'savestate_/' + this._worldName.protoName + '/' + this._worldName.stateName + '_info_vwf_json';
                        db.get('documents').get(this._worldName.protoName).path(pathNameInfo).on((res) => {
                            if (res) {

                                if (res.file) {
                                    let doc = {
                                        'worldName': this._worldName.protoName + '/load/' + this._worldName.stateName,
                                        'created': undefined,
                                        'modified': undefined,
                                        'type': 'state',
                                        'userAlias': userAlias,
                                        'info': { title: 'Need to repair!' }
                                    }
                                    this._refresh(doc);
                                    return
                                }


                                console.log(res);
                                let worldDesc = JSON.parse(res);

                                let root = Object.keys(worldDesc)[0];
                                var appInfo = worldDesc[root]['en'];

                                let langID = localStorage.getItem('krestianstvo_locale');
                                if (langID) {
                                    appInfo = worldDesc[root][langID]
                                }

                                let settings = worldDesc[root]['settings'];

                                let doc = {
                                    'worldName': this._worldName.protoName + '/load/' + this._worldName.stateName,
                                    'created': undefined,
                                    'modified': undefined,
                                    'type': 'saveState',
                                    'userAlias': userAlias,
                                    'info': appInfo,
                                    'settings': settings
                                }
                                this._refresh(doc);

                                //callback
                                if (cb)
                                    cb(doc);
                            } else {
                                //no world
                                this._refresh({})
                            }
                        })

                    }


                }
            },
            $update: function () {
                //this.$components = [this._updateCard()]
            },
            _updateComps: function () {
                //console.log(this._worldInfo);

            },
            _updateCard: function () {
                let desc = this._worldInfo;

                if (!desc || Object.keys(desc).length == 0) {
                    return {
                        $type: "h1",
                        class: "mdc-typography--headline4",
                        $text: "ERROR: NO WORLD!"
                    }
                }


                let userGUI = [];
                let online = [];

                let cardInfo = {
                    "title": ""
                };


                if (type == "full") {

                } else {
                    userGUI.push({
                        $type: "a",
                        class: "mdc-button mdc-button--compact mdc-card__action mdc-button--outlined",
                        $text: _l.t("details"),
                        onclick: function (e) {
                            e.preventDefault();
                            window.location.pathname = "/" + desc.userAlias + '/' + desc.worldName + '/about'
                        }
                    });
                }

                if (desc.info.title !== 'Need to repair!') {
                    userGUI.push({
                        $type: "a",
                        class: "mdc-button mdc-button--raised mdc-card__action ",
                        $text: _LangManager.language.t('start'),//"Start new",
                        //target: "_blank",
                        //href: "/" + desc.userAlias + '/' + desc.worldName,
                        onclick: function (e) {
                            self.checkForManualSettings();
                            window.location.pathname = "/" + desc.userAlias + '/' + desc.worldName

                            //self.refresh();
                        }
                    });
                }



                let protoID = {}

                if (desc.type == 'saveState') {
                    cardInfo.title = desc.worldName.split('/')[2];

                    let protoIDComp = {

                        $type: 'div',
                        $components: [

                            {
                                $type: "span",
                                class: "mdc-card__subtitle mdc-theme--text-secondary-on-background",
                                $text: 'proto: '
                            },
                            {
                                $type: "input",
                                type: "text",
                                disabled: "",
                                style: "font-size:18px",
                                value: desc.worldName.split('/')[0]
                            }
                        ]
                    }

                    Object.assign(protoID, protoIDComp)

                }

                if (desc.type == 'proto') {
                    cardInfo.title = desc.worldName;

                    // userGUI.push(

                    //     {
                    //         $type: "a",
                    //         class: "mdc-button mdc-button--compact mdc-card__action",
                    //         $text: "States",
                    //         onclick: async function (e) {

                    //             e.preventDefault();
                    //             window.location.pathname = "/" + desc.userAlias + '/' + desc.worldName +'/about'
                    //             //console.log('clone');

                    //             // document.querySelector('#worldStatesGUI')._refresh({});
                    //             // let data = await _app.getSaveStates(desc.userAlias, desc.worldName);
                    //             // document.querySelector('#worldStatesGUI')._refresh(data);

                    //         }
                    //     }
                    // )
                }



                online.push(onlineGUI);

                if (!desc.info) {
                    desc.info = {
                        imgUrl: "/defaults/worlds/webrtc/webimg.jpg",
                        text: "..no text",
                        title: "..no title"
                    }
                }

                return {
                    $type: "div",
                    class: "mdc-card world-card",
                    $components: [
                        {
                            $type: "section",
                            class: "mdc-card__media world-card__16-9-media",
                            $init: function () {
                                if (desc.info.imgUrl !== "") {
                                    this.style.backgroundImage = 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url(' + desc.info.imgUrl + ')';
                                }
                            }
                        },
                        {
                            $type: "section",
                            class: "mdc-card__primary",
                            $components: [
                                {
                                    $type: "h1",
                                    class: "mdc-card__title mdc-card__title--large",
                                    $text: desc.info.title
                                },
                                {
                                    $type: "h2",
                                    class: "mdc-card__subtitle mdc-theme--text-secondary-on-background",
                                    $text: desc.info.text
                                },
                                {
                                    $type: "span",
                                    class: "mdc-card__subtitle mdc-theme--text-secondary-on-background",
                                    $text: 'id: '
                                },
                                {
                                    $type: "input",
                                    type: "text",
                                    disabled: "",
                                    style: "font-size:18px",
                                    value: cardInfo.title
                                },
                                {
                                    $type: "p",
                                },
                                protoID,
                                {
                                    $type: "p",
                                },
                                {
                                    $type: "span",
                                    class: "mdc-card__subtitle mdc-theme--text-secondary-on-background",
                                    $text: desc.created ? 'created: ' + (new Date(desc.created)).toUTCString() : ""
                                },
                                {
                                    $type: "p",
                                }
                                // ,{
                                //     $type: "span",
                                //     class: "mdc-card__subtitle mdc-theme--text-secondary-on-background",
                                //     $text: 'modified: ' + (new Date(desc[5])).toUTCString()
                                // }
                            ]
                        },
                        {
                            $type: "section",
                            class: "mdc-card__actions",
                            $components: [

                            ].concat(userGUI)
                        },

                        {
                            $type: "section",
                            class: "mdc-card__actions",
                            $components: [
                                {
                                    $type: 'div',
                                    $text: _l.t("online now") + ': '
                                }
                            ].concat(online)
                        }
                    ]
                }
            }
        }

    }

    createWorldsGUI(worldType, userAlias, userPub, worldName) {

        let self = this;

        let db = _LCSDB.user(userPub);

        var headerText = 'Worlds';

        if (worldType == 'state' && !worldName) {
            headerText = 'All World States for ' + userAlias;
        } else {
            headerText = worldName ? 'States for ' + worldName : 'All Worlds Protos'
        }

        let id = worldName ? worldName + '_' + userAlias : "allWorlds_" + userAlias
        //let headerText = worldName ? 'States for ' + worldName : 'All Worlds Protos'

        let worldCards = {
            $cell: true,
            id: id,
            $type: "div",
            $components: [],
            _cards: [],
            // _states: {},
            // _refresh: function (data) {
            //     this._states = data;
            // },
            $init: function () {

                console.log('init lab...');
                if (worldType == 'proto') {
                    db.get('worlds')
                        .map()
                        .on((res, k) => {
                            console.log('From world: ', k);
                            //let doc = document.querySelector('#'+ k);
                            if (res) {

                                let cardID = userAlias + '_' + k;
                                let doc = this._cards.filter(el => el.$components[0].id == 'worldCard_' + cardID)[0];

                                if (!doc) {
                                    doc = this._makeWorldCard(k, cardID);
                                    this._cards.push(doc);
                                }
                            }


                        })
                } else if (worldType == 'state') {
                    //get states

                    if (!worldName) {
                        console.log('get states');
                        db.get('documents')
                            .map()
                            .on((res, k) => {
                                if (k !== 'id') {
                                    console.log('From world: ', k);

                                    let worldStatesInfo = Object.entries(res).filter(el => el[0].includes('_info_vwf_json'));
                                    worldStatesInfo.map(el => {

                                        let saveName = el[0].split('/')[2].replace('_info_vwf_json', "");

                                        let stateEntry = 'savestate_/' + k + '/' + saveName + '_vwf_json';
                                        if (res[stateEntry]) {

                                            let cardID = userAlias + '_' + saveName + '_' + k;
                                            console.log(cardID, ' - ', el);

                                            let doc = this._cards.filter(el => el.$components[0].id == 'worldCard_' + cardID)[0];

                                            if (!doc) {
                                                doc = this._makeWorldCard({ protoName: k, stateName: saveName }, cardID);
                                                this._cards.push(doc);
                                            }
                                        }

                                    })
                                    //let saveName = el.stateName.split('/')[2].replace('_info_vwf_json', "");

                                }

                            })

                    } else {

                        console.log('get states for ' + worldName);
                        db.get('documents')
                            .map((res, k) => { if (k == worldName) return res })
                            .on((res, k) => {
                                if (k !== 'id') {

                                    console.log('From world: ', k);

                                    let worldStatesInfo = Object.entries(res).filter(el => el[0].includes('_info_vwf_json'));
                                    worldStatesInfo.map(el => {



                                        let saveName = el[0].split('/')[2].replace('_info_vwf_json', "");

                                        let stateEntry = 'savestate_/' + k + '/' + saveName + '_vwf_json';
                                        if (res[stateEntry]) {

                                            let cardID = userAlias + '_' + saveName + '_' + k;
                                            console.log(cardID, ' - ', el);

                                            let doc = this._cards.filter(el => el.$components[0].id == 'worldCard_' + cardID)[0];

                                            if (!doc) {
                                                doc = this._makeWorldCard({ protoName: k, stateName: saveName }, cardID);
                                                this._cards.push(doc);
                                            }

                                        }


                                    })
                                    //let saveName = el.stateName.split('/')[2].replace('_info_vwf_json', "");

                                }
                            })


                    }

                }


                //this._refresh();
            },
            _makeWorldCard: function (worldID, cardID) {
                //let cardID = userAlias + '_' + worldID//data[1].userAlias + '_' + data[1].worldName + '_' + data[0];
                let card = self.createWorldCard(worldType, userAlias, userPub, worldID, cardID, 'min');
                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                    $components: [card]
                }
            },
            $update: function () {
                // let cards = Object.entries(this._states)
                //     .filter(el => Object.keys(el[1]).length !== 0)
                //     .sort(function (el1, el2) {
                //         return parseInt(el2[1].created) - parseInt(el1[1].created)
                //     })
                //     .map(this._makeWorldCard);

                this.$components = [
                    {
                        $type: "div",
                        class: "mdc-layout-grid",
                        $components: [
                            // {
                            //     $type: "div",
                            //     class: "mdc-layout-grid__inner",
                            //     $components: [
                            //         {
                            //             $type: "div",
                            //             class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                            //             $components: [
                            //                 {
                            //                     $type: "H3",
                            //                     $text: headerText
                            //                 }
                            //             ]
                            //         }
                            //     ]
                            // },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: this._cards
                            }
                        ]

                    }


                ]
            }
        }

        return worldCards
    }


    checkForManualSettings() {
        console.log("check for manual settings");
        let manualSettings = localStorage.getItem('lcs_app_manual_settings');
        if (manualSettings) {
            localStorage.removeItem('lcs_app_manual_settings');
        }

        let el = document.querySelector('#runWorldGUI');
        if (el) {
            if (el._arSwitch.checked) {

                let arSettings = {
                    model: {
                        'vwf/model/aframe': null
                    },
                    view: {
                        'vwf/view/aframe': null,
                        'vwf/view/editor-new': null
                    }
                }

                localStorage.setItem('lcs_app_manual_settings', JSON.stringify(arSettings));
            }

            if (el._turnArOnSwitch.checked) {

                let arSettings = {
                    model: {
                        'vwf/model/aframe': null
                    },
                    view: {
                        'vwf/view/aframe': null,
                        'vwf/view/aframe-ar-driver': null
                    }
                }

                localStorage.setItem('lcs_app_manual_settings', JSON.stringify(arSettings));
            }


        }
    }


}
export { IndexApp as default }
    //export {getAppDetails, generateFrontPage, setLanguage, initLocale};