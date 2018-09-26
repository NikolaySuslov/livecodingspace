import page from '/lib/page.mjs';

class WorldApp {
    constructor(userAlias, worldName, saveName) {
        console.log("app constructor");

        this.userAlias = userAlias;
        this.worldName = worldName;
        this.saveName = saveName;

        //this.worlds = {};
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
            this.parseAppInstancesData(msg);
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

    async initWorldGUI() {

        let self = this;
        let user = this.userAlias;
        let space = this.worldName;
        let saveName = this.saveName;

        let el = document.createElement("div");
        el.setAttribute("id", "aboutWorld");
        document.body.appendChild(el);

        //get user
        // let userID = await _LCSDB.get('~@' + user).once().then();
        // let userPub = Object.keys(userID).filter(el => (el !== '_'))[0].slice(1);

        let userPub = await _LCSDB.get('users').get(user).get('pub').once().then();
        var db = _LCSDB.user(userPub);

        if (_LCSUSER.is) {
            if (_LCSUSER.is.alias == user)
                db = _LCSUSER;
        }

        let worldCardGUI = {
            $cell: true,
            id: 'worldCard',
            $type: "div",
            _worldInfo: {},
            _refresh: function (data) {
                this._worldInfo = data
            },
            _getWorldInfo: async function () {
                //get space for user
                let world = await db.get('worlds').get(space).once().then();
                if (world) {
                    await db.get('worlds').get(space).get('info_json').on((res) => {

                        if (res && res !== 'null') {

                            if (res.file && res.file !== 'null') {

                                let worldDesc = JSON.parse(res.file);
                                let root = Object.keys(worldDesc)[0];
                                var appInfo = worldDesc[root]['en'];

                                let langID = localStorage.getItem('krestianstvo_locale');
                                if (langID) {
                                    appInfo = worldDesc[root][langID]
                                }

                                let info = {
                                    'worldName': space,
                                    'created': res.created ? res.created : res.modified,
                                    'modified': res.modified,
                                    'type': 'proto',
                                    'userAlias': user,
                                    'info': appInfo
                                }
                                this._refresh(info);
                            }
                        }
                    }).then();
                } else {
                    this._refresh();
                }
            },
            _getStateInfo: async function () {
                //get space for user
                let docName = 'savestate_/' + space + '/' + saveName + '_info_vwf_json';
                let world = await db.get('documents').get(space).get(docName).once().then();
                if (world) {
                    db.get('documents').get(space).get(docName).on((res) => {

                        if (res && res !== 'null') {

                            if (res.file && res.file !== 'null') {

                                let worldDesc = JSON.parse(res.file);
                                let root = Object.keys(worldDesc)[0];
                                var appInfo = worldDesc[root]['en'];

                                let langID = localStorage.getItem('krestianstvo_locale');
                                if (langID) {
                                    appInfo = worldDesc[root][langID]
                                }

                                let info = {
                                    'worldName': space + '/load/' + saveName,
                                    'created': res.created ? res.created : res.modified,
                                    'modified': res.modified,
                                    'type': 'saveState',
                                    'userAlias': user,
                                    'info': appInfo
                                }
                                this._refresh(info);
                            }
                        }
                    });
                } else {
                    this._refresh();
                }
            },
            $init: async function () {
                //get space for user
                if (!saveName) {
                    await this._getWorldInfo();
                } else {
                    await this._getStateInfo();
                }
            },
            $update: function () {
                console.log(this._worldInfo);
                this.$components = [this._updateCard()]


            },
            $components: [],
            _updateCard: function () {

                let desc = this._worldInfo;


                if (!desc) {
                    return {
                        $type: "h1",
                        class: "mdc-typography--headline4",
                        $text: "ERROR: NO WORLD!"
                    }
                }


                let userGUI = [];
                let cardInfo = {
                    "title": ""
                };

                if (desc.type == 'saveState') {
                    cardInfo.title = desc.worldName.split('/')[2];
                }

                if (desc.type == 'proto') {
                    cardInfo.title = desc.worldName;

                    userGUI.push(

                        {
                            $type: "a",
                            class: "mdc-button mdc-button--compact mdc-card__action",
                            $text: "States",
                            onclick: function (e) {
                                //console.log('clone');
                                self.showOnlySaveStates(desc.worldName, desc.userAlias);
                                //self.refresh();
                            }
                        }
                    )
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
                                {
                                    $type: "a",
                                    class: "mdc-button mdc-button--compact mdc-card__action mdc-button--outlined",
                                    $text: self.language.t('start'),//"Start new",
                                    target: "_blank",
                                    href: "/" + desc.userAlias + '/' + desc.worldName,
                                    onclick: function (e) {
                                        //self.refresh();
                                    }
                                }
                            ].concat(userGUI)
                        },

                        {
                            $type: "section",
                            class: "mdc-card__actions",
                            $components: [
                                {
                                    $type: 'div',
                                    $text: 'online now: '
                                },
                                onlineGUI
                            ]
                        }
                    ]
                }
            }
        }

        let onlineGUI = {
            $cell: true,
            id: "onlineGUI",
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
                if (_LCSUSER.is) {
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

                if (_LCSUSER.is) {
                    if (_LCSUSER.is.alias == desc.userAlias) {
                        userGUI.push(
                            {
                                $type: "a",
                                class: "mdc-button mdc-button--compact mdc-card__action",
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
                                    class: "mdc-button mdc-button--compact mdc-card__action",
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
                                    class: "mdc-button mdc-button--compact mdc-card__action",
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
                                    class: "mdc-button mdc-button--compact mdc-card__action",
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
                                class: "mdc-button mdc-button--compact mdc-card__action",
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


        _LCSDB.on('auth',
            async function (ack) {
                if (_LCSUSER.is) {
                    document.querySelector('#worldActionsGUI')._refresh();
                }
            })


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
                                }
                            ]
                        }
                    ]
                }
            ]
        })


    }

    parseAppInstancesData(data) {

        let parcedData = _app.parseAppInstancesData(data);

        //if (Object.entries(parcedData).length !== 0)
        let onlineGUI = document.querySelector("#onlineGUI");
        if (onlineGUI)
            document.querySelector("#onlineGUI")._refresh(parcedData)



        // if (Object.entries(this.worlds).length !== 0) {
        //     document.querySelector("#main")._emptyLists();
        // }

        // if (parcedData == "{}") {
        //     var el = document.querySelector(".instance");
        //     if (el) {
        //         var topEl = el.parentNode;
        //         topEl.removeChild(el);
        //     }
        //     // let removeElements = elms => Array.from(elms).forEach(el => el.remove()); 
        // }

        // console.log(parcedData)

    }


}

export { WorldApp }