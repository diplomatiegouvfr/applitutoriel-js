"use strict";
import utils = require("hornet-js-utils");
import Action = require("hornet-js-core/src/actions/action");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import PartenaireApi = require("src/services/par/par-rpa-api");
import FichePartenaireApi = require("src/services/par/par-fpa-api");
import PartenairesActionsChainData = require("src/routes/par/partenaires-actions-chain-data");
import MediaType = require("hornet-js-core/src/protocol/media-type");
import SecteurStore = require("src/stores/adm/adm-lst-store");
import PageInformationStore = require("hornet-js-core/src/stores/page-informations-store");
import RecherchePartenaireForm = require("src/views/par/par-rpa-form");
import N = require("hornet-js-core/src/routes/notifications");

var _ = utils._;
var WError = utils.werror;
var logger = utils.getLogger("applitutoriel.actions.par.par-rpa-actions");

export class Valider extends Action<PartenairesActionsChainData> {

    execute(resolve, reject) {
        logger.info("ACTION Valider.PartenairesActionsChainData");
        if (this.payload) {
            logger.debug("Valider Recherche Partenaires :", this.payload);

            var formData = toFormData(this.payload.data);

            logger.debug("Données du formulaire de recherche formattées :", formData);

            var formClass = (<any>RecherchePartenaireForm)(this.actionContext.getStore(SecteurStore), this.payload.i18n);
            var form = new formClass({
                data: formData
            });

            logger.debug("formulaire :", form.data);
            if (!form.validate()) {
                this.actionChainData.formError = form.errors();
                logger.warn("formulaire NON valide :", form.errors());
                reject();
                return;
            }
            logger.debug("formulaire valide");
        }
        resolve();
    }
}

export class ResetStore extends Action<PartenairesActionsChainData> {

    execute(resolve, reject) {
        logger.info("ACTION ResetStore.PartenairesActionsChainData");
        this.actionContext.dispatch("PARTENAIRES_REINITIALIZE");
        resolve();
    }
}


export class ResetFiltre extends Action<PartenairesActionsChainData> {

    execute(resolve, reject) {
        logger.info("ACTION ResetFiltre.PartenairesActionsChainData");
        this.actionContext.dispatch("PARTENAIRES_RESET_FILTRE");
        resolve();
    }
}

export class Rechercher extends Action<PartenairesActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION Rechercher.PartenairesActionsChainData");
        logger.info("Partenaire Action Rechercher, criterias:", this.payload);

        if (this.payload) {
            var newPayload = toCriteresRecherche(this.payload);

            if (!newPayload) {
                logger.warn("Recherche non valide : Accès direct");
                resolve();
            }

            if (this.payload.requestMimeType) {
                this.actionChainData.requestMimeType = this.payload.requestMimeType;
            }
            logger.debug("Partenaire Action Rechercher, criteres to send :", newPayload);

            var store:PageInformationStore = <PageInformationStore>this.actionContext.getStore(PageInformationStore);
            this.getInstance(PartenaireApi, store.getCurrentUser()).rechercher(newPayload, this.actionChainData.requestMimeType).then((retourApi:PartenairesActionsChainData) => {
                // Si on est dans le cas d'une redirection ou d'un rendu de composant
                logger.trace("Resolution rechercher critere :", retourApi);

                this.actionContext.dispatch("PARTENAIRES_RECEIVE_SEARCH_RESULTS", retourApi.result);

                resolve(retourApi);
            }, (data) => {
                logger.error("this.actionChainData.lastError, ", this.actionChainData.lastError);
                reject(new WError(data, this.actionContext.i18n("error.message.ER-PA-RPA-01")));
            });
        } else {
            resolve();
        }
    }
}

export class SaveCriterias extends Action<PartenairesActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION SaveCriterias.PartenairesActionsChainData");
        logger.debug("Partenaire Action SaveCriterias, payload=", this.payload);

        if (this.payload) {
            this.actionContext.dispatch("PARTENAIRES_SAVE_CRITERIAS", this.payload.criterias);
        }
        resolve();

    }
}

export class SauvegarderCritRechercheSession extends Action<PartenairesActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION SauvegarderCritRechercheSession.PartenairesActionsChainData");
        logger.debug("Partenaire Action SauvegarderCritRecherche, payload=", this.payload);

        if (this.payload) {

            var criteres = toCriteresRecherche(this.payload.criteres);
            logger.info("Critères de recherche enregistrés dans la session : ", criteres);

            this.payload.session.setAttribute("criteresRechPartenaires", criteres);
        }
        resolve();

    }
}

export class SupprimerPartenaire extends Action<PartenairesActionsChainData> {

    execute(resolve, reject) {
        logger.info("ACTION SupprimerPartenaire.PartenairesActionsChainData");
        try {

            if (this.payload) {
                var store = this.actionContext.getStore(PageInformationStore);
                this.getInstance(FichePartenaireApi, store.getCurrentUser()).charger(this.payload, "consulter").then((retourApi:ActionsChainData) => {
                    logger.trace("Partenaire reçu :", retourApi.result);

                    var partenaire = retourApi.result;
                    if (partenaire.isVIP) {
                        var textNotif:string = this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-PA-RPA-03"), {
                            "nom": partenaire.nom,
                            "prenom": partenaire.prenom
                        });
                        var notifs:N.Notifications = N.Notifications.makeSingleNotification("DEL_VIP_PARTNER" + partenaire.id, textNotif);

                        this.actionContext.dispatch(Action.EMIT_ERR_NOTIFICATION, notifs);
                        resolve();
                    } else {

                        var store:PageInformationStore = <PageInformationStore>this.actionContext.getStore(PageInformationStore);

                        // On demande une suppression par id
                        this.getInstance(PartenaireApi, store.getCurrentUser()).supprimer(partenaire.id).then((retourApi:ActionsChainData) => {
                            logger.debug("Partenaire supprimé :", retourApi.result);

                            var notifText:string = this.actionContext.formatMsg(this.actionContext.i18n("info.message.IN-PA-RPA-01"), {
                                "nom": partenaire.nom,
                                "prenom": partenaire.prenom
                            });

                            var notifs:N.Notifications = N.Notifications.makeSingleNotification("DEL_PARTNER" + partenaire.id, notifText);

                            this.actionContext.dispatch(Action.EMIT_INFO_NOTIFICATION, notifs);

                            resolve();

                        }, (data) => {
                            this.actionChainData.lastError = new WError(data, this.actionContext.i18n("error.message.ER-PA-RPA-02"));
                            reject();
                        });
                    }
                }, (data) => {
                    this.actionChainData.lastError = new WError(data, this.actionContext.i18n("error.message.ER-PA-FPA-05"));
                    reject();
                });
            } else {
                resolve();
            }

        } catch (err) {
            this.actionChainData.lastError = new WError(this.payload, this.actionContext.i18n("error.message.ER-PA-RPA-02"));
            reject();
        }

    }
}


export class SupprimerEnMasse extends Action<PartenairesActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION SupprimerEnMasse.PartenairesActionsChainData");
        logger.debug("Suppression des partenaires :", this.payload);
        if (this.payload) {
            var partenairesNotVip = [];
            this.actionContext.dispatch(Action.REMOVE_ALL_NOTIFICATIONS);
            // Contrôle IsVip
            var notifs:N.Notifications = new N.Notifications();
            this.payload.map((item) => {
                if (item.isVIP) {
                    var notif:N.NotificationType = new N.NotificationType();
                    notif.id = "DEL_VIP_PARTNER" + item.id;
                    notif.text = this.actionContext.formatMsg(
                        this.actionContext.i18n("error.message.ER-PA-RPA-03"),
                        {nom: item.nom, prenom: item.prenom});
                    notifs.addNotification(notif);
                }
                else {
                    partenairesNotVip.push(item);
                }
            });
            if (notifs.getNotifications() && notifs.getNotifications().length > 0) {
                this.actionContext.dispatch(Action.EMIT_ERR_NOTIFICATION, notifs);
            }
            logger.debug("partenairesNotVip :", partenairesNotVip);
            if (partenairesNotVip.length > 0) {
                var store:PageInformationStore = <PageInformationStore>this.actionContext.getStore(PageInformationStore);

                this.getInstance(PartenaireApi, store.getCurrentUser()).supprimerEnMasse(partenairesNotVip).then((data:ActionsChainData)=> {
                    logger.debug("Retour Suppression des partenaires :", data);

                    partenairesNotVip.map((item) => {
                        var notifText:string = this.actionContext.formatMsg(this.actionContext.i18n("info.message.IN-PA-RPA-01"), {
                            "nom": item.nom,
                            "prenom": item.prenom
                        });

                        var notifs:N.Notifications = N.Notifications.makeSingleNotification("DEL_PARTNER" + item.id, notifText);

                        this.actionContext.dispatch(Action.EMIT_INFO_NOTIFICATION, notifs);
                    });

                    resolve(data);
                }, (data)=> {
                    reject(new WError(data, this.actionContext.i18n("error.message.ER-PA-RPA-04")));
                });
            }
            else {
                resolve();
            }
        } else {
            resolve();
        }
    }
}

export class Export extends Action<PartenairesActionsChainData> {
    execute(resolve, reject) {
        logger.info("ACTION Export.PartenairesActionsChainData");
        logger.debug("Partenaire Action Export - récupération des criteres de recherche dans la session");

        var criteres = this.payload.session.getAttribute("criteresRechPartenaires");

        if (criteres) {
            logger.debug("Critères trouvés dans la session ", criteres);

            var payloadMediaType = this.payload.mediaType;
            var extension = "xls";

            logger.debug("MIMETYPE :", payloadMediaType);
            logger.debug("DEFAULT MIME TYPE :", this.actionChainData.requestMimeType);

            if (payloadMediaType) {
                this.actionChainData.requestMimeType = MediaType.fromParameter(payloadMediaType).MIME;
                extension = MediaType.fromParameter(payloadMediaType).PARAMETER;
            }

            // Pour l'export on force à avoir tous les items dans la recherche
            var criteresRecherche = _.assign({}, criteres, {pagination: {pageIndex: 0, itemsPerPage: -1}});

            this.payload.response.setHeader("Content-disposition", "attachment; filename=export." + extension);

            var store:PageInformationStore = <PageInformationStore>this.actionContext.getStore(PageInformationStore);
            this.getInstance(PartenaireApi, store.getCurrentUser()).rechercher(criteresRecherche, this.actionChainData.requestMimeType).then((retourApi:PartenairesActionsChainData) => {
                // Si on est dans le cas d'une redirection ou d'un rendu de composant
                logger.debug("Resolution EXPORTER critere :", retourApi);
                this.actionContext.dispatch("PARTENAIRES_RECEIVE_SEARCH_RESULTS ", retourApi.result);

                resolve(retourApi);
            }, (data) => {
                logger.warn("this.actionChainData.lastError, ", this.actionChainData.lastError);
                reject(new WError(data, this.actionContext.i18n("error.message.ER-PA-RPA-05")));
            });


        } else {
            reject(new WError(this.payload, this.actionContext.i18n("error.message.ER-PA-RPA-06")));
        }

    }
}

function toCriteresRecherche(data:any) {
    var formData:any = _.extend(_.cloneDeep(data.criterias || data.criteres), _.cloneDeep(data.filters));
    if (formData) {
        formData = _.extend(formData, formData.partenaire);
        return {
            criteres: {
                partenaire: {
                    isClient: formData.isClient || null,
                    isVIP: formData.isVIP,
                    isVIPFiltre: formData.isVIPFiltre || formData.labelIsVIP,
                    nom: formData.nom || null,
                    prenom: formData.prenom || null,
                    proCourriel: formData.proCourriel || null,
                    organisme: formData.organisme || null,
                    dateModif: formData.dateModif
                },
                idSecteur: formData.idSecteur || null,
                startDate: formData.startDate,
                endDate: formData.endDate
            },

            sort: data.sort,
            pagination: data.pagination,
            requestMimeType: MediaType.JSON.MIME

        };
    }
}

function toFormData(criterias:any):Object {

    logger.debug("formatttage des criteres de recherche : ", criterias);
    var startDate:Date = null;
    /* Les dates ont été sérialisées sous forme de chaînes de caractères : on les reconvertit en objets Date */
    if (_.isString(criterias.startDate)) {
        startDate = utils.dateUtils.stdParse(criterias.startDate);
    }
    var endDate:Date = null;
    if (_.isString(criterias.endDate)) {
        endDate = utils.dateUtils.stdParse(criterias.endDate);
    }
    return {
        isClient: criterias.partenaire.isClient,
        isVIP: criterias.partenaire.isVIP,
        idSecteur: criterias.idSecteur || null,
        startDate: startDate,
        endDate: endDate
    };
}
