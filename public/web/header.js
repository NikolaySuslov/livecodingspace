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


        let el = document.createElement("div");
        el.setAttribute("id", "header");
        document.body.appendChild(el);

        let headerGUI = {
            
                $type: "a",
                class: "mdc-button mdc-button--compact mdc-card__action",
                $text: "Back",
                //href: "/" + desc[2] + '/worlds/' + desc[0] + '/edit', ///:user/worlds/:name/edit
                onclick: function (e) {
                    window.history.back();
                }
            
        }


        document.querySelector("#header").$cell({
            id: 'header',
            $cell: true,
            $type: "div",
            $components: [
                //headerGUI
            ]
        })

    }


}

export { Header }