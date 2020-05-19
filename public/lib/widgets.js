/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

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
                class: "mdc-list-divider"
            }
        }

        get emptyDiv(){
            return {
                $type: "div",
                style: "padding-bottom: 30px;"
            }
        }

        get break(){
            return {
                $type: "br"
            }
        }

        get space() {
           return {
                $type: "span",
                $text: " "
            }
        }

        get p(){
            return {
                $type: "p"
            }
        }

            inputTextFieldOutlined(obj){
                function initFunc() {
                    new mdc.textField.MDCTextField.attachTo(this);
                }
                let inputType = obj.type ? obj.type: 'text';
                let init = obj.init ? obj.init: initFunc;

                let style = obj.style ? obj.style: "";
                let fieldStyle = obj.fieldStyle ? obj.fieldStyle: "";

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
                            onchange: obj.change,
                            style: obj.fieldStyle
                        },
                        {
                            $type: "div",
                            class: "mdc-notched-outline",
                            $components:[
                                {
                                    $type: "div",
                                    class: "mdc-notched-outline__leading"
                                },
                                {
                                    $type: "div",
                                    class: "mdc-notched-outline__notch",
                                    $components:[
                                        {
                                            $type: "label",
                                            class: "mdc-floating-label",
                                            for: obj.id,
                                            $text: obj.label
                                        }
                            ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-notched-outline__trailing"
                                }

                            ]
                        }
                       
                        
                      
                    ]
                    //onclick: obj.onclick
                }
            }

            inputTextFieldStandart(obj){
                var propValue = obj.value;
                if (_app.helpers.testJSON(obj.value)){
                    propValue = JSON.parse(obj.value);
                }  else {
                propValue = obj.value;
            }

                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-text-field text-field mdc-ripple-upgraded",
                    _mdc: null,
                    $init: function(){
                    //new mdc.mdc.notchedOutline.MDCNotchedOutline(document.querySelector('.mdc-notched-outline'));
                       this._mdc = new mdc.textField.MDCTextField.attachTo(this);
                    },
                    $components:[
                        {
                            $type: "input",
                            type: "text",
                            id: obj.id,
                            class: "mdc-text-field__input",
                            value: propValue,
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
                $components: [
                    {
                        $type: "span",
                        class: "mdc-button__label",
                        $text: obj.label
                    }
                ],
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
                $type: "button",
                class: addClass + " mdc-icon-button",
                //$text: obj.label,
                id: obj.id,
                //'data-toggle-on': obj.on,
               // 'data-toggle-off': obj.off,
                'aria-pressed': obj.state,
                'aria-hidden': true,
                $init: obj.init,
                $components:[
                    {
                    $type: "i",
                    class: "material-icons mdc-icon-button__icon mdc-icon-button__icon--on",
                    $text: JSON.parse(obj.on).content
                },
                {
                    $type: "i",
                    class: "material-icons mdc-icon-button__icon",
                    $text: JSON.parse(obj.off).content  
                },
                ]
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
                    class: "mdc-button " + addClass,
                    onclick: obj.onclick,
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

        listTitle(obj){
            return {
                $type: "div",
                class: "mdc-layout-grid__inner",
                $components: [
                    {
                        $type: "div",
                        class: "mdc-layout-grid__cell",
                        $components: [
                            {
                                $type: "h3",
                                class: "",
                                $text: obj.text
                            }
                        ]
                    }
                ]
            }
        }

        gridListItem(obj) {
            return {
                $type: "div",
                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2 tooltip " + obj.styleClass,
                $components:[
                    {
                        class: "tooltiptext",
                        $type: "span",
                        $text: obj.title
                    },
                    {
                        $type: "div",
                        style: "background-color: transparent;",
                        $components:[
                            {
                                class: "",
                                $type: "div",
                                'aria-label': obj.title,
                                alt: obj.title,
                                style: "background-image: url("+ obj.imgSrc + "); background-size: cover; background-repeat: no-repeat; height: "+ obj.imgSize + "; width: " + obj.imgSize + ";",
                                onclick: obj.onclickfunc,
  
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


        connectionSettingsGUI() {

            let connectionSettings = {
                id: 'connectionSettings',
                $type: 'div',
                $components: [ 
                _app.widgets.emptyDiv,
                window._app.widgets.buttonRaised(
                    {
                        "label": 'Connection settings',
                        "onclick": function (e) {
                            e.preventDefault();
                            window.location.pathname = '/settings';
                        }
                    }), _app.widgets.emptyDiv
                ]
            }

            return connectionSettings
            
        }

        reflectorGUI() {

            let webrtcConnection = {
                $cell: true,
                $components: [
                  {
                    $type: "p",
                    class: "mdc-typography--headline5",
                    $text: "Use WebRTC for connection"
                  },
                  {
                    $type: 'p'
                  },
                  _app.widgets.switch({
                    'id': 'forceWebRTC',
                    'init': function () {
                      this._switch = new mdc.switchControl.MDCSwitch(this);
                      let config = localStorage.getItem('lcs_config');
                      this._switch.checked = JSON.parse(config).webrtc;
                      
                     // this._replaceSwitch = this._switch;
                      
                    },
                    'onchange': function (e) {
    
                        if (this._switch) {
                            let chkAttr = this._switch.checked;//this.getAttribute('checked');
                            if (chkAttr) {
                                let config = JSON.parse(localStorage.getItem('lcs_config'));
                                config.webrtc = true;
                                localStorage.setItem('lcs_config', JSON.stringify(config));
                                //this._switch.checked = false;
                            } else {
                                let config = JSON.parse(localStorage.getItem('lcs_config'));
                                config.webrtc = false;
                                localStorage.setItem('lcs_config', JSON.stringify(config));
                            }
                        }
                    }
                  }
                  ),
                  {
                    $type: 'label',
                    for: 'input-forceWebRTC',
                    $text: 'On / Off'
                  }
    
                ]
              }

            let luminaryGlobalHB = {
                $cell: true,
                _luminarySwitch: null,
                $components: [
                  {
                    $type: "p",
                    class: "mdc-typography--headline5",
                    $text: "Use Global Heartbeat"
                  },
                  {
                    $type: 'p'
                  },
                  _app.widgets.switch({
                    'id': 'forceLuminary',
                    'init': function () {
                      this._switch = new mdc.switchControl.MDCSwitch(this);
                      let config = localStorage.getItem('lcs_config');
                      this._switch.checked = JSON.parse(config).luminaryGlobalHB;
                      
                     // this._replaceSwitch = this._switch;
                      
                    },
                    'onchange': function (e) {
    
                        if (this._switch) {
                            let chkAttr = this._switch.checked;//this.getAttribute('checked');
                            if (chkAttr) {
                                let config = JSON.parse(localStorage.getItem('lcs_config'));
                                config.luminaryGlobalHB = true;
                                localStorage.setItem('lcs_config', JSON.stringify(config));
                                //this._switch.checked = false;
                            } else {
                                let config = JSON.parse(localStorage.getItem('lcs_config'));
                                config.luminaryGlobalHB = false;
                                localStorage.setItem('lcs_config', JSON.stringify(config));
                            }
                        }
                    }
                  }
                  ),
                  {
                    $type: 'label',
                    for: 'input-forceLuminary',
                    $text: 'On / Off'
                  }
    
                ]
              }


              let luminaryFeature = {
                $type: 'div',
                _luminarySwitch: null,
                $components: [
                    {
                        $type: "p",
                        class: "mdc-typography--headline4",
                        $text: "Use Krestianstvo Luminary (experimental)"
                    },
                    {
                        $type: 'p'
                    },
                    _app.widgets.switch({
                        'id': 'forceLuminary',
                        'init': function () {
                            this._switch = new mdc.switchControl.MDCSwitch(this);
                            let config = localStorage.getItem('lcs_config');
                            this._switch.checked = JSON.parse(config).luminary;
    
                            // this._replaceSwitch = this._switch;
    
                        },
                        'onchange': function (e) {
    
                            if (this._switch) {
                                let chkAttr = this._switch.checked;//this.getAttribute('checked');
                                if (chkAttr) {
                                    let config = JSON.parse(localStorage.getItem('lcs_config'));
                                    config.luminary = true;
                                    localStorage.setItem('lcs_config', JSON.stringify(config));
                                    window.location.reload(true);
                                    //this._switch.checked = false;
                                } else {
                                    let config = JSON.parse(localStorage.getItem('lcs_config'));
                                    config.luminary = false;
                                    localStorage.setItem('lcs_config', JSON.stringify(config));
                                    window.location.reload(true);
                                }
                            }
                        }
                    }
                    ),
                    {
                        $type: 'label',
                        for: 'input-forceLuminary',
                        $text: 'Off / On'
                    },
                    _app.widgets.p
    
                ]
            }
    

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
                _lpath: null,
                _lpathField: null,
                _hbpath: null,
                _hbpathField: null,
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
                    if (config.luminaryPath) {
                        this._lpath = config.luminaryPath
                    }
                    if (config.luminaryGlobalHBPath) {
                        this._hbpath = config.luminaryGlobalHBPath
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
                                        $text: "Gun DB settings"
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
                                    {
                                        $type: "h4",
                                        class: "mdc-typography--headline4",
                                        $text: "Reflector settings"
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
                                    $components: [webrtcConnection ]
                                   },
                                   { 
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [_app.widgets.divider]
                                   },
                                  
                                // {
                                //     $type: "div",
                                //     class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                //     $components: [
                                //     {
                                //         $type: "h4",
                                //         class: "mdc-typography--headline4",
                                //         $text: "Krestianstvo Luminary settings (experimental)"
                                //     }
                                // ]
                                // },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        luminaryFeature
                                ]
                                },
                               
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        {
                                            $type: "span",
                                            class: "mdc-typography--headline5",
                                            $text: "Luminary Path: "
                                        },
                                        window._app.widgets.inputTextFieldOutlined({
                                            "id": 'lpathInput',
                                            "label": "Luminary Path",
                                            "value": this._lpath,
                                            "type": "text",
                                            "init": function() {
                                                this._lpathField = new mdc.textField.MDCTextField(this);
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
                                            $text: "Global Heartbeat Path: "
                                        },
                                        window._app.widgets.inputTextFieldOutlined({
                                            "id": 'hbpathInput',
                                            "label": "Global Heartbeat Path",
                                            "value": this._hbpath,
                                            "type": "text",
                                            "init": function() {
                                                this._hbpathField = new mdc.textField.MDCTextField(this);
                                            },
                                            "style": 'width: 400px;'
                                        }),
                                    ]
                                },
                               { 
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                $components: [luminaryGlobalHB ]
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
                                                    config.luminaryPath = this._lpathField.value;
                                                    config.luminaryGlobalHBPath = this._hbpathField.value;
        
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


        getLoginGUI(){

            let loginGUI =
            {
                $type: "div",
                id: "loginGUI",
                //style:"background-color: #efefef",
                class: "mdc-layout-grid mdc-layout-grid--align-left",
                _alias: null,
                _pass: null,
                _passField: null,
                _aliasField: null,
                _initData: function () {
                    this._alias = '';
                    this._pass = '';
                    // if (window.sessionStorage.getItem('alias')) {
                    //     this._alias = window.sessionStorage.getItem('alias')
                    // }
                    // if (window.sessionStorage.getItem('tmp')) {
                    //     this._pass = window.sessionStorage.getItem('tmp')
                    // }
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
                                            $type: "span",
                                            class: "mdc-typography--headline5",
                                            $text: _l.t("login") + ": "
                                        },
                                        window._app.widgets.inputTextFieldOutlined({
                                            "id": 'aliasInput',
                                            "label": _l.t("login"),
                                            "value": this._alias,
                                            "type": "text",
                                            "init": function () {
                                                this._aliasField = new mdc.textField.MDCTextField(this);
                                            }
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
                                            $text: _l.t("password") + ": "
                                        },
                                        window._app.widgets.inputTextFieldOutlined({
                                            "id": 'passwordInput',
                                            "label": _l.t("password"),
                                            "value": this._pass,
                                            "type": "password",
                                            "init": function () {
                                                this._passField = new mdc.textField.MDCTextField(this);
                                            }
                                        }),
                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        window._app.widgets.buttonRaised(
                                            {
                                                "label": _l.t("sign up"),
                                                "onclick": function (e) {
                                                    e.preventDefault();
    
                                                    let alias = this._aliasField.value;
                                                    let pass = this._passField.value
    
                                                    if (pass.length < 7) {
                                                        new Noty({
                                                            text: "Your passphrase needs to be longer than 7 letters",
                                                            timeout: 2000,
                                                            theme: 'mint',
                                                            layout: 'bottomRight',
                                                            type: 'error'
                                                        }).show();
                                                    } else {
                                                        //
                                                        _LCSDB.user().create(alias, pass,
                                                            function (ack) {
                                                                if (!ack.wait) { }
                                                                if (ack.err) {
                                                                    console.log(ack.err)
                                                                    return ack.err
                                                                };
                                                                if (ack.pub) {
                                                                    let userObj = {
                                                                        'alias': alias,
                                                                        'pub': ack.pub
                                                                    };
                                                                    _LCSDB.get('users').get(alias).put(userObj);
    
                                                                }
                                                                _LCSDB.user().auth(alias, pass);
                                                            });
    
                                                    }
                                                }
                                            }),
                                        _app.widgets.space,
                                        window._app.widgets.buttonRaised(
                                            {
                                                "label": _l.t("sign in"),
                                                "onclick": function (e) {
                                                    e.preventDefault();
                                                    let alias = this._aliasField.value;
                                                    let pass = this._passField.value
                                                    _app.helpers.authUser(alias, pass);
                                                    // _LCSDB.user().auth.call(_LCSDB, alias, pass
                                                    // //     , function(ack) {
    
                                                    // //     if (ack.err) {
                                                    // //         new Noty({
                                                    // //             text: ack.err,
                                                    // //             timeout: 2000,
                                                    // //             theme: 'mint',
                                                    // //             layout: 'bottomRight',
                                                    // //             type: 'error'
                                                    // //         }).show();
    
                                                    // //     }
                                                    //  //}
                                                    //  );
                                                }
                                            })
    
    
    
                                    ]
                                }
    
                            ]
                        }
                    ]
                }
    
            }
            return loginGUI
        }


      }

   export { Widgets }

