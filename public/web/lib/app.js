var options = {

    query: 'pathname=' + window.location.pathname.slice(1,
        window.location.pathname.lastIndexOf("/")),
    secure: window.location.protocol === "https:",
    reconnection: false,
    transports: ['websocket']

};

var socket = io.connect(window.location.protocol + "//" + window.location.host, options);

socket.on('getWebAppUpdate', function (msg) {
    parseAppInstancesData(msg)
    //console.log(msg);
});


function parseAppInstancesData(data) {

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

function getAllAppInstances() {

    let allInatances = httpGetJson('allinstances.json')
        .then(res => {
            parseAppInstancesData(res);
        });
}

function parseWebAppDataForCell(data) {

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
            return {
                $cell: true,
                $type: "div",
                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                $components: [
                    this._worldCardDef(m)
                ]
            }

        },
        $update: function () {
            this.$components = [
                // siteHeader,
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
                                this.style.backgroundImage = 'linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(' + desc[1].imgUrl + ')';
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
                                class: "mdc-button mdc-button--compact mdc-card__action mdc-button--raised",
                                $text: "Start new",
                                target: "_blank",
                                href: "/" + desc[0],
                                onclick: function (e) {
                                    refresh();
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
                                                        $text: m[1].instance,
                                                        target: "_blank",
                                                        href: "http://" + m[1].instance,
                                                        onclick: function (e) {
                                                            refresh();
                                                        }
                                                    },
                                                    {
                                                        $type: "span",
                                                        class: "mdc-list-item__text__secondary",
                                                        $text: "Users online: " + m[1].clients
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

function getAppDetails() {

    let appDetails = httpGetJson('webapps.json')
        .then(res => {
            parseWebAppDataForCell(res)
        })
        .then(res => refresh());
}


function refresh() {
    // socket.emit('getWebAppUpdate', "");
}


function httpGet(url) {
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
async function httpGetJson(url) {
    // check if the URL looks like a JSON file and call httpGet.
    let regex = /\.(json)$/i;

    if (regex.test(url)) {
        // call the async function, wait for the result
        return await httpGet(url);
    } else {
        throw Error('Bad Url Format');
    }
}


