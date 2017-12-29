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

        icontoggle(obj) {
            return {
                $cell: true,
                $type: "i",
                class: "mdc-icon-toggle material-icons",
                role: "button",
                $text: obj.label,
                id: obj.id,
                'data-toggle-on': obj.on,
                'data-toggle-off': obj.off,
                'aria-pressed': obj.state,
                //'aria-hidden': true,
                $init: obj.init
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