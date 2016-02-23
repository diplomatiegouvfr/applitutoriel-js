"use strict";
import ServiceApi = require("hornet-js-core/src/services/service-api");
import utils = require("hornet-js-utils");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");

var logger = utils.getLogger("applitutoriel.services.gen.gen-cnx-api");

class AuthApi extends ServiceApi {
    auth(data) {
        logger.info("SERVICES - auth", data);
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            logger.debug("Envoi d'une demande d'authentication au serveur :", data);
            this.request()
                .post(this.buildUrl("/utilisateurs/auth"))
                .send(data)
                .end(this.endFunction(resolve, reject
                    , "Demande d'authentication transmise"));
        });
    }
}

export = AuthApi;
