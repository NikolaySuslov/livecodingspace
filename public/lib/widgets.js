
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

            inputTextFieldOutlined(obj){
                function initFunc() {
                    new mdc.textField.MDCTextField.attachTo(this);
                }
                let inputType = obj.type ? obj.type: 'text';
                let init = obj.init ? obj.init: initFunc;

                let style = obj.style ? obj.style: "";

                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-text-field mdc-text-field--outlined mdc-text-field--dense",
                    style: style,
                    $init: init,
                    $components:[
                        {
                            $type: "input",
                            type: inputType,
                            id: obj.id,
                            class: "mdc-text-field__input",
                            value: obj.value,
                            onchange: obj.change
                        },
                        {
                            $type: "label",
                            class: "mdc-floating-label",
                            for: obj.id,
                            $text: obj.label
                        },
                        {
                            $type: "div",
                            class: "mdc-notched-outline",
                            $components:[
                                {
                                    $type: "svg",
                                    $components:[
                                        {
                                            $type: "path",
                                            class: "mdc-notched-outline__path"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            $type: "div",
                            class: "mdc-notched-outline__idle"
                        }
                    ]
                    //onclick: obj.onclick
                }
            }

            inputTextFieldStandart(obj){
                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-text-field text-field mdc-ripple-upgraded",
                    $init: function(){
                    //new mdc.mdc.notchedOutline.MDCNotchedOutline(document.querySelector('.mdc-notched-outline'));
                       new mdc.textField.MDCTextField.attachTo(this);
                    },
                    $components:[
                        {
                            $type: "input",
                            type: "text",
                            id: obj.id,
                            class: "mdc-text-field__input",
                            value: obj.value,
                            onchange: obj.change
                        },
                        {
                            $type: "label",
                            class: "mdc-floating-label",
                            for: obj.id,
                            $text: obj.label
                        },
                        {
                            $type: "div",
                            class: "mdc-line-ripple"
                        }
                        
                    ]
                    //onclick: obj.onclick
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
                class: "mdc-button mdc-button--outlined",
                $text: obj.label,
                onclick: obj.onclick
            }
        }

        buttonRaised(obj){
            return {
                $cell: true,
                $type: "button",
                class: "mdc-button mdc-button--raised mdc-ripple-upgraded",
                $text: obj.label,
                onclick: obj.onclick
            }
        }

        buttonSimple(obj){
            return {
                $cell: true,
                $type: "button",
                class: "mdc-button",
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

        textField(obj) {
            return {
                class: "mdc-text-field",
                style: "width: 100%",
                $cell: true,
                $type: "div",
                $components: [
                    {
                        class: "mdc-text-field__input prop-text-field-input",
                        id: obj.id,
                        $cell: true,
                        $type: "input",
                        type: "text",
                        value: obj.value,
                        onchange: obj.funconchange
                    }

                ]
            }
        }

        icontoggle(obj) {

            var addClass = "";
            if (obj.styleClass){
                addClass = obj.styleClass;
            }

            return {
                $type: "i",
                class: addClass + " mdc-icon-toggle material-icons",
                role: "button",
                $text: obj.label,
                id: obj.id,
                'data-toggle-on': obj.on,
                'data-toggle-off': obj.off,
                'aria-pressed': obj.state,
                'aria-hidden': true,
                $init: obj.init
            }
        }

        floatActionButton(obj) {
            var addClass = "";
            if (obj.styleClass){
                addClass = obj.styleClass;
            }

            return {
                    $cell: true,
                    $type: "button",
                    class: "mdc-fab material-icons " + addClass,
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

            var addClass = "";
            if (obj.styleClass){
                addClass = obj.styleClass;
            }

            return {
                    $cell: true,
                    $type: "button",
                    class: "mdc-button" + addClass,
                    onclick: obj.onclickfunc,
                    $components:[
                        {
                            $cell: true,
                            $type: "i",
                            class: "material-icons mdc-button__icon",
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

        gridListItem(obj) {
            return {
                $cell: true,
                $type: "li",
                class: "mdc-grid-tile " + obj.styleClass,
                $components:[
                    {
                        $cell: true,
                        class: "mdc-grid-tile__primary",
                        $type: "div",
                        style: "background-color: transparent;",
                        $components:[
                            {
                                $cell: true,
                                class: "mdc-grid-tile__primary-content tooltip",
                                $type: "div",
                                'aria-label': obj.title,
                                alt: obj.title,
                                style: "background-image: url("+ obj.imgSrc + ");",
                                onclick: obj.onclickfunc,
                                $components:[
                                    {
                                        $cell: true,
                                        class: "tooltiptext",
                                        $type: "span",
                                        $text: obj.title
                                    }
                                ]
                            }
                            
                           
                        ]
                    }
                ]
            }
        }

        switch(obj) {

            return   {
                $cell: true,
                $type: "div",
                class: "mdc-switch",
                _switch: null,
                id: obj.id,
                $init: obj.init, 
                //function(){
                //     new mdc.switchControl.MDCSwitch(this);
                // },
                $components: [
                    {
                        $type: "div",
                        class: "mdc-switch__track",
                    },
                    {
                        $type: "div",
                        class: "mdc-switch__thumb-underlay",
                        $components:[
                            {
                                $type: "div",
                                class: "mdc-switch__thumb",
                                $components:[
                                    {
                                        $type: "input",
                                        type: "checkbox",
                                        class: "mdc-switch__native-control",
                                        id: 'input-' + obj.id,
                                        //$init: obj.init,
                                        //id: "basic-switch",
                                        onchange: obj.onchange,
                                        role: "switch"
                                    }
                                ]
                            }
                        ]
                    }
                    
                    // {
                    //     $type: "div",
                    //     class: "mdc-switch__background",
                    //     $components: [
                    //         {
                    //             $type: "div",
                    //             class: "mdc-switch__knob"
                    //         }
                    //     ]
                    // }
                ]
            }

        }


        reflectorGUI() {

            let reflectorGUI =
            {
                $type: "div",
                id: "reflectorGUI",
                //style:"background-color: #efefef",
                class: "mdc-layout-grid mdc-layout-grid--align-left",
                _reflectorHost: null,
                _dbHost: null,
                _refHostField: null,
                _dbHostField: null,
                _initData: function () {
                    this._reflectorHost = '';
                    this._dbHost = '';
        
                    let config = JSON.parse(localStorage.getItem('lcs_config'));
        
                    if (config.reflector) {
                        this._reflectorHost = config.reflector
                    }
                    if (config.dbhost) {
                        this._dbHost =config.dbhost
                    }
                },
                $init: function () {
                    this._initData();
                },
                $update: function () {
        
                    this.$components = [
                        {
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                    {
                                        $type: "h4",
                                        class: "mdc-typography--headline4",
                                        $text: "Connection settings"
                                    }
                                ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        {
                                            $type: "span",
                                            class: "mdc-typography--headline5",
                                            $text: "Reflector: "
                                        },
                                        window._app.widgets.inputTextFieldOutlined({
                                            "id": 'reflectorInput',
                                            "label": "Reflector",
                                            "value": this._reflectorHost,
                                            "type": "text",
                                            "init": function() {
                                                        this._refHostField = new mdc.textField.MDCTextField(this);
                                                    },
                                            "style": 'width: 400px;'
                                        }),
                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        {
                                            $type: "span",
                                            class: "mdc-typography--headline5",
                                            $text: "DB Host: "
                                        },
                                        window._app.widgets.inputTextFieldOutlined({
                                            "id": 'dbhostInput',
                                            "label": "DB Host",
                                            "value": this._dbHost,
                                            "type": "text",
                                            "init": function() {
                                                this._dbHostField = new mdc.textField.MDCTextField(this);
                                            },
                                            "style": 'width: 400px;'
                                        }),
                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        window._app.widgets.buttonRaised(
                                            {
                                                "label": 'Update',
                                                "onclick": function (e) {
                                                    e.preventDefault();
        
                                                    let config = JSON.parse(localStorage.getItem('lcs_config'));
        
                                                    config.reflector = this._refHostField.value;
                                                    config.dbhost = this._dbHostField.value;
        
                                                    localStorage.setItem('lcs_config', JSON.stringify(config));
                                                    window.location.reload(true);
                                                }
                                            }),
                                            {
                                              $type: 'span',
                                              $text: " "
                                            },
                                            {
                                              $type: "button",
                                              class: "mdc-button mdc-button--raised",
                                              $text: "Close",
                                              onclick: function (e) {
                                                  window.location.pathname = '/'
                                              }
                                            }
                                    ]
                                }
        
                            ]
                        }
                    ]
                }
        
            }
        
            document.querySelector("#appGUI").$cell({
                id: "appGUI",
                $cell: true,
                $type: "div",
                $components: [reflectorGUI]
            }
            );
        
        }


      }

   export { Widgets }

