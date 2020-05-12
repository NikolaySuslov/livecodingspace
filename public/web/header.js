/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

//import page from '/lib/page.mjs';

class Header {
    constructor() {
        console.log("header constructor");
        this.language = _LangManager.language;

    }

    init() {

        let rootDoc = _app.indexApp.entry == 'index' ? document.querySelector('#indexPage') : document.querySelector('#app');
        //let rootDoc = document.querySelector('#app');

        let el = document.createElement("div");
        el.setAttribute("id", "header");
        rootDoc.prepend(el);

        document.querySelector("#header").$cell({
            id: 'header',
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

                                            $type: "a",
                                            style: "cursor:pointer; margin-right: 10px",
                                            class: "mdc-typography link-in-text mdc-theme--text-hint-on-background",
                                            $text: "Home",
                                            //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                            onclick: function (e) {
                                                window.location.pathname = '/'
                                                //window.history.back();
                                            }

                                        },
                                        {
                                            $type: "a",
                                            style: "cursor:pointer; margin-right: 10px",
                                            class: "mdc-typography link-in-text mdc-theme--text-hint-on-background",
                                            $text: "Connection settings",
                                            //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                            onclick: function (e) {
                                                window.location.pathname = '/settings'
                                                //window.history.back();
                                            }

                                        },
                                        {

                                            $type: "a",
                                            style: "cursor:pointer; margin-right: 40px",
                                            class: "mdc-typography link-in-text mdc-theme--text-hint-on-background",
                                            $text: "Help",
                                            //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                            href: 'https://www.krestianstvo.org/docs/sdk3'

                                        },
                                        {
                                            $type: "a",
                                            id: 'ruLang',
                                            style: "cursor:pointer; margin-right: 10px",
                                            class: "mdc-typography link-in-text mdc-theme--text-hint-on-background",
                                            $text: "RU",
                                            //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                            onclick: function (e) {
                                                _LangManager.locale = 'ru';
                                                window.location.reload(true);
                                            }

                                        },
                                        {
                                            $type: "a",
                                            id: 'enLang',
                                            style: "cursor:pointer; margin-right: 10px",
                                            class: "mdc-typography link-in-text mdc-theme--text-hint-on-background",
                                            $text: "EN",
                                            //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                                            onclick: function (e) {
                                                _LangManager.locale = 'en';
                                                window.location.reload(true);
                                            }

                                        }


                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        _app.widgets.divider
                                    ]
                                }
                                


                            ]
                        }
                    ]
                }





            ]
        })

    }


}

export { Header }