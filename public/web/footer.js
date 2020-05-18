/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

//import page from '/lib/page.mjs';

class Footer {
    constructor() {
        console.log("footer constructor");
        this.language = _LangManager.language;

    }

    init() {

        // let rootDoc = _app.indexApp.entry == 'index' ? document.querySelector('#indexPage') : document.querySelector('#app');
        let rootDoc = document.querySelector('#app');

        let el = document.createElement("div");
        el.setAttribute("id", "footer");
        rootDoc.appendChild(el);

        document.querySelector("#footer").$cell({
            id: 'footer',
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
                                        _app.widgets.divider
                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [


                                        {

                                            $type: "a",
                                            style: "cursor:pointer; margin-right: 10px",
                                            class: "mdc-typography  link-in-text mdc-theme--text-hint-on-background",
                                            $text: "Krestianstvo.org",
                                            href: "https://www.krestianstvo.org"
                                        },
                                        {

                                            $type: "span",
                                            class: "mdc-typography  mdc-theme--text-hint-on-background",
                                            $text: "| 2020 "
                                        }



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

export { Footer }