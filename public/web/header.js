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

    init(){

        let rootDoc = document.querySelector('#app');
        let el = document.createElement("div");
        el.setAttribute("id", "header");
        rootDoc.prepend(el);

        let headerGUI = {
                $cell: true,
                $type: "a",
                class: "mdc-button mdc-button--compact mdc-card__action",
                $text: "Home",
                //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                onclick: function (e) {
                    window.location.pathname = '/'
                    //window.history.back();
                }
            
        }


        document.querySelector("#header").$cell({
            id: 'header',
            $cell: true,
            $type: "div",
            $components: [
                headerGUI
            ]
        })

    }


}

export { Header }