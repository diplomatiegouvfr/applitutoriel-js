///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import routerInterfaces = require("hornet-js-core/src/routes/router-interfaces");
import utils = require("hornet-js-utils");
import ProduitActions = require("src/actions/adm/adm-rps-actions");
import Roles = require("src/utils/roles");

var logger = utils.getLogger("applitutoriel.routes.adm.adm-rps-routes");
var repartitionPage = require("src/views/adm/adm-rps-page");

class ProduitsRoutes implements routerInterfaces.IRoutesBuilder {

    buildViewRoutes(match:routerInterfaces.MatchViewFn) {
        logger.info("Initialisation des routes view de la page des répartitions");
        match("/", (context) => {
            logger.info("routes PRODUITS / ROUTER VIEW");
            return {
                actions: [new ProduitActions.Repartition()],
                composant: repartitionPage,
                roles: Roles.ADMIN
            };
        });
    }

    buildDataRoutes(match:routerInterfaces.MatchDataFn) {
        logger.info("Initialisation des routes data de la page des répartitions");
        match("/", (context) => {
            logger.info("routes PRODUITS / ROUTER DATA");
            return {
                actions: [new ProduitActions.Repartition()],
                roles: Roles.ADMIN
            };
        });
    }
}
export = ProduitsRoutes;