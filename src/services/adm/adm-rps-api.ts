"use strict";
import ServiceApi = require("hornet-js-core/src/services/service-api");
import utils = require("hornet-js-utils");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");

var logger = utils.getLogger("applitutoriel.services.adm.adm-rps-api");

class ProduitApi extends ServiceApi {
    repartition() {
        logger.info("SERVICES - repartition");
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            logger.debug("Demande de repartition des produits sur le serveur");
            this.request()
                .get(this.buildUrl("/produits"))
                .end(this.endFunction(resolve, reject, "Répartition des produits"));
        });
    }
}

export = ProduitApi;
