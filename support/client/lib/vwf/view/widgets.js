'use strict';

define(function () {


    /*
     * Cell widgets 
     */
    class Widgets {
        constructor() {
          console.log("widget constructor")
        }

        get divider(){
            return {
                $cell: true,
                $type: "hr",
                class: "mdc-list-divider",
            }
        }

        headerH3(headertype, label, cssclass) {

            return  {
                $cell: true,
                $type: headertype,
                class: cssclass,
                $text: label
            }

        }

        switch(obj) {

            return   {
                $cell: true,
                $type: "div",
                class: "mdc-switch",
                $components: [
                    {
                        $type: "input",
                        type: "checkbox",
                        class: "mdc-switch__native-control",
                        id: obj.id,
                        $init: obj.init,
                        //id: "basic-switch",
                        onchange: obj.onchange
                    },
                    {
                        $type: "div",
                        class: "mdc-switch__background",
                        $components: [
                            {
                                $type: "div",
                                class: "mdc-switch__knob"
                            }
                        ]
                    }
                ]
            }

        }

      }
    return new Widgets;

})