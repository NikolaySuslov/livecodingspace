'use strict';

define([
    "vwf/view/lib/polyglot/polyglot.min",
], function (polyglot) {

    var self;

    class Lang {
        constructor() {
            console.log("lang constructor");
            this.polyglot = polyglot;

            if (localStorage.getItem('locale')) {
            } else {
                localStorage.setItem('locale', 'en');
            }
            this.locale = localStorage.getItem('locale');
            this.setLanguage(this.locale);

        }

        async getLang(langID) {
            let response = await fetch("/web/locale/" + langID + ".json");
            let data = await response.json();
            return data
        }

        setLanguage(langID) {
            this.getLang(langID).then(phrases => {
                this.language = new polyglot({ phrases });
            });
        }

        setLocale(langID){
            localStorage.setItem('locale', langID);
            this.locale = langID;
        }

        changeLanguageTo(langID){
            this.setLocale(langID);
            this.setLanguage(langID);
        }

    }

    return new Lang;
})