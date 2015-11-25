///<reference path="../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import I18nLoader = require("hornet-js-core/src/i18n/i18n-loader");

var messagesFRfr:any = require("src/resources/messages-fr-FR");
var messagesDefault:any = require("src/resources/messages");

/**
 * Classe utilisée uniquement côté serveur.
 */
class AppI18nLoader extends I18nLoader {

    getMessages(locales:Array<string>):any {

        /**
         *  Extraits les messages de fichiers, de base de données....
         *  Doit retourner un flux JSON conform au module react-intl.
         */

        var messages:string;
        var locale:string = "";
        if (locales && locales.length && locales.length > 0) {
            locale = locales[0];
        }
        if (locale === "fr-FR") {
            messages = messagesFRfr;
        } else {
            messages = messagesDefault;
        }
        return {locale: locale, messages: messages};
    }

}
export = AppI18nLoader;