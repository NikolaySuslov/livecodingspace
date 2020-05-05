/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

//import page from '/lib/page.mjs';
import { Header } from '/web/header.js';


class IndexApp {
    constructor() {
        console.log("index app constructor");


        this.worlds = {};
        this.instances = {};
        //this.language = _LangManager.language;

        if (!_app.isLuminary) {
            this.initReflectorConnection();
        }


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

        let headerGUI = new Header();
        headerGUI.init();

        //add HTML
        let entry = document.createElement("div");
        entry.setAttribute("id", 'app');
        document.body.appendChild(entry);

        let divs = ['appGUI', 'userLobby', 'main', 'worldsGUI'];
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
            $refresh: function (comps) {
                //do update;
                //this._userAlias = user;
                this._comps = comps;
            },
            $init: function () {
                console.log('init comp...');
            },

            $update: function () {
                //do update;
                console.log('update me');
                this.$components = this._comps;
            }
        });

        //init CELL
        document.querySelector("#userLobby").$cell({
            id: "userLobby",
            $cell: true,
            $type: "div",
            $components: [],
            $update: function () {
                this.$components = self.initUserGUI()
            }
        });

    }

    async generateFrontPage() {

        let infoEl = document.createElement("div");
        infoEl.setAttribute("id", "indexPage");

        let lang = _LangManager.locale;

        let infoElHTML = await _app.helpers.getHtmlText('/web/locale/' + lang + '/index.html');
        infoEl.innerHTML = infoElHTML;
        document.body.appendChild(infoEl);

        document.querySelector('#ruLang').addEventListener('click', function (e) {
            _LangManager.locale = 'ru';
            window.location.reload(true);
        });

        document.querySelector('#enLang').addEventListener('click', function (e) {
            _LangManager.locale = 'en';
            window.location.reload(true);
        });

    }

    initApp() {

        // let appElHTML = await _app.helpers.getHtmlText('/web/app.html');
        // appEl.innerHTML = appElHTML;
        // document.body.appendChild(appEl);

        this.initUser();
        document.querySelector("#userLobby").$update();

        //this.initWorldsListGUI();
        //this.getAppDetailsFromDB();

    }

    async initWorldsProtosListForUser(userAlias) {
        let doc = document.querySelector("#worldsGUI");
        //doc.$components = [];
        let allInfo = await _app.getAllProtoWorldsInfoForUser(userAlias);//await this.getWorldsProtosListForUser(userAlias);

        let worlds = this.createWorldsGUI(userAlias);
        worlds._refresh(allInfo);

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
                                        $text: 'Worlds for ' + userAlias
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


        doc.$refresh(components);

        //initiate update world cards
        doc._wcards = worlds;
        doc._wcards.$update();

        //console.log(allInfo);

    }

    async initWorldsStatesListForUser(userAlias) {

        let doc = document.querySelector("#worldsGUI");
        //doc.$components = [];
        let allInfo = await _app.getAllStateWorldsInfoForUser(userAlias);//await this.getWorldsProtosListForUser(userAlias);

        let worlds = this.createWorldsGUI(userAlias, 'allStates');
        worlds._refresh(allInfo);
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
                                        $text: 'States for ' + userAlias
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

        doc.$refresh(components);

        //initiate update world cards
        doc._wcards = worlds;
        doc._wcards.$update();

        //console.log(allInfo);

    }


    initUser() {

        _LCSDB.on('auth', function (ack) {

            if (ack.sea.pub) {

                let alias = _LCSDB.user().is.alias;
                let userEl = document.querySelector('#userGUI');
                userEl._status = 'Welcome ' + alias + '!';
                //userEl.style.backgroundColor = '#e6e6e6';   
                userEl.$update();
                // document.querySelector('#worldGUI').$update();
                // document.querySelector('#main').$update();

                // _LCSDB.get('users').get(alias).not(function (res) {
                //     let userObj = {
                //         alias: alias,
                //         pub: ack.sea.pub
                //     }
                //     _LCSDB.get('users').get(alias).put(userObj);
                // })

                _LCSDB.user().get('profile').once(function (data) { console.log(data) })

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

                //this.getAppDetailsFromUserDB();
            }
            console.log(_LCSDB.user().is);
        });
    }

    initUserGUI() {

        let worldGUI =
        {
            $type: "div",
            id: "worldGUI",
            class: "mdc-layout-grid mdc-layout-grid--align-left",
            _status: '',
            $init: function () {
                this._status = "init";
            },
            $update: function () {
                let guiForAll = [
                    window._app.widgets.buttonStroked(
                        {
                            "label": 'Default World Protos',
                            "onclick": function (e) {
                                e.preventDefault();
                                //page("/app/worlds/protos")
                                window.location.pathname = "/app/worlds/protos"
                                //_app.indexApp.getAppDetailsFromDefaultDB('protos');

                            }
                        }),
                    window._app.widgets.buttonStroked(
                        {
                            "label": 'Default World States',
                            "onclick": function (e) {
                                e.preventDefault();
                                //page("/app/worlds/states")
                                window.location.pathname = "/app/worlds/states"
                                //_app.indexApp.getAppDetailsFromDefaultDB('states');

                            }
                        })
                ];

                var guiUser = [];
                if (_LCSDB.user().is) {
                    guiUser = []
                }

                this.$components = [
                    {
                        $type: "h1",
                        class: "mdc-typography--headline4",
                        $text: "Worlds list"
                    }
                ].concat(guiForAll).concat(guiUser)
            }
        }

        let luminaryFeature = {
            $cell: true,
            _luminarySwitch: null,
            $components: [
                {
                    $type: "p",
                    class: "mdc-typography--headline5",
                    $text: "Use Krestianstvo Luminary (experimental)"
                },
                {
                    $type: 'p'
                },
                _app.widgets.switch({
                    'id': 'forceLuminary',
                    'init': function () {
                        this._switch = new mdc.switchControl.MDCSwitch(this);
                        let config = localStorage.getItem('lcs_config');
                        this._switch.checked = JSON.parse(config).luminary;

                        // this._replaceSwitch = this._switch;

                    },
                    'onchange': function (e) {

                        if (this._switch) {
                            let chkAttr = this._switch.checked;//this.getAttribute('checked');
                            if (chkAttr) {
                                let config = JSON.parse(localStorage.getItem('lcs_config'));
                                config.luminary = true;
                                localStorage.setItem('lcs_config', JSON.stringify(config));
                                window.location.reload(true);
                                //this._switch.checked = false;
                            } else {
                                let config = JSON.parse(localStorage.getItem('lcs_config'));
                                config.luminary = false;
                                localStorage.setItem('lcs_config', JSON.stringify(config));
                                window.location.reload(true);
                            }
                        }
                    }
                }
                ),
                {
                    $type: 'label',
                    for: 'input-forceLuminary',
                    $text: 'On / Off'
                }

            ]
        }



        let userGUI =
        {
            $type: "div",
            id: "userGUI",
            // style:"background-color: #ffeb3b",
            class: "mdc-layout-grid mdc-layout-grid--align-left",
            _status: "",
            $init: function () {
                this._status = "Welcome!"
            },
            $update: function () {

                var gui = {};
                if (_LCSDB.user().is) {
                    gui = [
                        window._app.widgets.buttonRaised(
                            {
                                "label": 'Sign OUT',
                                "onclick": function (e) {
                                    _LCSDB.user().leave();
                                    setTimeout(() => {
                                        //window.sessionStorage.removeItem('alias');
                                        //window.sessionStorage.removeItem('tmp');
                                        window.location.reload(true);
                                    }, 1);

                                }
                            }),
                        {
                            $type: "p"
                        },
                        window._app.widgets.buttonStroked(
                            {
                                "label": 'PROFILE',
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
                                "label": 'My World protos',
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
                                "label": 'My World states',
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
                this.$components = [luminaryFeature,
                    _app.widgets.emptyDiv,
                    window._app.widgets.buttonRaised(
                        {
                            "label": 'Connection settings',
                            "onclick": function (e) {
                                e.preventDefault();
                                window.location.pathname = '/settings';
                            }
                        }), _app.widgets.emptyDiv,
                    _app.widgets.divider,
                    {
                        $type: "h1",
                        class: "mdc-typography--headline3",
                        $text: this._status
                    }
                ].concat(gui)
            }
        }

        let loginGUI =
        {
            $type: "div",
            id: "loginGUI",
            //style:"background-color: #efefef",
            class: "mdc-layout-grid mdc-layout-grid--align-left",
            _alias: null,
            _pass: null,
            _passField: null,
            _aliasField: null,
            _initData: function () {
                this._alias = '';
                this._pass = '';
                // if (window.sessionStorage.getItem('alias')) {
                //     this._alias = window.sessionStorage.getItem('alias')
                // }
                // if (window.sessionStorage.getItem('tmp')) {
                //     this._pass = window.sessionStorage.getItem('tmp')
                // }
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
                                        $type: "span",
                                        class: "mdc-typography--headline5",
                                        $text: "Login: "
                                    },
                                    window._app.widgets.inputTextFieldOutlined({
                                        "id": 'aliasInput',
                                        "label": "Login",
                                        "value": this._alias,
                                        "type": "text",
                                        "init": function () {
                                            this._aliasField = new mdc.textField.MDCTextField(this);
                                        }
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
                                        $text: "Password: "
                                    },
                                    window._app.widgets.inputTextFieldOutlined({
                                        "id": 'passwordInput',
                                        "label": "Password",
                                        "value": this._pass,
                                        "type": "password",
                                        "init": function () {
                                            this._passField = new mdc.textField.MDCTextField(this);
                                        }
                                    }),
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                $components: [
                                    window._app.widgets.buttonRaised(
                                        {
                                            "label": 'Sign UP',
                                            "onclick": function (e) {
                                                e.preventDefault();

                                                let alias = this._aliasField.value;
                                                let pass = this._passField.value

                                                if (pass.length < 7) {
                                                    new Noty({
                                                        text: "Your passphrase needs to be longer than 7 letters",
                                                        timeout: 2000,
                                                        theme: 'mint',
                                                        layout: 'bottomRight',
                                                        type: 'error'
                                                    }).show();
                                                } else {
                                                    //
                                                    _LCSDB.user().create(alias, pass,
                                                        function (ack) {
                                                            if (!ack.wait) { }
                                                            if (ack.err) {
                                                                console.log(ack.err)
                                                                return ack.err
                                                            };
                                                            if (ack.pub) {
                                                                let userObj = {
                                                                    'alias': alias,
                                                                    'pub': ack.pub
                                                                };
                                                                _LCSDB.get('users').get(alias).put(userObj);

                                                            }
                                                            _LCSDB.user().auth(alias, pass);
                                                        });

                                                }
                                            }
                                        }),
                                    {
                                        $type: "span",
                                        $text: " "
                                    },
                                    window._app.widgets.buttonRaised(
                                        {
                                            "label": 'Sign IN',
                                            "onclick": function (e) {
                                                e.preventDefault();
                                                let alias = this._aliasField.value;
                                                let pass = this._passField.value
                                                _app.helpers.authUser(alias, pass);
                                                // _LCSDB.user().auth.call(_LCSDB, alias, pass
                                                // //     , function(ack) {

                                                // //     if (ack.err) {
                                                // //         new Noty({
                                                // //             text: ack.err,
                                                // //             timeout: 2000,
                                                // //             theme: 'mint',
                                                // //             layout: 'bottomRight',
                                                // //             type: 'error'
                                                // //         }).show();

                                                // //     }
                                                //  //}
                                                //  );
                                            }
                                        })



                                ]
                            }

                        ]
                    }
                ]
            }

        }

        // document.querySelector("#userLobby").$cell({
        //     id: "userLobby",
        //     $cell: true,
        //     $type: "div",
        //     $components: [ 

        //         userGUI, loginGUI, _app.widgets.divider, worldGUI]
        // }
        // );

        return [userGUI, loginGUI, _app.widgets.divider, worldGUI]

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

    createWorldCard(id, type) {
        let self = this;

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
            _worldInfo: {},
            _refresh: function (data) {
                this._worldInfo = data
            },
            // _getWorldInfo: async function () {
            //     //get space for user
            //     let info = await _app.getWorldInfo(user, space);
            //     this._refresh(info);
            // },
            // _getStateInfo: async function () {
            //     //get space for user
            //     let info = await _app.getStateInfo(user, space, saveName);
            //     this._refresh(info);
            // },
            $init: function () {
                //get space for user
                // if (!saveName) {
                //     this._getWorldInfo();
                // } else {
                //     this._getStateInfo();
                // }
            },
            $update: function () {
                //console.log(this._worldInfo);
                this.$components = [this._updateCard()]
            },
            $components: [],
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
                        $text: "Details",
                        onclick: function (e) {
                            e.preventDefault();
                            window.location.pathname = "/" + desc.userAlias + '/' + desc.worldName + '/about'
                        }
                    });
                }

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


                if (desc.type == 'saveState') {
                    cardInfo.title = desc.worldName.split('/')[2];
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
                if(!desc.info){
                    desc.info = {
                        imgUrl: "/defaults/worlds/webrtc/webimg.jpg",
                        text: "..no text",
                        title: "..no title"
                    }
                }

                return {
                    $cell: true,
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
                                {
                                    $type: "span",
                                    class: "mdc-card__subtitle mdc-theme--text-secondary-on-background",
                                    $text: 'created: ' + (new Date(desc.created)).toUTCString()
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
                                    $text: 'online now: '
                                }
                            ].concat(online)
                        }
                    ]
                }
            }
        }

    }

    createWorldsGUI(userAlias, worldName) {
        let self = this;
        let id = worldName ? worldName + '_' + userAlias : "allWorlds_" + userAlias
        let headerText = worldName ? 'States for ' + worldName : 'All Worlds Protos'

        let worldCards = {
            $cell: true,
            id: id,
            $type: "div",
            $components: [],
            _states: {},
            _refresh: function (data) {
                this._states = data
            },
            $init: async function () {
                //this._refresh();
            },
            _makeWorldCard: function (data) {
                let cardID = data[1].userAlias + '_' + data[1].worldName + '_' + data[0];
                let card = self.createWorldCard(cardID, 'min');
                card._worldInfo = data[1];
                card.$update();
                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                    $components: [

                        card

                        //self.createWorldCard(data[1].userAlias, data[1].worldName, data[0])
                        //this._worldCardDef(appInfo)
                    ]
                }
                //console.log(data);
            },
            $update: function () {
                let cards = Object.entries(this._states)
                    .filter(el => Object.keys(el[1]).length !== 0)
                    .sort(function (el1, el2) {
                        return parseInt(el2[1].created) - parseInt(el1[1].created)
                    })
                    .map(this._makeWorldCard);

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
                                                $type: "H3",
                                                $text: headerText
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: cards
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