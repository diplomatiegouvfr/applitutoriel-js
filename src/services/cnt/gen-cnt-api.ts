"use strict";
import ServiceApi = require("hornet-js-core/src/services/service-api");
import utils = require("hornet-js-utils");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");

var logger = utils.getLogger("applitutoriel.services.gen.gen-cnt-api");

class ContactApi extends ServiceApi {
    send(data) {
        logger.info("SERVICES - send : ", data);
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            var url = this.buildUrl("/contact/envoyer");
            logger.debug("Envoi d'une demande de contact au serveur :", url, data);
            this.request()
                .post(url)
                .send(data)
                .end(this.endFunction(resolve, reject
                    , "Demande de contact transmise"));
        });
    }
}

export = ContactApi;
