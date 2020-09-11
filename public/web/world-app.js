/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

//import page from '/lib/page.mjs';

class WorldApp {

    constructor(userAlias, worldName, saveName) {

        console.log("world app constructor");

        this.userAlias = userAlias;
        this.worldName = worldName;
        this.saveName = saveName;

        //this.worlds = {};
        this.language = _LangManager.language;

        let rootDoc = document.querySelector('#app');
        let el = document.createElement("div");
        el.setAttribute("id", "aboutWorld");
        rootDoc.appendChild(el);

    }


    async makeGUI(userPub) {

        let self = this;
        let user = { 'user': this.userAlias, pub: userPub };
        let space = this.worldName;
        let cardID = user.user + '_' + space + '_';

        let worldCardGUI = _app.indexApp.createWorldCard('proto', this.userAlias, userPub, space, cardID, "full", setWorldParameters); //createWorldCard(userAlias, userPub, worldName, id, type)

        //var runWorldGUI = {};


        function setWorldParameters(data) {

            //console.log(data);
            let actionsGUI = {
                $cell: true,
                _gen: "",
                id: "worldActionsGUI",
                $type: "div",
                $components: [],
                _worldInfo: {},
                _refresh: function () {

                    this._worldInfo = {
                        'userAlias': self.userAlias,
                        'worldName': self.saveName ? self.worldName + '/load/' + self.saveName : self.worldName,
                        'type': self.saveName ? 'saveState' : 'proto'
                    }

                    //    let worldCard = document.querySelector('#worldCard');
                    //    if(worldCard){
                    //        this._worldInfo = worldCard._worldInfo;
                    //    } 
                },
                $init: function () {
                    //if (_LCSDB.user().is) {
                    this._refresh();
                    //}

                },
                $update: function () {

                    let desc = this._worldInfo;
                    let userGUI = [];

                    // if(!desc){
                    //     this.$components = [];
                    //     return
                    // }

                    if (_LCSDB.user().is) {
                        if (_LCSDB.user().is.alias == desc.userAlias) {

                            userGUI.push(
                                {
                                    $type: "div",
                                    id: "tree",
                                    _tree: [],
                                    _treeComp: {},
                                    $init: function () {
                                        let selfComp = this;
                                        _LCSDB.user().get('worlds').get(desc.worldName).load(res => {
                                            // console.log(res);
                                            if (res) {
                                                selfComp._tree = [{
                                                    name: 'File sources: ',
                                                    children: []
                                                }];
                                                Object.keys(res).filter(el => el.includes('_js') || el.includes('_json')).forEach(el => {
                                                    selfComp._tree[0].children.push({
                                                        name: el
                                                    })
                                                })
                                                selfComp._treeComp = new TreeView(selfComp._tree, 'tree');
                                                selfComp._treeComp.on('select', function (evt) {
                                                    console.log(evt);
                                                    window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/' + evt.data.name
                                                });
                                            }
                                        })

                                    },
                                    $components: [

                                    ]
                                }
                            );

                            if (desc.type == 'proto') {

                                userGUI.push(
                                    { $type: "br" },
                                    {
                                        $type: "a",
                                        class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                        $text: "Delete",
                                        //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                        onclick: function (e) {
                                            if (window.confirm("Do you really want to DELETE world?")) {
                                                _app.deleteWorld(desc.worldName, 'proto');
                                            }

                                        }
                                    }
                                );


                                let proxyID = data.proxy;

                                userGUI.push(
                                    {
                                        $type: "div",
                                        style: "margin-top: 20px;",
                                        _proxyName: null,
                                        _proxyNameField: null,
                                        $components:
                                            [

                                                window._app.widgets.inputTextFieldOutlined({
                                                    "id": 'proxyName',
                                                    "label": proxyID,
                                                    "value": this._proxyName,
                                                    "type": "text",
                                                    "init": function () {
                                                        this._proxyNameField = new mdc.textField.MDCTextField(this);
                                                        if (!proxyID) {
                                                            //document.querySelector('#proxyName').value = res;
                                                        } else {
                                                            _app.helpers.getUserAlias(proxyID).then(res => {
                                                                this._proxyNameField.value = res;
                                                                //document.querySelector('#proxyName').value = res;
                                                            })
                                                        }
                                                    }
                                                }),
                                                {
                                                    $type: "a",
                                                    class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                                    $text: 'Set proxy', //self.language.t('set proxy'),//"clone",
                                                    onclick: function (e) {
                                                        //console.log('clone');
                                                        let newProxyName = this._proxyNameField.value;
                                                        _app.setNewProxyForWorld(desc.worldName, newProxyName);
                                                        //_app.cloneWorldPrototype(desc.worldName, desc.userAlias, newProtoName);
                                                        //self.refresh();
                                                    }
                                                }


                                            ]
                                    }
                                )



                            }

                            // if (desc.type == 'saveState') {
                            //     userGUI.push(
                            //         { $type: "br" },
                            //         {
                            //             $type: "a",
                            //             class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                            //             $text: "Delete",
                            //             //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                            //             onclick: function (e) {
                            //                 _app.deleteWorld(desc.worldName, 'state');
                            //             }
                            //         }
                            //     );
                            // }


                        }

                        if (desc.type == 'proto') {
                            let worldID = window._app.helpers.GenerateInstanceID().toString();
                            userGUI.push(
                                {
                                    $type: "div",
                                    style: "margin-top: 20px;",
                                    _protoName: null,
                                    _protoNameField: null,
                                    $components:
                                        [
                                            window._app.widgets.inputTextFieldOutlined({
                                                "id": 'protoName',
                                                "label": worldID,
                                                "value": this._protoName,
                                                "type": "text",
                                                "init": function () {
                                                    this._protoNameField = new mdc.textField.MDCTextField(this);
                                                }
                                            }),
                                            {
                                                $type: "a",
                                                class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                                $text: self.language.t('clone proto'),//"clone",
                                                onclick: function (e) {
                                                    //console.log('clone');
                                                    let newProtoName = this._protoNameField.value;
                                                    _app.cloneWorld(desc.worldName, desc.userAlias, newProtoName);

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
                                                                        window.location.pathname = '/' + myName + '/' + newProtoName + '/about'
                                                                    }
                                                                }
                                                            ]
                                                        })
                                                    }
                                                    // _app.cloneWorldPrototype(desc.worldName, desc.userAlias, newProtoName);
                                                    //self.refresh();
                                                }
                                            }

                                        ]
                                }
                            );




                        }

                    }

                    userGUI.push(
                        window._app.widgets.p,
                        {
                            $type: "div",
                            id: "tree_states",
                            _tree: [],
                            _treeComp: {},
                            $init: function () {
                                let selfComp = this;
                                let userPub = new Promise(res => res(_app.helpers.getUserPub(desc.userAlias)));
                                userPub.then(pub => {
                                    //console.log(pub);

                                    _LCSDB.user(pub).get('documents').get(desc.worldName).load(res => {
                                        // console.log(res);
                                        if (res) {
                                            selfComp._tree = [{
                                                name: 'States',
                                                children: []
                                            }];
                                            Object.keys(res).filter(el => el.includes('savestate_/' + desc.worldName + '/')).forEach(el => {
                                                let genLink = _app.helpers.replaceSubStringALL(el.split('/')[2], '_vwf_json', '');
                                                selfComp._tree[0].children.push({
                                                    name: genLink
                                                })
                                            })
                                            selfComp._treeComp = new TreeView(selfComp._tree, 'tree_states');
                                            selfComp._treeComp.on('select', function (evt) {
                                                console.log(evt);
                                                window.location.pathname = "/" + desc.userAlias + "/" + desc.worldName + "/load/" + evt.data.name;

                                            });
                                        }
                                    })

                                })


                            },
                            $components: [

                            ]
                        }

                    );


                    this.$components = [
                        {
                            $type: "h3",
                            $text: "World details:"
                        }
                    ].concat(userGUI)
                }
            }


            document.querySelector("#aboutWorld")._actionsGUI = actionsGUI;

            ///settings

            let settings = data.settings;
            if (settings) {
                if (settings.ar) {

                    let runWorldGUI = {
                        id: "runWorldGUI",
                        $type: "div",
                        $init: function () {
                            console.log(worldCardGUI);
                        },
                        _arSwitch: null,
                        _turnArOnSwitch: null,
                        $components: [
                            {
                                $type: "div",
                                $text: "Settings for start:"
                            },
                            _cellWidgets.switch({
                                'id': 'arjsView',
                                'init': function () {
                                    this._switch = new mdc.switchControl.MDCSwitch(this);
                                    this._switch.checked = false;
                                    this._arSwitch = this._switch;
                                }
                            }
                            ),
                            {
                                $type: 'label',
                                for: 'input-forceReplace',
                                $text: 'Edit mode'
                            },
                            { $type: "div", style: "margin-top: 20px" },
                            _cellWidgets.switch({
                                'id': 'arOnView',
                                'init': function () {
                                    this._turnArOn = new mdc.switchControl.MDCSwitch(this);
                                    this._turnArOn.checked = false;
                                    this._turnArOnSwitch = this._turnArOn;
                                }
                            }
                            ),
                            {
                                $type: 'label',
                                for: 'input-forceReplace',
                                $text: 'Ar mode'
                            }
                        ]

                    }

                    document.querySelector("#aboutWorld")._runWorldGUI = runWorldGUI;
                    //document.querySelector("#aboutWorld")._refresh(worldCardGUI);
                }
            }





        }


        document.querySelector("#aboutWorld").$cell({
            id: 'aboutWorld',
            $cell: true,
            $type: "div",
            _actionsGUI: {},
            _runWorldGUI: {},
            _worldsComps: {},
            _refresh: function (comps) {
                this._worldsComps = comps
            },
            $init: function () {
                //this._worldsComps = worldCardGUI; 
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
                                                $type: "h1",
                                                class: "mdc-typography--headline4",
                                                $text: self.worldName + ' by ' + self.userAlias
                                            }
                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                                        $components: [
                                            //worldCardGUI,
                                            this._worldsComps,
                                            { $type: 'p' },
                                            this._runWorldGUI
                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            this._actionsGUI
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        })

        document.querySelector("#aboutWorld")._refresh(worldCardGUI);

    }
}

export { WorldApp }