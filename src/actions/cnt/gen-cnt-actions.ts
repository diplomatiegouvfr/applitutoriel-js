///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import Action = require("hornet-js-core/src/actions/action");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import ContactApi = require("src/services/cnt/gen-cnt-api");
import N = require("hornet-js-core/src/routes/notifications");
var logger = utils.getLogger("applitutoriel.actions.cnt.gen-cnt-actions");
var WError = utils.werror;

/**
 * Appel le service distant pour réaliser l"envoi de la demande de contact.
 */
export class Send extends Action<ActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION Send - Appel API : ContactApi.send - Dispatch CONTACT_SENT");
        logger.debug("Demande de contact :", this.payload);
        if (this.payload) {
            new ContactApi().send(this.payload).then((data:ActionsChainData) => {
                logger.debug("Nettoyage des informations de contact");
                this.actionContext.dispatch("CONTACT_SENT");

                var notifs:N.Notifications = N.Notifications.makeSingleNotification("CONTACT_SENT", "info.message.IN-GE-CNT-01");

                this.actionContext.dispatch(Action.EMIT_INFO_NOTIFICATION, notifs);
                resolve(data);
            }, (error) => {
                reject(new WError(error, this.actionContext.i18n("error.message.ER-GE-CNT-01")));
            });
        } else {
            reject(new WError(this.actionContext.i18n("error.message.ER-GE-CNT-02")));
        }
    }
}
