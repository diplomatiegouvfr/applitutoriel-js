///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import IRoutes = require("hornet-js-core/src/routes/router-interfaces");
import routerNs = require("hornet-js-core/src/routes/router-view");
import utils = require("hornet-js-utils");
import MediaType = require("hornet-js-core/src/protocol/media-type");
import fvaNS = require("hornet-js-core/src/actions/form-validation-action");
import Roles = require("src/utils/roles");

import Action = require("hornet-js-core/src/actions/action");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import SecteurAction = require("src/actions/adm/adm-lst-actions");
import RecherchePartenairesAction = require("src/actions/par/par-rpa-actions");
import FichePartenairesAction = require("src/actions/par/par-fpa-actions");
import RedirectClientAction = require("hornet-js-core/src/actions/redirect-client-action");
import SimpleAction = require("hornet-js-core/src/actions/simple-action");
import routerInterfaces = require("hornet-js-core/src/routes/router-interfaces");

var RecherchePartenairesPage = require("src/views/par/par-rpa-page");
var FichePartenairePage = require("src/views/par/par-fpa-page");

var _ = utils._;
var logger = utils.getLogger("applitutoriel.routes.par.par-routes");

class PartenairesRoutes implements IRoutes.IRoutesBuilder {

    buildViewRoutes(match:IRoutes.MatchViewFn) {

        logger.info("Initialisation des routes view de la page Partenaires");

        match("/", (context) => {
            logger.info("routes partenaires / ROUTER VIEW");
            return {
                actions: [new SecteurAction.ListerSecteurs()],
                composant: RecherchePartenairesPage,
                roles: Roles.EVERYONE
            };
        });

        match("/cancel", (context) => {
            logger.info("routes partenaires cancel ROUTER VIEW :", context.req.body);
            return {
                composant: RecherchePartenairesPage,
                roles: Roles.EVERYONE
            };
        });

        match("/rechercher", (context) => {
            logger.info("routes partenaires recherche ROUTER VIEW :", context.req.body);
            var formData = context.req.body;
            return {
                actions: [
                    new RecherchePartenairesAction.SaveCriterias().withPayload(formData),
                    new RecherchePartenairesAction.Rechercher().withPayload(formData)
                ],
                composant: RecherchePartenairesPage,
                roles: Roles.EVERYONE
            };
        });

        match("/creer", (context) => {
            logger.info("routes partenaires creer ROUTER VIEW");
            return {
                actions: [
                    new FichePartenairesAction.ListerPays(),
                    new FichePartenairesAction.InitPartenaire()
                ],
                composant: FichePartenairePage,
                roles: Roles.ADMIN
            };
        });

        match("/supprimer/:id", (context, id) => {
            logger.info("routes partenaires supprimer ROUTER VIEW 1 :", id);
            logger.info("routes partenaires supprimer ROUTER VIEW 2 :", context.req.body);

            var actions = [];

            if (id === "0") {
                actions.push(new RecherchePartenairesAction.SupprimerEnMasse().withPayload(context.req.body.selectedItems));
            }
            else {
                actions.push(new RecherchePartenairesAction.SupprimerPartenaire().withPayload(id));
            }

            actions.push(new RecherchePartenairesAction.Rechercher().withPayload(context.req.body));

            return {
                actions: actions,
                composant: RecherchePartenairesPage,
                roles: Roles.ADMIN
            };
        });

        match("/sauvegarder", (context) => {
            // TODO: Cette route devrait exister sous la forme d"un enchainement d'actions puisqu'elle ne reflète pas
            // une url de l"application et n'est jamais exécutée côté serveur
            logger.info("routes partenaires sauvegarder (creation) ROUTER VIEW :", context.req.body);
            return {
                actions: [
                    new FichePartenairesAction.EcrirePartenaire().withPayload({
                        data: context.req.body.partenaire
                    }),
                    new RedirectClientAction().withPayload("/partenaires"),
                    new RecherchePartenairesAction.Rechercher().withPayload(context.req.body.recherche),
                    new FichePartenairesAction.NotifierPartenaireSauvegarde().withPayload(context.req.body.partenaire)
                ],
                composant: RecherchePartenairesPage,
                roles: Roles.ADMIN
            };
        }, "put");

        match("/sauvegarder/:id", (context:routerInterfaces.IRouteContext, id) => {
            // TODO: Cette route devrait exister sous la forme d'un enchainement d'actions puisqu'elle ne reflète pas
            // une url de l'application et n'est jamais exécutée côté serveur
            logger.info("routes partenaires sauvegarder ROUTER VIEW 1 :", id);
            logger.info("routes partenaires sauvegarder ROUTER VIEW 2 :", context.req.body);
            var partenairePayload = {
                data: context.req.body.partenaire,
                id: id
            };
            return {
                actions: [
                    new FichePartenairesAction.EcrirePartenaire().withPayload(partenairePayload),
                    new RedirectClientAction().withPayload("/partenaires"),
                    /* les actions de recherche et de notification doivent être placées après l"action de redirection, sinon la notification n"est pas affichée */
                    new RecherchePartenairesAction.Rechercher().withPayload(context.req.body.recherche),
                    new FichePartenairesAction.NotifierPartenaireSauvegarde().withPayload(context.req.body.partenaire)
                ],
                roles: Roles.ADMIN
            };
        }, "put");

        match("/consulter/:id", (context, id) => {
            logger.info("routes partenaires consulter ROUTER VIEW :", id);

            var actions = [];
            actions.push(new FichePartenairesAction.ListerPays());
            actions.push(new FichePartenairesAction.LirePartenaire().withPayload({
                id: id,
                mode: "consulter"
            }));

            return {
                actions: actions,
                composant: FichePartenairePage,
                roles: Roles.EVERYONE
            };
        });

        match("/:mode/:id", (context, mode, id) => {
            logger.info("routes partenaires", mode, "ROUTER VIEW : ", id);

            var actions = [];
            actions.push(new FichePartenairesAction.ListerPays());
            actions.push(new FichePartenairesAction.LirePartenaire().withPayload({
                id: id,
                mode: mode
            }));

            if (mode === "editer") {
                //actions.push(new FichePartenairesAction.ListerNationalites());  //Le payload est fourni par l"action précédente,
            }
            return {
                actions: actions,
                composant: FichePartenairePage,
                roles: Roles.ADMIN
            };
        });
    }

    buildDataRoutes(match:IRoutes.MatchDataFn) {
        logger.info("Initialisation des routes data de la page Partenaires");

        match("/rechercher", (context) => {
            logger.info("routes partenaires recherche ROUTER DATA :", context.req.body);
            var formData = context.req.body;

            var actionValider = new RecherchePartenairesAction.Valider().withPayload({
                data: context.req.body.criteres,
                i18n: context.actionContext.i18n("partenairesListePage.form"),
                requestMimeType: context.req.body.mediaType || MediaType.JSON.MIME,
                export: (context.req.body.mediaType)
            });

            var actionSauverCriteres = new RecherchePartenairesAction.SauvegarderCritRechercheSession().withPayload({
                criteres: formData,
                session: context.req.getSession()
            });

            var actionRechercher = new RecherchePartenairesAction.Rechercher();

            return {
                actions: [
                    actionValider,
                    actionSauverCriteres,
                    actionRechercher.withPayload(formData)],
                roles: Roles.EVERYONE
            };
        }, "post");

        match("/export", (context) => {
            logger.info("routes partenaires export ROUTER DATA");
            var actionpreparerExport = new RecherchePartenairesAction.Export().withPayload({
                body: context.req.body,
                session: context.req.getSession(),
                response: context.res,
                mediaType: context.req.query.mediaType
            });

            return {
                actions: [actionpreparerExport],
                roles: Roles.EVERYONE
            };
        }, "get");


        match("/pays", () => {
            logger.debug("routes partenaires pays ROUTER DATA");
            return {
                actions: [new FichePartenairesAction.ListerPays()],
                roles: Roles.EVERYONE
            };
        });

        match("/villes", () => {
            logger.info("routes partenaires ville ROUTER DATA");
            return {
                actions: [new FichePartenairesAction.ListerVilles()],
                roles: Roles.EVERYONE
            };
        });

        match("/villes/pays/:id", (context, id) => {
            logger.info("Route partenaires villes par pays ROUTER DATA :", id);
            return {
                actions: [new FichePartenairesAction.ListerVillesParPays().withPayload({
                    id: id
                })],
                roles: Roles.EVERYONE
            };
        });

        match("/pays/nationalites/rechercher", (context) => {
            logger.info("routes partenaires nationalites rechercher ROUTER DATA :", context.req.body.nationalite);
            var payload = {
                value: context.req.body.nationalite || null
            };
            return {
                actions: [new FichePartenairesAction.ListerNationalites().withPayload(payload)],
                roles: Roles.EVERYONE
            };
        }, "post");

        match("/supprimer/:id", (context, id) => {
            logger.info("routes partenaires supprimer ROUTER DATA :", id);

            return {
                actions: [
                    new RecherchePartenairesAction.SupprimerPartenaire().withPayload(id),
                ],
                roles: Roles.ADMIN
            };
        }, "delete");

        match("/suppression", (context) => {
            logger.info("routes partenaires suppression ROUTER DATA :", context.req.body);

            return {
                actions: [
                    new RecherchePartenairesAction.SupprimerEnMasse().withPayload(context.req.body)
                ],
                roles: Roles.ADMIN
            };
        }, "post");


        match("/sauvegarder", (context) => {
            var body = context.req.body;
            logger.info("routes  partenaires sauvegarder (création) ROUTER DATA :", body);

            if (_.isString(body.content)) {
                //Le contenu JSON a été posté dans le champ "content" de la requête, on récupère le string qu"on retranscrit en Objet
                body = JSON.parse(body.content);
            }

            //les uploads sont placés dans req.body.files
            var request = context.req;
            if (request.files && _.isArray(request.files.photo) && request.files.photo.length == 1) {
                //On replace la photo dans l"objet
                body.photo = request.files["photo"][0];
            }
            return {
                actions: [
                    new FichePartenairesAction.ListerPays(),
                    new FichePartenairesAction.ListerVilles(),
                    new FichePartenairesAction.Valider().withPayload(body),
                    new FichePartenairesAction.EcrirePartenaire().withPayload({
                        data: body
                    })
                ],
                roles: Roles.ADMIN
            };
        }, "post");


        //TODO Devrait être un put -> put non ecouté ?
        match("/sauvegarder/:id", (context, id) => {
            var body = context.req.body;
            logger.info("routes partenaires sauvegarder ROUTER DATA :", id, body);

            if (_.isString(body.content)) {
                //Le contenu JSON a été posté dans le champ "content" de la requête, on récupère le string qu"on retranscrit en Objet
                body = JSON.parse(body.content);
            }

            //les uploads sont placés dans req.body.files
            var request = context.req;
            if (request.files && _.isArray(request.files.photo) && request.files.photo.length == 1) {
                //On replace la photo dans l"objet
                body.photo = request.files["photo"][0];
            }

            return {
                actions: [
                    new FichePartenairesAction.ListerPays(),
                    new FichePartenairesAction.ListerVilles(),
                    new FichePartenairesAction.Valider().withPayload(body),
                    new FichePartenairesAction.EcrirePartenaire().withPayload({
                        id: id,
                        data: body
                    })
                ],
                roles: Roles.ADMIN
            };
        }, "post");


        match("/photo/:id", (context, id) => {
            logger.info("routes partenaires Récupération PHOTO ROUTER DATA :", id);
            return {
                actions: [
                    new FichePartenairesAction.LirePhoto().withPayload({
                        idPhoto: id
                    }),
                ],
                roles: Roles.EVERYONE
            };
        });

        match("/:mode/:id", (context, mode, id) => {
            logger.info("routes partenaires ROUTER DATA :", id, mode);
            return {
                actions: [
                    new FichePartenairesAction.LirePartenaire().withPayload({
                        id: id,
                        mode: mode
                    }),
                ],
                roles: Roles.EVERYONE
            };
        });

    }
}


export = PartenairesRoutes;