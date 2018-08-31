class Lang {
    constructor() {
        console.log("lang constructor");
        this.polyglot = Polyglot;

        if (localStorage.getItem('krestianstvo_locale')) {
        } else {
            localStorage.setItem('krestianstvo_locale', 'en');
        }
        //this.locale = localStorage.getItem('krestianstvo_locale');
        //this.setLanguage(this.locale);

    }

    async getLang(langID) {
        let response = await fetch("/lib/locale/"+ langID + '/' + langID + ".json");
        let data = await response.json();
        return data
    }

   async setLanguage(langID) {
       var currentLang = localStorage.getItem('krestianstvo_locale');
      if (langID) {
        currentLang = langID
      }
       let phrases = await this.getLang(currentLang);
       this.language = new Polyglot({ phrases });

        // this.getLang(langID).then(phrases => {
        //     this.language = new polyglot({ phrases });
        //     return phrases
        // });
    }

    get locale() {
        return localStorage.getItem('krestianstvo_locale')
    }

    set locale(langID){
        localStorage.setItem('krestianstvo_locale', langID);
    }

    // setLocale(langID){
    //     localStorage.setItem('krestianstvo_locale', langID);
    //     this.locale = langID;
    // }

    async changeLanguageTo(langID){
        this.setLocale(langID);
        await this.setLanguage(langID);
    }

}

export { Lang }