"use strict";
import routerInterfaces = require("hornet-js-core/src/routes/router-interfaces");
import utils = require("hornet-js-utils");
import Roles = require("src/utils/roles");

var logger = utils.getLogger("applitutoriel.routes.routes");

class Routes implements routerInterfaces.IRoutesBuilder {

    buildViewRoutes(match:routerInterfaces.MatchFn) {

        logger.info("Initialisation des view-routes");

        match.lazy("/contact", "cnt/gen-cnt-routes");
        match.lazy("/partenaires", "par/par-routes");
        match.lazy("/secteurs", "adm/adm-lst-routes");
        match.lazy("/repartition", "adm/adm-rps-routes");

        match("/accueil", () => {
            logger.info("match route /accueil src/views/gen/gen-home-page");
            return {
                composant: require("src/views/gen/gen-hom-page")
            };
        });

        match("/aide", () => {
            logger.info("match route /aide src/views/gen/gen-aide-page");
            return {
                composant: require("src/views/gen/gen-aid-page"),
                roles: Roles.EVERYONE
            };
        });

        match("/planAppli", () => {
            logger.info("match route /planAppli src/views/nav/nav-pap-page");
            return {
                composant: require("src/views/nav/nav-pap-page"),
                roles: Roles.EVERYONE
            };
        });

        match("/politiqueAccessibilite", () => {
            logger.info("match route /politiqueAccessibilite src/views/gen/gen-acb-page");
            return {
                composant: require("src/views/gen/gen-acb-page"),
                roles: Roles.EVERYONE
            };
        });

        match("/declarationConformite", () => {
            logger.info("match route /declarationConformite src/views/gen/gen-ddc-page");
            return {
                composant: require("src/views/gen/gen-ddc-page"),
                roles: Roles.EVERYONE
            };
        });


        match("/log", (context:routerInterfaces.IRouteContext) => {
            logger.info("match route /log");

            // exemple d'utilisation d'un remote logger
            logger.info("REMOTE LOG ", context.req.body);

            return {};
        }, "post");
    }

    buildDataRoutes(match:routerInterfaces.MatchFn) {

        logger.info("Initialisation des data-routes");

        match.lazy("/contact", "cnt/gen-cnt-routes");
        match.lazy("/partenaires", "par/par-routes");
        match.lazy("/secteurs", "adm/adm-lst-routes");
        match.lazy("/produits", "adm/adm-rps-routes");
    }
}

export = Routes;
