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

        simpleCard(obj){
            let style =  'background-image: url(' + obj.imgSrc + '); background-size: cover; background-repeat: no-repeat; height:' + obj.imgHeight + ';';
            var addonClass = obj.addonClass;
            if (!addonClass){
                addonClass = ''
            }

            return  {
                $cell: true,
                $type: "div",
                $components:[
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-card" +' '+ addonClass,
                        onclick: obj.onclickfunc,
                        $components:[
                            {
                                $cell: true,
                                $type: "section",
                                class: "mdc-card__media",
                                style:  style
                            },
                            {
                                $cell: true,
                                $type: "section",
                                class: "mdc-card__supporting-text",
                                $text: obj.text
                            }
                        ]
                    }
                ]
            }
        }

        listDivider() {
            return {
                $cell: true,
                $type: "hr",
                class: "mdc-list-divider mdc-list-divider--inset"
            }
        }
        createListItem(obj) {
            return {
                $cell: true,
                $type: "li",
                class: "mdc-list-item",
                $components: [
                    {
                        $cell: true,
                        $type: "span",
                        class: "mdc-list-item__graphic",
                        $components: [
                            {
                            $cell: true,
                            class: "createItems",
                            $type: "img",
                            src: obj.imgSrc,
                            onclick: obj.onclickfunc
                            }
                        ]
                    },
                    {
                        $cell: true,
                        $type: "span",
                        class: "mdc-list-item__text",
                        $text: obj.title
                        // $components: [
                        //     {
                        //         $text: obj.title
                        //     },
                        //     {
                        //     $cell: true,
                        // $type: "span",
                        // class: "mdc-list-item__secondary-text",
                        // $text: obj.subTitle
                        //     }
                        // ]
                    }
                ]
            }
        }

        createCard(obj){
            return {
                $cell: true,
                $type: "div",
                $components:[
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-card",
                        $components:[
                            {
                                $cell: true,
                                $type: "div",
                                class: "mdc-card__horizontal-block",
                                $components:[
                                    {
                                        $cell: true,
                                        $type: "section",
                                        class: "mdc-card__primary",
                                        $components:[
                                            {
                                                $cell: true,
                                                $type: "h1",
                                                class: "mdc-card__title mdc-card__title--large",
                                                $text: obj.title
                                            },
                                            {
                                                $cell: true,
                                                $type: "h2",
                                                class: "mdc-card__subtitle",
                                                $text: obj.subTitle
                                            }
                                        ]
                                    },
                                    {
                                        
                                            $cell: true,
                                            $type: "img",
                                            class: "",
                                            src: obj.imgSrc
                                        
                                    }
                                ]
                            },
                            {
                                $cell: true,
                                $type: "section",
                                class: "mdc-card__actions",
                                $components:[
                                    {
                                        $cell: true,
                                        $type: "button",
                                        class: "mdc-button mdc-button--compact mdc-card__action",
                                        $text: obj.actionLabel
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }

        buttonStroked(obj){
            return {
                $cell: true,
                $type: "button",
                class: "mdc-button mdc-button--stroked mdc-ripple-upgraded",
                $text: obj.label,
                onclick: obj.onclick
            }
        }

        sliderDiscrete(obj) {
            return {
                $cell: true,
                $type: "div",
                class: "mdc-slider mdc-slider--discrete",
                role: "slider",
                'aria-valuemin': obj.min,
                'aria-valuemax': obj.max,
                'aria-label': obj.label,
                $init: obj.init,
                $components: [
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-slider__track-container",
                        $components: [
                            {
                                $cell: true,
                                $type: "div",
                                class: "mdc-slider__track",
                                
                            }
                        ]
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-slider__thumb-container",
                        $components: [
                            {
                                $cell: true,
                                $type: "div",
                                class: "mdc-slider__pin",
                                $components: [
                                    {
                                        $cell: true,
                                        $type: "span",
                                        class: "mdc-slider__pin-value-marker",
                                    }
                                ]
                                
                            },
                            {
                                $cell: true,
                                $type: "svg",
                                class: "mdc-slider__thumb",
                                width: 21,
                                height: 21,
                                $components: [
                                    {
                                        $cell: true,
                                        $type: "circle",
                                        cx: 10.5,
                                        cy: 10.5,
                                        r: 7.875
                                    }
                                ]
                            },
                            {
                                $cell: true,
                                $type: "div",
                                class: "mdc-slider__focus-ring"
                            }
                        ]
                    }
                ]
            }
        }

        sliderContinuous(obj) {
            return {
                $cell: true,
                $type: "div",
                class: "mdc-slider",
                role: "slider",
                tabindex: 0,
                'id': obj.id,
                'aria-valuemin': obj.min,
                'aria-valuemax': obj.max,
                'aria-label': obj.label,
                'aria-valuenow': obj.value,
                'data-step': obj.step,
                $init: obj.init,
                $components: [
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-slider__track-container",
                        $components: [
                            {
                                $cell: true,
                                $type: "div",
                                class: "mdc-slider__track",
                                
                            }
                        ]
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-slider__thumb-container",
                        $components: [
                            {
                                $cell: true,
                                $type: "svg",
                                class: "mdc-slider__thumb",
                                width: 21,
                                height: 21,
                                $components: [
                                    {
                                        $cell: true,
                                        $type: "circle",
                                        cx: 10.5,
                                        cy: 10.5,
                                        r: 7.875
                                    }
                                ]
                            },
                            {
                                $cell: true,
                                $type: "div",
                                class: "mdc-slider__focus-ring"
                            }
                        ]
                    }
                ]
            }
        }

        icontoggle(obj) {
            return {
                $cell: true,
                $type: "i",
                class: "mdc-icon-toggle material-icons "+ obj.styleClass,
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

        floatActionButton(obj) {
            return {
                    $cell: true,
                    $type: "button",
                    class: "mdc-fab material-icons " + obj.styleClass,
                    onclick: obj.onclickfunc,
                    $components:[
                        {
                            $cell: true,
                            $type: "span",
                            class: "mdc-fab__icon",
                            $text: obj.label
                        }
                    ]
                }
        }

        iconButton(obj) {
            return {
                    $cell: true,
                    $type: "button",
                    class: "mdc-button",
                    onclick: obj.onclickfunc,
                    $components:[
                        {
                            $cell: true,
                            $type: "i",
                            class: "material-icons mdc-button__icon"+ obj.styleClass,
                            $text: obj.label
                        }
                    ]
                }
        }

        imageButton(obj){
            return {
                $cell: true,
                $type: "button",
                class: "mdc-button mdc-button--compact",
                onclick: obj.onclickfunc,
                $components:[
                    {
                        $cell: true,
                        class: obj.styleClass,
                        $type: "img",
                        src: obj.imgSrc
                     }
                ]
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