class Lang {

    constructor() {
        console.log("lang constructor");
        this.polyglot = Polyglot;

        if (localStorage.getItem('krestianstvo_locale')) {
        } else {
            localStorage.setItem('krestianstvo_locale', 'en');
        }
        this.locale = localStorage.getItem('krestianstvo_locale');
    }

    initLocale() {

        if (!localStorage.getItem('krestianstvo_locale'))
            localStorage.setItem('krestianstvo_locale', 'en');
    }

    async getLang(langID) {
        let response = await fetch("/web/locale/" + langID + ".json");
        let data = await response.json();
        return data
    }

    setLanguage(langID) {
        var self = this;
        return this.getLang(langID).then(phrases => {
            this.language = new Polyglot({ phrases });
        });
    }

    setLocale(langID) {
        localStorage.setItem('krestianstvo_locale', langID);
        this.locale = langID;
    }

    getTranslationFor(aString) {
        let locale = localStorage.getItem('krestianstvo_locale');
        return this.translations[aString][locale]
    }

    changeLanguageTo(langID) {
        this.setLocale(langID);
        this.setLanguage(langID);
    }

    get langPhrases() {

        // let langID = localStorage.getItem('krestianstvo_locale');
        let phrases = {
            "en": {
                "start": "Start new",
                "users": "Users online: "

            },
            "ru": {
                "start": "Создать",
                "users": "Пользователей онлайн: "
            }
        }

        return phrases[this.locale]
    }

    get translations() {

        let appText = {
            "titleText": {
                "en": '<h1 class="mdc-typography--display3 mdc-theme--text-secondary-on-background mdc-typography"><a class="mdc-typography link-in-text" style="cursor: pointer;" onclick="window.location.reload(true)"><strong>LiveCoding</strong>.space</a><!--<strong>LiveCoding</strong>.space --></h1>',

                "ru": '<h1 class="mdc-typography--display3 mdc-theme--text-secondary-on-background mdc-typography"><a class="mdc-typography link-in-text" style="cursor: pointer;" onclick="window.location.reload(true)"><strong>LiveCoding</strong>.пространство</a><!--<strong>LiveCoding</strong>.space --></h1>'
            },
            "headerText": {
                'en': '<h1 class="mdc-typography mdc-typography--headline mdc-typography--adjust-margin mdc-theme--text-hint-on-background">Collaborative Live Coding Space with support of user-defined languages and WebVR ready 3D graphics.<br> Based on: <strong>Virtual World Framework | A-Frame | Ohm language | OSC.js | and more... </strong> by <a class="mdc-typography link-in-text mdc-theme--text-hint-on-background" href="https://www.krestianstvo.org"><strong>Krestianstvo.org</strong></a> </h1>',

                "ru": '<h1 class="mdc-typography mdc-typography--headline mdc-typography--adjust-margin mdc-theme--text-hint-on-background">Виртуальное обучающее пространство в веб-браузере с функциями живого кодирования,  возможностью создания собственных языков программирования, технологий виртуальной/дополненной/смешанной реальности WebVR.<br> На основе: <strong>Virtual World Framework | A-Frame | Ohm language | OSC.js | ... </strong> проект <a class="mdc-typography link-in-text mdc-theme--text-hint-on-background" href="https://www.krestianstvo.org"><strong>Krestianstvo.org</strong></a> </h1>'
            },

            "featuresText": {
                "en": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Features</h1> <ul class="featureList mdc-typography mdc-typography--title mdc-theme--text-hint-on-background"> <li><strong>Decentralized network model</strong> for <strong>A-Frame</strong> components and entities based on <strong>VWF</strong> replicated computation architecture</li> <li><strong>Ohm</strong> language driver for sharing user-defined grammars, parsers, tokenisers inside virtual space</li><li>In browser <strong>Code and Properties editor</strong> based on Cell.js</li><li><strong>OSC </strong>messaging through <a class="mdc-typography link-in-text mdc-theme--text-hint-on-background" href="https://github.com/NikolaySuslov/osc-relay-lcs">OSC relay</a> on the client</li><li><strong>Avatars</strong> (Simple and GLTF models with animation)</li><li><strong>Multi-window</strong> or multi-monitor/multi-machine setups with view <strong>offset cameras</strong></li><li><strong>WebRTC</strong> for video/audio streaming,<strong>3D positional audio</strong> support</li><li><strong>GearVR, Windows MixedReality</strong> motion controllers</li> </ul>',

                "ru": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">О программе</h1> <ul class="featureList mdc-typography mdc-typography--title mdc-theme--text-hint-on-background"> <li><strong> Децентрализованная модель приложения </strong> на основе <strong>A-Frame</strong> компонентов и <strong>VWF</strong> архитектуры распределенных вычислений (репликация и виртуальное время) в сети.  </li> <li><strong>Ohm</strong> драйвер для совместного создания пользовательских языков программирования, грамматик, парсеров, токенайзеров внутри виртуального пространства</li><li><strong>Редактор кода и параметров объектов</strong> прямо в веб-браузере на основе Cell.js</li><li>Работа с <strong>OSC </strong>сообщениями через <a class="mdc-typography link-in-text mdc-theme--text-hint-on-background" href="https://github.com/NikolaySuslov/osc-relay-lcs">OSC relay</a></li><li><strong>Аватары</strong> (простые или GLTF модели с анимацией)</li><li><strong>Мульти-оконные</strong> и мульти-мониторные/компьютерные/телефонные проекции с применением виртуальных камер со <strong>смещением вида</strong></li><li><strong>WebRTC</strong> для видео/аудио потоковой передачи данных P2P, с функциями <strong>звукового 3D позиционирования</strong> в виртуальном пространстве</li><li><strong>GearVR, Windows MixedReality</strong> контроллеры движения</li> </ul>'
            },
            "worldInfo": {
                "en": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Virtual Worlds</h1><h1 class="mdc-typography mdc-typography--headline mdc-theme--text-hint-on-background">To begin collaborative coding in virtual space, just start one of the listed prototypes and connect to it from another browser window using the generated link. The link will apper near the <strong>Start new</strong> button.</h1>',

                "ru": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Виртуальные миры</h1><h1 class="mdc-typography mdc-typography--headline mdc-theme--text-hint-on-background">Чтобы начать работу в виртуальном обучающем пространстве, выберите один из прототипов миров и запустите его нажав на кнопку <strong>Создать</strong>. Для вновь созданного мира сгенерируется уникальная ссылка, которая отобразиться под его описанием. Для совместной работы, войдите с помощью этой ссылки с другого компьютера или окна браузера. Из прототипа можно создавать неограниченное количество миров. Рядом с ссылками так же указывается количество пользователей, находящихся онлайн в указанном мире.</h1>'
            },
            "demoText": {
                "en": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Demo videos</h1>',
                "ru": '<h1 class="mdc-typography--display1 mdc-theme--text-hint-on-background">Видео демонстрации</h1>'
            }
        }
        return appText
    }
    
}

export { Lang };