///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import Action = require("hornet-js-core/src/actions/action");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import ProduitApi = require("src/services/adm/adm-rps-api");
var logger = utils.getLogger("applitutoriel.actions.adm.adm-rps-actions");
var WError = utils.werror;

export class Repartition extends Action<ActionsChainData> {
    execute(resolve, reject) {
        logger.info("Repartition - Appel API : ProduitApi.repartition - Dispatch PRODUIT_RECEIVE_REPARTITION");
        new ProduitApi().repartition().then((retourApi:ActionsChainData) => {
            logger.debug("retour API : ", retourApi.result );
            this.actionContext.dispatch("PRODUIT_RECEIVE_REPARTITION", retourApi.result);
            resolve(retourApi);
        },  (error) => {
            logger.warn("Retour en erreur");
            reject(new WError(error, this.actionContext.i18n("error.message.ER-AD-RPS-01")));
        });
    }
}


