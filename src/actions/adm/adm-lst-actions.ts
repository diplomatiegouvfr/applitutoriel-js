"use strict";
import utils = require("hornet-js-utils");
import Action = require("hornet-js-core/src/actions/action");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import SecteurApi = require("src/services/adm/adm-lst-api");
import N = require("hornet-js-core/src/routes/notifications");

var logger = utils.getLogger("applitutoriel.actions.adm.adm-lst-actions");
var WError = utils.werror;

export class ListerSecteurs extends Action<ActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION ListerSecteurs - Appel API : SecteurApi.lister - Dispatch SECTEUR_RECEIVE_LIST");
        this.getInstance(SecteurApi).lister().then((retourApi:ActionsChainData) => {
            logger.trace("retour API : ", retourApi.result);
            this.actionContext.dispatch("SECTEUR_RECEIVE_LIST", retourApi.result);
            resolve(retourApi);
        }, (error) => {
            logger.trace("Retour en erreur", error);
            reject(new WError(error, this.actionContext.i18n("error.message.ER-AD-ESE-02")));
        });
    }
}

export class SupprimerSecteur extends Action<ActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION SupprimerSecteur - Appel API : SecteurApi.supprimer - Dispatch SECTEUR_DELETED");
        this.getInstance(SecteurApi).supprimer(this.payload.id).then((retourApi:ActionsChainData) => {
            logger.debug("retour API : ", retourApi.result);

            var notifs:N.Notifications = N.Notifications.makeSingleNotification("SECTEUR_DELETED", "info.message.IN-AD-LST-02");

            this.actionContext.dispatch(Action.EMIT_INFO_NOTIFICATION, notifs);
            resolve(retourApi);
        }, (error) => {
            logger.warn("Retour en erreur");
            reject(new WError(error, this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-AD-ESE-03"), {"secteurid": this.payload.id})));
        });
    }
}

export class ModifierSecteur extends Action<ActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION ModifierSecteur - Appel API : SecteurApi.modifier - Dispatch SECTEUR_UPDATED");
        this.getInstance(SecteurApi).modifier(this.payload.id, this.payload.secteur).then((retourApi:ActionsChainData) => {
            logger.debug("retour API : ", retourApi.result);

            var notifs:N.Notifications = N.Notifications.makeSingleNotification("SECTEUR_UPDATED", this.actionContext.i18n("info.message.IN-AD-LST-01"));

            this.actionContext.dispatch(Action.EMIT_INFO_NOTIFICATION, notifs);

            resolve(retourApi);
        }, (error) => {
            logger.warn("Retour en erreur");
            reject(new WError(error, this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-AD-ESE-04"), {"secteurid": this.payload.id})));
        });
    }
}

export class CreerSecteur extends Action<ActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION CreerSecteur - Appel API : SecteurApi.creer - Dispatch SECTEUR_CREATED");
        this.getInstance(SecteurApi).creer(this.payload.secteur).then((retourApi:ActionsChainData) => {
            logger.debug("retour API : ", retourApi.result);

            var notifs:N.Notifications = N.Notifications.makeSingleNotification("SECTEUR_CREATED", this.actionContext.i18n("info.message.IN-AD-LST-03"));

            this.actionContext.dispatch(Action.EMIT_INFO_NOTIFICATION, notifs);
            resolve(retourApi);
        }, (error) => {
            logger.warn("Retour en erreur");
            reject(new WError(error, this.actionContext.i18n("error.message.ER-AD-ESE-05")));
        });
    }
}

