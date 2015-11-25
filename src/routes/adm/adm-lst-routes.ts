///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import routerInterfaces = require("hornet-js-core/src/routes/router-interfaces");
import utils = require("hornet-js-utils");
import SecteurActions = require("src/actions/adm/adm-lst-actions");
import Roles = require("src/utils/roles");
var secteursPage = require("src/views/adm/adm-lst-page");

var logger = utils.getLogger("applitutoriel.routes.adm.adm-lst-routes");

class SecteursRoutes implements routerInterfaces.IRoutesBuilder {

    buildViewRoutes(match:routerInterfaces.MatchViewFn) {
        logger.info("Initialisation des routes view de la page Secteurs");
        match("/", (context) => {
            logger.info("routes SECTEUR / ROUTER VIEW");
            return {
                actions: [new SecteurActions.ListerSecteurs()],
                composant: secteursPage,
                roles: Roles.ADMIN
            };
        });

        match("/supprimer/:id", (context, id) => {
            logger.info("routes SECTEUR supprimer ROUTER VIEW", id);

            var actions = [];
            actions.push(new SecteurActions.SupprimerSecteur().withPayload({id: id}));
            //on recharge les secteurs pour prendre en compte la suppression
            actions.push(new SecteurActions.ListerSecteurs());

            return {
                actions: actions,
                composant: secteursPage,
                roles: Roles.ADMIN
            };
        });

        match("/creer", (context) => {
            logger.info("routes SECTEUR creation ROUTER VIEW", context.req.body);
            return {
                actions: [
                    new SecteurActions.CreerSecteur().withPayload({
                        secteur: context.req.body
                    }),
                    new SecteurActions.ListerSecteurs()
                ],
                composant: secteursPage,
                roles: Roles.ADMIN
            };
        });

        match("/sauvegarder/:id", (context, id) => {
            logger.info("routes SECTEUR sauvegarder (creation) ROUTER VIEW", context.req.body);
            return {
                actions: [
                    new SecteurActions.ModifierSecteur().withPayload({
                        id: id,
                        secteur: context.req.body
                    }),
                    new SecteurActions.ListerSecteurs()
                ],
                composant: secteursPage,
                roles: Roles.ADMIN
            };
        });
    }

    buildDataRoutes(match:routerInterfaces.MatchDataFn) {
        logger.info("Initialisation des routes data de la page Secteurs");

        match("/", (context) => {
            logger.info("routes SECTEUR / ROUTER DATA");

            return {
                actions: [new SecteurActions.ListerSecteurs()]
            };
        });

        match("/supprimer/:id", (context, id) => {
            logger.info("routes SECTEUR supprimer ROUTER DATA", id);
            return {
                actions: [
                    new SecteurActions.SupprimerSecteur().withPayload({id: id})
                ],
                roles: Roles.ADMIN
            };
        }, "delete");

        match("/sauvegarder/:id", (context, id) => {
            logger.info("routes SECTEUR sauvegarder ROUTER DATA", id);
            return {
                actions: [
                    new SecteurActions.ModifierSecteur().withPayload({
                        id: id,
                        secteur: context.req.body
                    })
                ],
                roles: Roles.ADMIN
            };
        }, "put");

        match("/creer", (context, id) => {
            logger.info("routes SECTEUR CREER ROUTER DATA", id);
            return {
                actions: [
                    new SecteurActions.CreerSecteur().withPayload({
                        secteur: context.req.body
                    })
                ],
                roles: Roles.ADMIN
            };
        }, "post");
    }
}
export = SecteursRoutes;