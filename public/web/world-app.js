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

        let el2 = document.createElement("div");
        el2.setAttribute("id", "worldStates");
        rootDoc.appendChild(el2);

        document.querySelector("#worldStates").$cell({
            id: "worldStates",
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

    }


    createWorldStatesGUI() {

        let worldStatesGUI = {
            id: "worldStatesGUI",
            $type: "div",
            $components: [],
            _states: {},
            _refresh: function (data) {
                this._states = data
            },
            _makeWorldCard: function (data) {
                let cardID = data[1].userAlias + '_' + data[1].worldName + '_' + data[0];
                let card = _app.indexApp.createWorldCard(cardID, 'min');
                card._refresh(data[1]);
                card._updateComps();
                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                    $components: [card]
                }
                //console.log(data);
            },
            $update: function(){},
            _updateComps: function () {
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
                                                $text: 'States'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: Object.entries(this._states)
                                    .filter(el => Object.keys(el[1]).length !== 0)
                                    .sort(function (el1, el2) {
                                        return parseInt(el2[1].created) - parseInt(el1[1].created)
                                    })
                                    .map(this._makeWorldCard)
                            }
                        ]

                    }
                ]
            }
        }

        return worldStatesGUI
    }


    async makeGUI(userPub) {

        let self = this;
        let user = { 'user': this.userAlias, pub: userPub };
        let space = this.worldName;
        let saveName = this.saveName;

       

        let cardID = user.user + '_' + space + '_' + (saveName ? saveName : "");
        let cardWorldType = saveName ? 'state' : 'proto';

        let worldNameInfo = saveName ? {protoName: space, stateName: saveName} : space

        let worldCardGUI = _app.indexApp.createWorldCard(cardWorldType, this.userAlias, userPub, worldNameInfo, cardID, "full", setWorldParameters); //createWorldCard(userAlias, userPub, worldName, id, type)
        let worldStatesGUI = [];

        //var runWorldGUI = {};


        function setWorldParameters(data) {

            console.log(data);
            let actionsGUI = {
                $cell: true,
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
                    if (_LCSDB.user().is) {
                        this._refresh();
                    }
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
                                    $type: "a",
                                    class: "mdc-button ",
                                    $text: "Edit info",
                                    //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                    onclick: function (e) {
                                        //'/:user/:type/:name/edit/:file'
                                        if (desc.type == 'proto') {
                                            window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/info_json'
                                        } else if (desc.type == 'saveState') {
                                            let names = desc.worldName.split('/');
                                            let filename = ('savestate_/' + names[0] + '/' + names[2] + '_info_vwf_json').split('/').join("~");
                                            window.location.pathname = "/" + desc.userAlias + '/state/' + names[0] + '/edit/' + filename;
                                        }
                                        //self.refresh();
                                    }
                                },
                                {
                                    $type: "a",
                                    class: "mdc-button ",
                                    $text: "Edit source",
                                    //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                    onclick: function (e) {
                                        //'/:user/:type/:name/edit/:file'
                                        if (desc.type == 'proto') {
                                            window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/index_vwf_yaml'
                                        } else if (desc.type == 'saveState') {
                                            let names = desc.worldName.split('/');
                                            let filename = ('savestate_/' + names[0] + '/' + names[2] + '_vwf_json').split('/').join("~");
                                            window.location.pathname = "/" + desc.userAlias + '/state/' + names[0] + '/edit/' + filename;
                                        }
                                        //self.refresh();
                                    }
                                }
    
                            );
    
                            if (desc.type == 'proto') {
                              
                                userGUI.push(
                                    // {
                                    //     $type: "a",
                                    //     class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                    //     $text: "Edit proto",
                                    //     //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                    //     onclick: function (e) {
                                    //         window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/index_vwf_yaml'
                                    //     }
                                    // },
                                   
                                       {
                                        $type: "a",
                                        class: "mdc-button ",
                                        $text: "Edit config",
                                        //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                        onclick: function (e) {
                                            window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/index_vwf_config_yaml'
                                        }
                                    },
                                    {$type: "br"},
                                    {
                                        $type: "a",
                                        class: "mdc-button",
                                        $text: "Edit appui.js",
                                        //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                        onclick: function (e) {
                                            window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/appui_js'
                                        }
                                    },
                                   
                                    {
                                        $type: "a",
                                        class: "mdc-button",
                                        $text: "Edit assets.json",
                                        //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                        onclick: function (e) {
                                            window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/assets_json'
                                        }
                                    },
                                    {
                                        $type: "a",
                                        class: "mdc-button",
                                        $text: "Edit index.vwf.html",
                                        //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                        onclick: function (e) {
                                            window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/index_vwf_html'
                                        }
                                    }
                                
                                );
    
                                userGUI.push(
                                    {$type: "br"},
                                    {
                                        $type: "a",
                                        class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                        $text: "Delete",
                                        //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                        onclick: function (e) {
                                            _app.deleteWorld(desc.worldName, 'proto');
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
                                                        if(!proxyID){
                                                            //document.querySelector('#proxyName').value = res;
                                                        } else {
                                                            _app.helpers.getUserAlias(proxyID).then(res=>{
                                                                document.querySelector('#proxyName').value = res;
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
    
    
                            if (desc.type == 'saveState') {
                                userGUI.push(
                                    {$type: "br"},
                                    {
                                        $type: "a",
                                        class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                        $text: "Delete",
                                        //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                        onclick: function (e) {
                                            _app.deleteWorld(desc.worldName, 'state');
                                        }
                                    }
                                );
                            }
    
    
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
                                                    _app.cloneWorldPrototype(desc.worldName, desc.userAlias, newProtoName);
                                                    //self.refresh();
                                                }
                                            }
                                            
                                        ]
                                }
                            )
                        } else if (desc.type == 'saveState') {
    
    
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
    
    
    
                    this.$components = [
                        {
                            $type: "div",
                            $text: "World actions:"
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
                            {$type: "div", style: "margin-top: 20px"},
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
            _refresh: function(comps){
                this._worldsComps = comps
            },
            $init: function(){
                //this._worldsComps = worldCardGUI; 
            },
            $update: function(){
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
                                },
                                // {
                                //     $type: "div",
                                //     class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                //     $components: [
                                //     ].concat(worldStatesGUI)
                                // },
                            ]
                        }
                    ]
                }
            ]
        }
        })

        document.querySelector("#aboutWorld")._refresh(worldCardGUI);
       


        var info = {};


        // if (!saveName) {
        //     info = await _app.getAllProtoWorldsInfoForUser(user.user, space) //await _app.getWorldInfo(user, space);
        // } else {
        //     let loadName = space + "/load/" + saveName;
        //     info = await _app.getAllStateWorldsInfoForUser(user.user, space, loadName) //await _app.getStateInfo(user, space, saveName);
        // }

        
        // worldCardGUI._worldInfo = info;
        // worldCardGUI.$update();
       
        //worldCardGUI._refresh(info);
        //worldCardGUI._updateComps();
        
        //document.querySelector("#aboutWorld")._refreshWorldComps(info);

      
        ///STATES FIX!!!

    //     let worldStatesComp = this.createWorldStatesGUI();

    //     document.querySelector("#worldStates").$cell({
    //         id: 'worldStates',
    //         $cell: true,
    //         $type: "div",
    //         $components: [worldStatesComp]
    //     //     $update: function(){
    //     //         this.$components = [
    //     //         {}
            
    //     //     ]
    //     // }
    // })

    if (!saveName) {
        _app.indexApp.allWorldsStatesForUser(user.user, space, 'worldStates')
    }

        // if (!saveName) {
        //     let statesData = await _app.getAllStateWorldsInfoForUser(user.user, space) //await _app.getSaveStates(user, space);
        //     //let worldStates = this.createWorldStatesGUI();
        //     let worldStates = document.querySelector("#worldStatesGUI");
        //     worldStates._states = statesData;
        //     worldStates._updateComps();
        //     worldStatesComp.$components.push(worldStates);
        // }

    }



}

export { WorldApp }