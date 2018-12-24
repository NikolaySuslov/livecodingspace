/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

import page from '/lib/page.mjs';

class WorldApp {
    constructor(userAlias, worldName, saveName) {
        console.log("app constructor");

        this.userAlias = userAlias;
        this.worldName = worldName;
        this.saveName = saveName;

        //this.worlds = {};
        this.language = _LangManager.language;
          
    }


    createWorldStatesGUI() {
        let self = this;

        let worldStatesGUI = {
            $cell: true,
            id: "worldStatesGUI",
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
                let card = _app.indexApp.createWorldCard(cardID, 'min');
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
                                .filter(el =>Object.keys(el[1]).length !== 0)
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

    async initWorldGUI() {

    //  _LCSDB.on('auth',
    //     function (ack) {
    //         if(ack.pub)
    //             document.querySelector('#worldActionsGUI')._refresh();
            
    //     });

        let self = this;
        let user = this.userAlias;
        let space = this.worldName;
        let saveName = this.saveName;

        let el = document.createElement("div");
        el.setAttribute("id", "aboutWorld");
        document.body.appendChild(el);

        let cardID = user + '_' + space + '_' + (saveName ? saveName : "");
        let worldCardGUI = _app.indexApp.createWorldCard(cardID, 'full');
        let worldStatesGUI = [];

        var info = {};

        if (!saveName) {
            info = await _app.getWorldInfo(user, space);
        } else {
            info = await _app.getStateInfo(user, space, saveName);
        }
        worldCardGUI._worldInfo = info;
        worldCardGUI.$update();

        if (!saveName) {
            let statesData = await _app.getSaveStates(user, space);
            let worldStates = this.createWorldStatesGUI();
            worldStates._states = statesData;
            worldStates.$update();
            worldStatesGUI.push(worldStates);
        }


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
                                class: "mdc-button mdc-button--raised mdc-card__action actionButton",
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
                            }
                        );

                        if (desc.type == 'proto') {
                            userGUI.push(
                                {
                                    $type: "a",
                                    class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                    $text: "Edit proto",
                                    //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                    onclick: function (e) {
                                        window.location.pathname = "/" + desc.userAlias + '/proto/' + desc.worldName + '/edit/index_vwf_yaml'
                                    }
                                }
                            );

                            userGUI.push(
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
                        }


                        if (desc.type == 'saveState') {
                            userGUI.push(
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
                        userGUI.push(
                            {
                                $type: "a",
                                class: "mdc-button mdc-button--raised mdc-card__action actionButton",
                                $text: self.language.t('clone proto'),//"clone",
                                onclick: function (e) {
                                    //console.log('clone');
                                    _app.cloneWorldPrototype(desc.worldName, desc.userAlias);
                                    //self.refresh();
                                }
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

    
        document.querySelector("#aboutWorld").$cell({
            id: 'aboutWorld',
            $cell: true,
            $type: "div",
            $components: [
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
                                        worldCardGUI
                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        actionsGUI
                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                    ].concat(worldStatesGUI)
                                },
                            ]
                        }
                    ]
                }
            ]
        })


    }

}

export { WorldApp }