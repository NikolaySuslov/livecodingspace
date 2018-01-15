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

    setLocale(langID){
        localStorage.setItem('krestianstvo_locale', langID);
        this.locale = langID;
    }

    changeLanguageTo(langID){
        this.setLocale(langID);
        this.setLanguage(langID);
    }

}

  export {Lang};