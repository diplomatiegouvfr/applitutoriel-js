"use strict";
import ServiceApi = require("hornet-js-core/src/services/service-api");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import utils = require("hornet-js-utils");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");

var logger = utils.getLogger("applitutoriel.services.par.par-pays-api");

class PaysApi extends ServiceApi {
    lister() {
        logger.info("SERVICES - lister");
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            var path = "/partenaires/pays";

            this.request().cache(60 * 60)
                .get(this.buildUrl(path))
                .end(this.endFunction(resolve, reject
                    , "Récupération des pays"));
        });
    }

    rechercherNationalites(nationalite) {
        logger.info("SERVICES - rechercherNationalites : ", nationalite);
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            var nationaliteObj = {
                "nationalite": nationalite
            };

            var path = "/partenaires/pays/nationalites/rechercher";
            this.request()
                .post(this.buildUrl(path))
                .send(nationaliteObj)
                .end(this.endFunction(resolve, reject
                    , "Récupération des nationalités " + nationalite));
        });
    }
}

export = PaysApi;
