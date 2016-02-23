"use strict";
import utils = require("hornet-js-utils");
import Action = require("hornet-js-core/src/actions/action");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import FichePartenaireApi = require("src/services/par/par-fpa-api");
import VilleApi = require("src/services/par/par-ville-api");
import PaysApi = require("src/services/par/par-pays-api");
import PartenairesActionsChainData = require("src/routes/par/partenaires-actions-chain-data");
import FichePartenaireStore = require("src/stores/par/par-fpa-store");
import PageInformationStore = require("hornet-js-core/src/stores/page-informations-store");
import FichePartenaireForm = require("src/views/par/par-fpa-form");
import N = require("hornet-js-core/src/routes/notifications");

var WError = utils.werror;
var logger = utils.getLogger("applitutoriel.actions.par.par-fpa-actions");
var villeApi:VilleApi = new VilleApi();
var paysApi:PaysApi = new PaysApi();

export class InitPartenaire extends Action<PartenairesActionsChainData> {
    execute(resolve:(data?:ActionsChainData)=>void, reject:(error:any)=>void) {
        logger.info("ACTION InitPartenaire - Dispatch REMOVE_PARTENAIRE_FORM_DATA");
        this.actionContext.dispatch("REMOVE_PARTENAIRE_FORM_DATA");
        resolve();
    }
}

export class ListerPays extends Action<PartenairesActionsChainData> {
    execute(resolve:(data?:ActionsChainData)=>void, reject:(error:any)=>void) {

        var self = this;

        paysApi.lister().then((retourApi:ActionsChainData) => {
            self.actionContext.dispatch("RECEIVE_PAYS_FORM_DATA", retourApi.result);
            resolve(retourApi);
        }, (data)=> {
            reject(new WError(data, this.actionContext.i18n("error.message.ER-PA-FPA-01")));
        });

    }
}

export class ListerVilles extends Action<PartenairesActionsChainData> {
    execute(resolve:(data?:ActionsChainData)=>void, reject:(error:any)=>void) {
        logger.info("Action: ListerAllVilles, appel api villes");
        var self = this;

        villeApi.lister() //
            .then((retourApi:ActionsChainData) => {
                self.actionContext.dispatch("RECEIVE_VILLES_FORM_DATA", retourApi.result);
                resolve(retourApi);
            }, (data) => {
                reject(new WError(data, this.actionContext.i18n("error.message.ER-PA-FPA-02")));
            });
    }
}

export class ListerVillesParPays extends Action<PartenairesActionsChainData> {
    execute(resolve:(data?:ActionsChainData)=>void, reject:(error:any)=>void) {
        logger.info("Action: ListerAllVilles, appel api villes");
        var self = this;

        villeApi.listerParPays(this.payload.id) //
            .then((retourApi:ActionsChainData) => {
                self.actionContext.dispatch("RECEIVE_VILLES_FORM_DATA", retourApi.result);
                resolve(retourApi);
            }, (data) => {
                reject(new WError(data, this.actionContext.i18n("error.message.ER-PA-FPA-02")));
            });
    }
}

export class ListerNationalites extends Action<PartenairesActionsChainData> {
    execute(resolve:(data?:ActionsChainData)=>void, reject:(error:any)=>void) {
        var self = this;
        // Soit c'est fourni dans le POST soit c"est fourni par une action précédente
        var nationaliteToCheck = (this.payload && this.payload.value) || this.actionChainData.partenaireNationalite$text;

        paysApi.rechercherNationalites(nationaliteToCheck).then((retourApi:ActionsChainData)=> {
            try {
                self.actionContext.dispatch("RECEIVE_NATIONALITE_RESULTS", retourApi.result);
            } catch (error) {
                reject(new WError(error, "Erreur dans le dispatching des nationalités"));
                return;
            }
            resolve(retourApi);
        }, (error) => {
            reject(new WError(error, this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-PA-FPA-03"), {"msg": error.message})));
        });
    }
}

export class LirePhoto extends Action<PartenairesActionsChainData> {
    execute(resolve:(data?:ActionsChainData)=>void, reject:(error:any)=>void) {

        var idPhoto = null;
        if (this.payload && this.payload.idPhoto) {
            idPhoto = this.payload.idPhoto;
        } else {
            logger.error("Impossible de lire la photo, l id de la photo est undefined!? ");
        }

        if (idPhoto) {
            var store = this.actionContext.getStore(PageInformationStore);
            this.getInstance(FichePartenaireApi, store.getCurrentUser()).lirePhoto(this.payload.idPhoto).then((retourApi:ActionsChainData)=> {
                this.actionChainData.result = retourApi.result;
                resolve();
            }, (data)=> {
                reject(new WError(data, this.actionContext.i18n("error.message.ER-PA-FPA-04")));
            });
        } else {
            logger.error("Impossibel de lire la photo, l id de la photo est undefined!? ");
            resolve();
        }

    }
}

export class LirePartenaire extends Action<PartenairesActionsChainData> {

    execute(resolve:(data?:ActionsChainData)=>void, reject:(error:any)=>void) {
        try {
            logger.info("Action: PrepareDetailPartenaire");
            var store = this.actionContext.getStore(PageInformationStore);

            // On demande un chargement par id
            this.getInstance(FichePartenaireApi, store.getCurrentUser()).charger(this.payload.id, this.payload.mode).then((retourApi:ActionsChainData) => {
                logger.trace("Partenaire reçu:", retourApi.result);

                this.actionContext.dispatch("PARTENAIRE_RECEIVE_FORM_DATA", {
                    data: retourApi.result,
                    mode: this.payload.mode
                });
                this.actionChainData.partenaireNationalite$text = retourApi.result.nationalite$text;
                resolve(retourApi);
            }, (error:Error) => {
                reject(new WError(error, this.actionContext.i18n("error.message.ER-PA-FPA-05")));
            });
        } catch (err) {
            reject(new WError(err, this.actionContext.i18n("error.message.ER-PA-FPA-05")));
        }
    }
}

export class Valider extends Action<PartenairesActionsChainData> {
    execute(resolve:(data?:PartenairesActionsChainData)=>void, reject:(error:any)=>void) {

        logger.debug("Validation d'un partenaire:", this.payload);
        var formClass = (<any>FichePartenaireForm)(this.actionContext.getStore(FichePartenaireStore), this.actionContext.i18n("partenaireFichePage.form"));
        var form = new formClass({
            data: this.payload
        });
        if (!form.validate()) {
            this.actionChainData.formError = form.errors();
            logger.error("Formulaire Invalide:", form.errors());
            reject(new WError("Formulaire Invalide:", form.errors()));
            return;
        }
        logger.info("Formulaire Valide");
        resolve();
    }
}

export class EcrirePartenaire extends Action<PartenairesActionsChainData> {

    execute(resolve:(data?:ActionsChainData)=>void, reject:(error:any)=>void) {
        try {
            logger.info("Action: EcrirePartenaire", this.payload);
            var store = this.actionContext.getStore(PageInformationStore);

            this.getInstance(FichePartenaireApi, store.getCurrentUser()).modifier(this.payload.id, this.payload.data).then((retourApi:ActionsChainData)=> {
                logger.info("Retour d\"enregistrement OK", retourApi);
                resolve(retourApi);
            }, (error) => {
                logger.error("Retour d\"enregistrement KO", error);
                reject(new WError(error, this.actionContext.i18n("error.message.ER-PA-FPA-07")));
            });
        } catch (err) {
            logger.error("Retour d\"enregistrement NOK", err);
            reject(new WError(this.payload, this.actionContext.i18n("error.message.ER-PA-FPA-08")));
        }
    }
}

/**
 * Notification d'information : partenaire sauvegardé
 */
export class NotifierPartenaireSauvegarde extends Action<PartenairesActionsChainData> {

    /**
     * Déclenche la notification : le nom/prénom du partenaire est recherché dans le payload
     * @param resolve fonction utilisée en cas de succès
     * @param reject fonction utilisée en cas d"échec
     */
    execute(resolve:(data?:ActionsChainData) => void, reject:(error:any) => void) {
        logger.info("Action: NotifierPartenaireModifie");

        var notifText:string = this.actionContext.formatMsg(this.actionContext.i18n("info.message.IN-PA-FPA-01"), {
            "nom": this.payload.nom,
            "prenom": this.payload.prenom
        });
        var notifs:N.Notifications = N.Notifications.makeSingleNotification("PARTENAIRE_SAVED", notifText);

        this.actionContext.dispatch(Action.EMIT_INFO_NOTIFICATION, notifs);

        logger.debug("Notification emise");
        resolve();
    }
}
