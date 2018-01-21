import { Lang } from '/web/lib/polyglot-lang.js';

var options = {
    
        query: 'pathname=' + window.location.pathname.slice(1,
            window.location.pathname.lastIndexOf("/")),
        secure: window.location.protocol === "https:",
        reconnection: false,
        transports: ['websocket']
    
    };

    const langPhrases = {
        "en":{
            "start": "Start new",
            "users": "Users online: "

        },
        "ru": {
            "start": "Создать",
            "users": "Пользователей онлайн: "
        }
    }



    const prepareLang = () => {
        let langID = localStorage.getItem('krestianstvo_locale');
        let phrases = langPhrases[langID];
        let lang = new Lang;
        return new lang.polyglot({ phrases });
    }

    const language = prepareLang();

    const translations = {
        "titleText":{
            "en": '<h1 class="mdc-typography--display3 mdc-theme--text-secondary-on-background mdc-typography"><a class="mdc-typography link-in-text" style="cursor: pointer;" onclick="window.location.reload(true)"><strong>LiveCoding</strong>.space</a><!--<strong>LiveCoding</strong>.space --></h1>',

            "ru":'<h1 class="mdc-typography--display3 mdc-theme--text-secondary-on-background mdc-typography"><a class="mdc-typography link-in-text" style="cursor: pointer;" onclick="window.location.reload(true)"><strong>LiveCoding</strong>.пространство</a><!--<strong>LiveCoding</strong>.space --></h1>'
        },
        "headerText": {
          'en': '<h1 class="mdc-typography mdc-typography--headline mdc-typography--adjust-margin mdc-theme--text-hint-on-background">Collaborative Live Coding Space with support of user-defined languages and WebVR ready 3D graphics.<br> Based on: <strong>Virtual World Framework | A-Frame | Ohm language | OSC.js | and more... </strong> by <a class="mdc-typography link-in-text mdc-theme--text-hint-on-background" href="https://www.krestianstvo.org"><strong>Krestianstvo.org</strong></a> </h1>',

          "ru":'<h1 class="mdc-typography mdc-typography--headline mdc-typography--adjust-margin mdc-theme--text-hint-on-background">Виртуальное обучающее пространство в веб-браузере с функциями живого кодирования,  возможностью создания собственных языков программирования, технологий виртуальной/дополненной/смешанной реальности WebVR.<br> На основе: <strong>Virtual World Framework | A-Frame | Ohm language | OSC.js | ... </strong> проект <a class="mdc-typography link-in-text mdc-theme--text-hint-on-background" href="https://www.krestianstvo.org"><strong>Krestianstvo.org</strong></a> </h1>'
        },

        "featuresText": {
            "en": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Features</h1> <ul class="featureList mdc-typography mdc-typography--title mdc-theme--text-hint-on-background"> <li><strong>Decentralized network model</strong> for <strong>A-Frame</strong> components and entities based on <strong>VWF</strong> replicated computation architecture</li> <li><strong>Ohm</strong> language driver for sharing user-defined grammars, parsers, tokenisers inside virtual space</li><li>In browser <strong>Code and Properties editor</strong> based on Cell.js</li><li><strong>OSC </strong>messaging through <a class="mdc-typography link-in-text mdc-theme--text-hint-on-background" href="https://github.com/NikolaySuslov/osc-relay-lcs">OSC relay</a> on the client</li><li><strong>Avatars</strong> (Simple and GLTF models with animation)</li><li><strong>Multi-window</strong> or multi-monitor/multi-machine setups with view <strong>offset cameras</strong></li><li><strong>WebRTC</strong> for video/audio streaming,<strong>3D positional audio</strong> support</li><li><strong>GearVR, Windows MixedReality</strong> motion controllers</li> </ul>',

            "ru": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">О программе</h1> <ul class="featureList mdc-typography mdc-typography--title mdc-theme--text-hint-on-background"> <li><strong> Децентрализованная модель приложения </strong> на основе <strong>A-Frame</strong> компонентов и <strong>VWF</strong> архитектуры распределенных вычислений (репликация и виртуальное время) в сети.  </li> <li><strong>Ohm</strong> драйвер для совместного создания пользовательских языков программирования, грамматик, парсеров, токенайзеров внутри виртуального пространства</li><li><strong>Редактор кода и параметров объектов</strong> прямо в веб-браузере на основе Cell.js</li><li>Работа с <strong>OSC </strong>сообщениями через <a class="mdc-typography link-in-text mdc-theme--text-hint-on-background" href="https://github.com/NikolaySuslov/osc-relay-lcs">OSC relay</a></li><li><strong>Аватары</strong> (простые или GLTF модели с анимацией)</li><li><strong>Мульти-оконные</strong> и мульти-мониторные/компьютерные/телефонные проекции с применением виртуальных камер со <strong>смещением вида</strong></li><li><strong>WebRTC</strong> для видео/аудио потоковой передачи данных P2P, с функциями <strong>звукового 3D позиционирования</strong> в виртуальном пространстве</li><li><strong>GearVR, Windows MixedReality</strong> контроллеры движения</li> </ul>'
        },
        "worldInfo":{
            "en": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Virtual Worlds</h1><h1 class="mdc-typography mdc-typography--headline mdc-theme--text-hint-on-background">To begin collaborative coding in virtual space, just start one of the listed prototypes and connect to it from another browser window using the generated link. The link will apper near the <strong>Start new</strong> button.</h1>',
            
            "ru":'<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Виртуальные миры</h1><h1 class="mdc-typography mdc-typography--headline mdc-theme--text-hint-on-background">Чтобы начать работу в виртуальном обучающем пространстве, выберите один из прототипов миров и запустите его нажав на кнопку <strong>Создать</strong>. Для вновь созданного мира сгенерируется уникальная ссылка, которая отобразиться под его описанием. Для совместной работы, войдите с помощью этой ссылки с другого компьютера или окна браузера. Из прототипа можно создавать неограниченное количество миров. Рядом с ссылками так же указывается количество пользователей, находящихся онлайн в указанном мире.</h1>'
        },
        "demoText":{
            "en":  '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Demo videos</h1>',
            "ru": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Видео демонстрации</h1>'
        }


      }
  
      const initLocale = () => {

        if (!localStorage.getItem('krestianstvo_locale'))
            localStorage.setItem('krestianstvo_locale', 'en');
      }

      const setLocale = (langID) => {
        localStorage.setItem('krestianstvo_locale', langID);
      }
  
      const getTranslationFor = (aString) => {
        let locale = localStorage.getItem('krestianstvo_locale');
        return translations[aString][locale]
      }

      const setLanguage = (langID) => { 
            setLocale(langID);
            generateFrontPage();
      }

    function generateFrontPage(){

        let allTextEl = ["titleText", "headerText", "featuresText", "worldInfo", "demoText"];

        allTextEl.forEach(el => {
            let textEl = document.querySelector("#" + el);
            textEl.innerHTML = getTranslationFor(el);
        })

    }

    
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
    
    function getSiteHeader(){
        return  {
            $type: "div",
            class: "mdc-layout-grid",
            $components: [
                {
                    $type: "div",
                    class: "mdc-layout-grid__inner",
                    $components: [
                        {
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                            $components: [
                                
                        {
                            $cell: true,
                            $type: "h1",
                            class: "mdc-typography--display1 mdc-theme--text-hint-on-background",
                            $text: "Virtual Worlds"
                        }
                    ]
                }
                    ]
                }
            ]

        }
        
        
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
                let langID = localStorage.getItem('krestianstvo_locale');
                var appInfo = m
                if(langID) {
                    if(m[1][langID]){
                        appInfo = [m[0], m[1][langID]]
                    }
                }
                return {
                    $cell: true,
                    $type: "div",
                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                    $components: [
                        this._worldCardDef(appInfo)
                    ]
                }
    
            },
            $update: function () {
                this.$components = [
                   //getSiteHeader(),// siteHeader,
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
                                    this.style.backgroundImage = 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url(' + desc[1].imgUrl + ')';
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
                                    class: "mdc-button mdc-button--compact mdc-card__action mdc-button--stroked",
                                    $text: language.t('start'),//"Start new",
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
                                                            href: window.location.protocol + "//" + m[1].instance,
                                                            onclick: function (e) {
                                                                refresh();
                                                            }
                                                        },
                                                        {
                                                            $type: "span",
                                                            class: "mdc-list-item__text__secondary",
                                                            $text: language.t('users') + m[1].clients
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
    
    function getAppDetails(val) {
    
        let appDetails = httpGetJson(val)
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
    
    export {getAppDetails, generateFrontPage, setLanguage, initLocale};