class IndexApp {
    constructor() {
        console.log("app constructor");

        this.worlds = {};
        this.language = _LangManager.language;

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
            this.parseAppInstancesData(msg)
        }
        socket.on('getWebAppUpdate', msg => parse.call(self, msg));
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


    initReflectorServer() {
        this.currentReflector = localStorage.getItem('lcs_reflector');
        if (!this.currentReflector) {
            localStorage.setItem('lcs_reflector', window.location.host);
            this.currentReflector = localStorage.getItem('lcs_reflector');
        }
    }


    async generateFrontPage() {

        let infoEl = document.createElement("div");
        infoEl.setAttribute("id", "info");

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

    async initApp() {

        let appEl = document.createElement("div");
        appEl.setAttribute("id", "app");

        let appElHTML = await _app.helpers.getHtmlText('/web/app.html');
        appEl.innerHTML = appElHTML;
        document.body.appendChild(appEl);

        this.initReflectorSelector();
        this.initDBSelector();
        this.initUser();
        this.initUserGUI();
        this.initWorldsListGUI();
        //this.getAppDetailsFromDB();

    }


    initUser() {

        _LCSDB.on('auth', (ack) => {

            if (ack.pub) {

                let alias = _LCSUSER.is.alias;
                let userEl = document.querySelector('#userGUI');
                userEl._status = 'Welcome ' + alias + '!';
                //userEl.style.backgroundColor = '#e6e6e6';   
                userEl.$update();
                document.querySelector('#worldGUI').$update();
                document.querySelector('#main').$update();

                _LCSUSER.get('profile').once(function (data) { console.log(data) })

                var el = document.getElementById("loginGUI");
                if (el) {
                    el.remove();
                }

                _LCSUSER.get('profile').not(function (key) {
                    let profile = { 'alias': alias };
                    _LCSUSER.get('profile').put(profile);
                })

                new Noty({
                    text: alias + ' is succesfully authenticated!',
                    timeout: 2000,
                    theme: 'mint',
                    layout: 'bottomRight',
                    type: 'success'
                }).show();

                //this.getAppDetailsFromUserDB();
            }
            console.log(_LCSUSER.is);
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
                                _app.indexApp.getAppDetailsFromDefaultDB('protos');

                            }
                        }),
                    window._app.widgets.buttonStroked(
                        {
                            "label": 'Default World States',
                            "onclick": function (e) {
                                e.preventDefault();
                                _app.indexApp.getAppDetailsFromDefaultDB('states');

                            }
                        })
                ];

                var guiUser = [];
                if (_LCSUSER.is) {
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
                if (_LCSUSER.is) {
                    gui = [
                        window._app.widgets.buttonRaised(
                            {
                                "label": 'Sign OUT',
                                "onclick": function (e) {
                                    _LCSUSER.leave().then(ack => {
                                        if (ack.ok == 0) {
                                            window.sessionStorage.removeItem('alias');
                                            window.sessionStorage.removeItem('tmp');
                                            window.location.reload(true);
                                        }
                                    });
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
                                    let alias = _LCSUSER.is.alias;
                                    page.redirect('/' + alias + '/worlds/protos');
                                    //_app.indexApp.getWorldsProtosFromUserDB(alias);
                                }
                            }),
                        window._app.widgets.buttonStroked(
                            {
                                "label": 'My World states',
                                "onclick": function (e) {
                                    e.preventDefault();
                                    let alias = _LCSUSER.is.alias;
                                    page.redirect('/' + alias + '/worlds/states');
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
                if (window.sessionStorage.getItem('alias')) {
                    this._alias = window.sessionStorage.getItem('alias')
                }
                if (window.sessionStorage.getItem('tmp')) {
                    this._pass = window.sessionStorage.getItem('tmp')
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
                                        $type: "span",
                                        class: "mdc-typography--headline5",
                                        $text: "Login: "
                                    },
                                    window._app.widgets.inputTextFieldOutlined({
                                        "id": 'aliasInput',
                                        "label": "Login",
                                        "value": this._alias,
                                        "type": "text",
                                        "init": function() {
                                                    this._aliasField = new mdc.textField.MDCTextField(this);
                                                }
                                    }),
                                    // {
                                    //     class: "mdc-text-field",
                                    //     $type: "span",
                                    //     $init: function() {
                                    //         this._aliasField = new mdc.textField.MDCTextField(this);
                                    //     },
                                    //     $components: [
                                    //         {
                                    //             class: "mdc-text-field__input prop-text-field-input mdc-typography--headline6",
                                    //             $type: "input",
                                    //             type: "text",
                                    //             value: this._alias
                                    //         }

                                    //     ]

                                    // }

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
                                        "init": function() {
                                            this._passField = new mdc.textField.MDCTextField(this);
                                        }
                                    }),
                                    // {
                                    //     class: "mdc-text-field",
                                    //     $type: "span",
                                    //     $init: function() {
                                    //         this._passField = new mdc.textField.MDCTextField(this);
                                    //     },
                                    //     $components: [
                                    //         {
                                    //             class: "mdc-text-field__input prop-text-field-input mdc-typography--headline6",
                                    //             $type: "input",
                                    //             type: "password",
                                    //             value: this._pass
                                    //         }

                                    //     ]

                                    // }

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
                                                    _LCSUSER.create(alias, pass,
                                                        (ack) => {
                                                            if (!ack.wait) { }
                                                            if (ack.err) {
                                                                console.log(ack.err)
                                                                return ack.err
                                                            };
                                                            if (ack.pub) {
                                                                _LCSUSER.auth(alias, pass);
                                                                _LCSDB.get('users').get(alias).put({
                                                                    'alias': alias,
                                                                    'pub': ack.pub
                                                                });
                                                            }
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
                                                _LCSUSER.auth(this._aliasField.value, this._passField.value, ack => {

                                                    if (ack.err) {
                                                        new Noty({
                                                            text: ack.err,
                                                            timeout: 2000,
                                                            theme: 'mint',
                                                            layout: 'bottomRight',
                                                            type: 'error'
                                                        }).show();

                                                    }
                                                });
                                            }
                                        })


                                ]
                            }

                        ]
                    }
                ]
            }

        }

        document.querySelector("#userLobby").$cell({
            id: "userLobby",
            $cell: true,
            $type: "div",
            $components: [userGUI, loginGUI, _app.widgets.divider, worldGUI]
        }
        );
    }

    initReflectorSelector() {

        const ref = document.querySelector('#currentReflector');
        ref.value = window._app.reflectorHost;

        const reflectorSelect = document.querySelector('#reflectorSelect');
        mdc.textField.MDCTextField.attachTo(reflectorSelect);
        reflectorSelect.addEventListener('change', function (e) {
            console.log(e.target.value);
            let config = JSON.parse(localStorage.getItem('lcs_config'));
            config.reflector = e.target.value;
            localStorage.setItem('lcs_config', JSON.stringify(config));
            window.location.reload(true);
        });
    }

    initDBSelector() {

        const ref = document.querySelector('#currentdb');
        ref.value = window._app.dbHost;

        const dbSelect = document.querySelector('#dbSelect');
        mdc.textField.MDCTextField.attachTo(dbSelect);
        dbSelect.addEventListener('change', function (e) {
            console.log(e.target.value);

            let config = JSON.parse(localStorage.getItem('lcs_config'));
            config.dbhost = e.target.value;

            localStorage.setItem('lcs_config', JSON.stringify(config));
            window.location.reload(true);
        });
    }

    parseAppInstancesData(data) {

        if (data == "{}") {
            var el = document.querySelector(".instance");
            if (el) {
                var topEl = el.parentNode;
                topEl.removeChild(el);
            }
            // let removeElements = elms => Array.from(elms).forEach(el => el.remove()); 
        }

        let jsonObj = JSON.parse(data);
        var parsed = {};
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

        if (Object.entries(this.worlds).length !== 0)
            document.querySelector("#main")._emptyLists();

        for (var prop in parsed) {
            var name = prop;
            let obj = Object.entries(parsed[prop]);
            var lists = {};
            obj.forEach(el => {
                let sotSave = prop;

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

                let element = document.getElementById(list[0] + 'List');
                if (element) {
                    element._setListData(list[1]);
                }
            })
        }
        // console.log(data)
    }


    initWorldsListGUI() {

        var self = this;
        let worldsListGUI = {

            $cell: true,
            $type: "div",
            id: "main",
            _status: "",
            _jsonData: {},
            _emptyLists: function () {
                Object.entries(this._jsonData).forEach(function (element) {
                    //console.log(element);
                    let el = document.getElementById(element[0] + 'List');
                    if (el)
                        el._setListData({});
                });
            },
            $init: function () {
                this._jsonData = {} //data//JSON.parse(data);
            },
            _makeWorldCard: function (m) {
                let langID = localStorage.getItem('krestianstvo_locale');
                var appInfo = m
                if (langID) {
                    if (m[1][langID]) {
                        appInfo = [m[0], m[1][langID], m[1].user, m[1].type]
                    }
                }
                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                    $components: [
                        this._worldCardDef(appInfo)
                    ]
                }

            },
            $update: function () {
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
                                                $text: this._status
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: Object.entries(this._jsonData).map(this._makeWorldCard)
                            }
                        ]

                    },


                ]
            },
            _worldCardDef: function (desc) {

                var userGUI = [];

                if (desc[3] == 'proto') {
                    userGUI.push(

                        {
                            $type: "a",
                            class: "mdc-button mdc-button--compact mdc-card__action",
                            $text: "States",
                            onclick: function (e) {
                                //console.log('clone');
                                self.showOnlySaveStates(desc[0], desc[2]);
                                //self.refresh();
                            }
                        }
                    )
                }

                if (_LCSUSER.is) {

                    if (_LCSUSER.is.alias == desc[2]) {
                        userGUI.push(
                            {
                                $type: "a",
                                class: "mdc-button mdc-button--compact mdc-card__action",
                                $text: "Edit info",
                                //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                onclick: function (e) {
                                    //'/:user/:type/:name/edit/:file'
                                    if (desc[3] == 'proto') {
                                        window.location.pathname = "/" + desc[2] + '/proto/' + desc[0] + '/edit/info_json'
                                    } else if (desc[3] == 'saveState') {
                                        let names = desc[0].split('/');
                                        let filename = ('savestate_/' + names[0] + '/' + names[2] + '_info_vwf_json').split('/').join("~");
                                        window.location.pathname = "/" + desc[2] + '/state/' + names[0] + '/edit/' + filename;
                                    }
                                    //self.refresh();
                                }
                            }
                        );

                        if (desc[3] == 'proto') {
                            userGUI.push(
                                {
                                    $type: "a",
                                    class: "mdc-button mdc-button--compact mdc-card__action",
                                    $text: "Edit proto",
                                    //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                    onclick: function (e) {
                                        window.location.pathname = "/" + desc[2] + '/proto/' + desc[0] + '/edit/index_vwf_yaml'
                                    }
                                }
                            );
                        }
                    }

                    if (desc[3] == 'proto') {
                        userGUI.push(
                            {
                                $type: "a",
                                class: "mdc-button mdc-button--compact mdc-card__action",
                                $text: self.language.t('clone proto'),//"clone",
                                onclick: function (e) {
                                    //console.log('clone');
                                    _app.cloneWorldPrototype(desc[0], desc[2]);
                                    //self.refresh();
                                }
                            }

                        )
                    } else if (desc[3] == 'saveState') {
                        // userGUI.push(
                        //     {
                        //         $type: "a",
                        //         class: "mdc-button mdc-button--compact mdc-card__action mdc-button--outlined",
                        //         $text: "Clone",
                        //         onclick: function (e) {
                        //             //console.log('clone');

                        //             //self.cloneWorldState(desc[0], desc[2]);

                        //             //self.refresh();
                        //         }
                        //     })
                    }

                }

                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-card world-card",
                    _appInfo: desc,
                    $components: [
                        {
                            $type: "section",
                            class: "mdc-card__media world-card__16-9-media",
                            $init: function () {
                                if (desc[1].imgUrl !== "") {
                                    this.style.backgroundImage = 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url(' + desc[1].imgUrl + ')';
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
                                    $text: desc[1].title
                                },
                                {
                                    $type: "h2",
                                    class: "mdc-card__subtitle mdc-theme--text-secondary-on-background",
                                    $text: desc[1].text
                                }
                            ]
                        },
                        {
                            $type: "section",
                            class: "mdc-card__actions",
                            $components: [
                                {
                                    $type: "a",
                                    class: "mdc-button mdc-button--compact mdc-card__action mdc-button--outlined",
                                    $text: self.language.t('start'),//"Start new",
                                    target: "_blank",
                                    href: "/" + desc[2] + '/' + desc[0],
                                    onclick: function (e) {
                                        self.refresh();
                                    }
                                }
                            ].concat(userGUI)
                        },

                        {
                            $type: "section",
                            class: "mdc-card__actions",
                            $components: [

                                {
                                    $type: "ul",
                                    _listData: {},
                                    _setListData: function (data) {
                                        this._listData = data;
                                    },
                                    class: "mdc-list mdc-list--two-line",
                                    'aria-orientation': "vertical",
                                    id: desc[0] + 'List',
                                    $update: function () {
                                        var connectText = {}

                                        let cardListData = Object.entries(this._listData).filter(el => el[1].user == this._appInfo[2]);

                                        if (cardListData.length !== 0) {
                                            connectText = {
                                                // $type: "span",
                                                // class: "mdc-theme--text-secondary",
                                                // $text: "...or connect to:"
                                            }
                                        }
                                        this.$components = [
                                            {
                                                $type: "hr",
                                                class: "mdc-list-divider"
                                            }
                                        ].concat(cardListData.map(this._worldListItem))
                                        //     [connectText]
                                        // }].concat(Object.entries(this._listData).map(this._worldListItem))


                                    },
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
                                                                    target: "_blank",
                                                                    href: window.location.protocol + "//" + window.location.host + "/" + m[1].user + m[0],
                                                                    onclick: function (e) {
                                                                        //self.refresh();
                                                                    }
                                                                },
                                                            ]
                                                        },
                                                        {
                                                            $type: "span",
                                                            class: "mdc-list-item__secondary-text",
                                                            $text: self.language.t('users') + m[1].clients
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        }

        document.querySelector("#main").$cell({
            $cell: true,
            $type: "div",
            $components: [worldsListGUI]
        })

    }

    async showOnlySaveStates(index, userAlias) {

        let userPub = await _LCSDB.get('users').get(userAlias).get('pub').once().then();

        var db = _LCSDB.user(userPub);

        if (_LCSUSER.is) {
            if (_LCSUSER.is.alias == userAlias)
                db = _LCSUSER;
        }

        this.worlds = {};
        document.querySelector("#main")._jsonData = Object.assign({}, this.worlds);
        document.querySelector("#main")._status = "Save states of the World: " + index + ' for user: ' + userAlias;
        document.querySelector("#main").$update();
        //let userAlias = _LCSUSER.is.alias;

        db.get('documents').get(index).once(save => {
            if (save) {
                let saves = Object.keys(save).filter(el => el.includes('_info_vwf_json'));
                console.log(saves);

                if (saves) {
                    saves.forEach(el => {
                        db.get('documents').get(index).get(el).once(res => {
                            if (res) {
                                let fileName = el.split('/')[2].replace('_info_vwf_json', "");
                                let world = JSON.parse(res.file);
                                let root = Object.keys(world)[0];
                                world[root].user = userAlias;
                                world[root].type = 'saveState';
                                this.worlds[index + '/load/' + fileName] = world[root];
                                document.querySelector("#main")._jsonData = Object.assign({}, this.worlds);
                            }
                        })
                    })
                }
            }
        })
    }

    async getWorldsProtosFromUserDB(userAlias) {

        let userPub = await _LCSDB.get('users').get(userAlias).get('pub').once().then();

        console.log('get user worlds for: ' + userAlias);
        this.worlds = {};
        document.querySelector("#main")._jsonData = Object.assign({}, this.worlds);

        if (!userPub) {
            document.querySelector("#main")._status = "no such user";
            document.querySelector("#main").$update();
        }

        if (userPub) {

            document.querySelector("#main")._status = "Worlds protos for: " + userAlias;
            document.querySelector("#main").$update();

            var db = _LCSDB.user(userPub);

            if (_LCSUSER.is) {
                if (_LCSUSER.is.alias == userAlias)
                    db = _LCSUSER;
            }

            db.get('worlds').map().once((w, index) => {

                if (w) {
                    db.get('worlds').get(index).get('info_json').once(res => {

                        if (res) {

                            let world = JSON.parse(res.file);
                            let root = Object.keys(world)[0];
                            world[root].user = userAlias;
                            world[root].type = 'proto';
                            this.worlds[index] = world[root];
                            document.querySelector("#main")._jsonData = Object.assign({}, this.worlds);
                        }

                    })

                }
            })
        }

    }


    async getWorldsFromUserDB(userAlias) {

        let userPub = await _LCSDB.get('users').get(userAlias).get('pub').once().then();

        console.log('get user worlds for: ' + userAlias);
        this.worlds = {};
        document.querySelector("#main")._jsonData = Object.assign({}, this.worlds);

        if (!userPub) {
            document.querySelector("#main")._status = "no such user";
            document.querySelector("#main").$update();
        }

        if (userPub) {

            document.querySelector("#main")._status = "Worlds states for: " + userAlias;
            document.querySelector("#main").$update();

            var db = _LCSDB.user(userPub);

            if (_LCSUSER.is) {
                if (_LCSUSER.is.alias == userAlias)
                    db = _LCSUSER;
            }


            db.get('worlds').map().once((w, index) => {

                if (w) {

                    db.get('documents').get(index).once(save => {
                        if (save) {
                            let saves = Object.keys(save).filter(el => el.includes('_info_vwf_json'));
                            console.log(saves);

                            if (saves) {

                                saves.forEach(el => {

                                    db.get('documents').get(index).get(el).once(res => {

                                        if (res) {
                                            let fileName = el.split('/')[2].replace('_info_vwf_json', "");
                                            let world = JSON.parse(res.file);
                                            let root = Object.keys(world)[0];
                                            world[root].user = userAlias;
                                            world[root].type = 'saveState';
                                            this.worlds[index + '/load/' + fileName] = world[root];
                                            document.querySelector("#main")._jsonData = Object.assign({}, this.worlds);

                                        }
                                    })
                                })
                            }
                        }
                    })
                }
            })
        }
    }


    async getAppDetailsFromDefaultDB(type) {

        let defaultUserPUB = await _LCSDB.get('lcs/app').path('pub').once().then();
        var userAlias = await _LCSDB.user(defaultUserPUB).get('alias').once().then();

        page.redirect('/' + userAlias + '/worlds/' + type);

    }

    async getAppDetailsFromDB() {

        let defaultUserPUB = await _LCSDB.get('lcs/app').path('pub').once().then();
        var userAlias = await _LCSDB.user(defaultUserPUB).get('alias').once().then();

        if (userAlias)
            this.getWorldsProtosFromUserDB(userAlias);
    }


    refresh() {
        // socket.emit('getWebAppUpdate', "");
    }


}
export { IndexApp }
    //export {getAppDetails, generateFrontPage, setLanguage, initLocale};