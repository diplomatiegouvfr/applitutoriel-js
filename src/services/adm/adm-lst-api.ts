///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import ServiceApi = require("hornet-js-core/src/services/service-api");
import utils = require("hornet-js-utils");
import Promise = require("bluebird");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");

var logger = utils.getLogger("applitutoriel.services.adm.adm-lst-api");
var WError = utils.werror;
var _ = utils._;

class SecteurApi extends ServiceApi {
    lister() {
        logger.info("SERVICES - lister");

        return new Promise((resolve:(n: ActionsChainData) => void, reject) => {
            logger.debug("Demande de listing des secteurs sur le serveur");
            this.request()
                .get(this.buildUrl("/secteurs")) //
                .end(this.endFunction(resolve, reject
                    , "Listing des secteurs"));
        });
    }

    supprimer(id) {
        logger.info("SERVICES - supprimer : ", id);

        return new Promise((resolve:(n: ActionsChainData) => void, reject) => {
            logger.debug("Suppression du secteur : ", id);
            if (!_.isNumber(parseInt(id))) {
                reject(new WError(this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-AD-ESE-06"), {"id": id})));
            }

            var path = "/secteurs";
            if (utils.isServer) {
                path = path + "/" + id;
            } else {
                path = path + "/supprimer/" + id;
            }

            this.request()
                .del(this.buildUrl(path)) //
                .end(this.endFunction(resolve, reject
                    , "Suppression du secteur avec l'id " + id));
        });
    }

    creer(secteur) {
        logger.info("SERVICES - creer : ", secteur);

        return new Promise((resolve:(n: ActionsChainData) => void, reject) => {
            logger.debug("Envoi d'une création de secteur : ", secteur);
            var path = "/secteurs";
            if (!utils.isServer) {
                path = path + "/creer"; //vers Node
            }

            this.request()
                .post(this.buildUrl(path)) //
                .send(secteur) //
                .end(this.endFunction(resolve, reject
                    , "Création d'un secteur"));
        });


    }

    modifier(id, secteur) {
        logger.info("SERVICES - modifier : ", id, secteur);

        return new Promise((resolve:(n: ActionsChainData) => void, reject) => {

            if (!_.isNumber(parseInt(id))) {
                reject(new WError(this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-AD-ESE-06"), {"id": id})));
            }

            logger.debug("Envoi d'une mise à jour de secteur : ", secteur);
            var path = "/secteurs";
            if (!utils.isServer) {
                path = path + "/sauvegarder"; //vers Node
            }

            this.request()
                .put(this.buildUrl(path + "/" + id)) //
                .send(secteur) //
                .end(this.endFunction(resolve, reject
                    , "Modification secteur id " + id));
        });

    }
}
export = SecteurApi;
