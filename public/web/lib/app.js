import { Lang } from '/web/lib/polyglot-lang.js';

class WebApp {
    constructor() {
        console.log("app constructor");

        this.options = {

            query: 'pathname=' + window.location.pathname.slice(1,
                window.location.pathname.lastIndexOf("/")),
            secure: window.location.protocol === "https:",
            reconnection: false,
            path:'',
            transports: ['websocket']
        }

        this.lang = new Lang;
        this.language = this.prepareLang();
        this.initReflectorServer();

        //window.location.host
        var socket = io.connect(this.currentReflector, this.options);

        var self = this;

        socket.on('getWebAppUpdate', function (msg) {
            self.parseAppInstancesData(msg)
            //console.log(msg);
        });
    }


    initReflectorServer() {
        this.currentReflector = localStorage.getItem('lcs_reflector');
        if (!this.currentReflector) {
            localStorage.setItem('lcs_reflector', window.location.host);
            this.currentReflector = localStorage.getItem('lcs_reflector');
        }
    }

    prepareLang() {
        let phrases = this.lang.langPhrases;
        return new this.lang.polyglot({ phrases });
    }

    setLanguage(langID) {
        this.lang.setLocale(langID);
        this.generateFrontPage();
    }

    generateFrontPage() {

        this.lang.initLocale();
        let allTextEl = ["titleText", "headerText", "featuresText", "worldInfo", "demoText"];
        allTextEl.forEach(el => {
            let textEl = document.querySelector("#" + el);
            textEl.innerHTML = this.lang.getTranslationFor(el);
        })

        this.initReflectorSelector();
    }


    initReflectorSelector() {

        const ref = document.querySelector('#currentReflector'); 
        ref.value = this.currentReflector;
        //let currentItem = Array.from(items).filter(el => el.textContent == this.currentReflector);

        const reflectorSelect = document.querySelector('#reflectorSelect');
        mdc.textField.MDCTextField.attachTo(reflectorSelect);
        reflectorSelect.addEventListener('change', function(e) {
            console.log(e.target.value); 
            localStorage.setItem('lcs_reflector', e.target.value);  
           window.location.reload(true);

            });

    }

    parseAppInstancesData(data) {

        var needToUpdate = true;

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

        document.querySelector("#main")._emptyLists();

        for (var prop in parsed) {
            var name = prop;
            let element = document.getElementById(name + 'List');
            if (element) {
                element._setListData(parsed[prop]);
            }
            //needToUpdate = true
        }
        // console.log(data)
    }

    getAllAppInstances() {

        let allInatances = this.httpGetJson('allinstances.json')
            .then(res => {
                this.parseAppInstancesData(res);
            });
    }

    parseWebAppDataForCell(data) {

        var self = this;

        document.querySelector("#main").$cell({
            $cell: true,
            $type: "div",
            id: "main",
            _jsonData: {},
            _emptyLists: function () {
                Object.entries(this._jsonData).forEach(function (element) {
                    //console.log(element);
                    document.getElementById(element[0] + 'List')._setListData({});
                });
            },
            $init: function () {
                this._jsonData = JSON.parse(data);
            },
            _makeWorldCard: function (m) {
                let langID = localStorage.getItem('krestianstvo_locale');
                var appInfo = m
                if (langID) {
                    if (m[1][langID]) {
                        appInfo = [m[0], m[1][langID]]
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
                    //getSiteHeader(),// siteHeader,
                    {
                        $type: "div",
                        class: "mdc-layout-grid",
                        $components: [
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

                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-card world-card",
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
                                    class: "mdc-button mdc-button--compact mdc-card__action mdc-button--stroked",
                                    $text: self.language.t('start'),//"Start new",
                                    target: "_blank",
                                    href: "/" + desc[0],
                                    onclick: function (e) {
                                        self.refresh();
                                    }
                                }


                            ]
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
                                    id: desc[0] + 'List',
                                    $update: function () {
                                        var connectText = {}

                                        if (Object.entries(this._listData).length !== 0) {
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
                                        ].concat(Object.entries(this._listData).map(this._worldListItem))
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
                                                            $type: "a",
                                                            $text: m[0],
                                                            target: "_blank",
                                                            href: window.location.protocol + "//" + window.location.host + m[0],
                                                            onclick: function (e) {
                                                                self.refresh();
                                                            }
                                                        },
                                                        {
                                                            $type: "span",
                                                            class: "mdc-list-item__text__secondary",
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


        })

    }

    getAppDetails(val) {

        let appDetails = this.httpGetJson(val)
            .then(res => {
                this.parseWebAppDataForCell(res)
            })
            .then(res => this.refresh());
    }


    refresh() {
        // socket.emit('getWebAppUpdate', "");
    }


    httpGet(url) {
        return new Promise(function (resolve, reject) {
            // do the usual Http request
            let request = new XMLHttpRequest();
            request.open('GET', url);

            request.onload = function () {
                if (request.status == 200) {
                    resolve(request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function () {
                reject(Error('Network Error'));
            };

            request.send();
        });
    }
    
    async httpGetJson(url) {
        // check if the URL looks like a JSON file and call httpGet.
        let regex = /\.(json)$/i;

        if (regex.test(url)) {
            // call the async function, wait for the result
            return await this.httpGet(url);
        } else {
            throw Error('Bad Url Format');
        }
    }

}
export { WebApp }
    //export {getAppDetails, generateFrontPage, setLanguage, initLocale};