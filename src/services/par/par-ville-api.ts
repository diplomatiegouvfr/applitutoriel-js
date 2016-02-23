"use strict";

import ServiceApi = require("hornet-js-core/src/services/service-api");
import utils = require("hornet-js-utils");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");

var logger = utils.getLogger("applitutoriel.services.par.par-ville-api");

class VilleApi extends ServiceApi {
    lister() {
        logger.info("SERVICES - lister");
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            var path = "/partenaires/villes";
            this.request().cache(3600)
                .get(this.buildUrl(path)) //
                .end(this.endFunction(resolve, reject
                    , "Listing des villes"));
        });
    }

    listerParPays(id) {
        logger.info("SERVICES - listerParPays, id :", id);
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            var path = "/partenaires/villes/pays";
            this.request().cache(3600)
                .get(this.buildUrl(path + "/" + id)) //
                .end(this.endFunction(resolve, reject
                    , "Listing des villes par pays"));
        });
    }
}

export = VilleApi;
