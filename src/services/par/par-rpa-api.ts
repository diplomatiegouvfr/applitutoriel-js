"use strict";

import ApplitutorielServiceApi = require("src/services/applitutoriel-service-api");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import utils = require("hornet-js-utils");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");
import MediaType = require("hornet-js-core/src/protocol/media-type");
import Photo = require("hornet-js-core/src/data/file");

var logger = utils.getLogger("applitutoriel.services.par.par-rpa-api");
var WError = utils.werror;
var _ = utils._;

var urlPartenaire = "/partenaires";
var urlRechercher = urlPartenaire + "/rechercher";
var urlPhoto = urlPartenaire + "/photo";

class PartenaireApi extends ApplitutorielServiceApi {
    rechercher(data, reqMimeType) {
        logger.info("SERVICES - rechercher : ", data, reqMimeType);
        return new ExtendedPromise((resolve, reject) => {
            var superAgentReq = this.request()
                .post(this.buildUrl(urlRechercher))
                .send(data)
                .set("Accept", reqMimeType);
            try {
                MediaType.fromMime(reqMimeType).readFromSuperAgent(this, superAgentReq, resolve, reject, "Recherche partenaires");
            } catch (e) {
                console.error("Promise PartenaireApi.rechercher catch");
            }
        });
    }

    lirePhoto(idPhoto) {
        logger.info("SERVICES - lirePhoto : ", idPhoto);
        return new ExtendedPromise((resolve:Function, reject) => {
            this.request()
                .get(this.buildUrl(urlPhoto + "/" + idPhoto))
                .accept(utils.CONTENT_JSON)
                .end(function (err, res) {
                    if (res && res.ok && res.body) {
                        var photo = new Photo();
                        photo.buffer = res.body.buffer;
                        photo.id = res.body.id;
                        photo.name = res.body.nom;
                        photo.mimeType = res.body.mimeType;
                        resolve(new ActionsChainData().parseResponse(res).withBody(photo));
                    } else {
                        reject(new WError(err, this.actionContext.i18n("error.message.ER-PA-FPA-09")));
                    }
                });

        });
    }

    supprimer(id) {
        logger.info("SERVICES - supprimer : ", id);
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            if (!_.isNumber(parseInt(id))) {
                reject(new WError(this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-PA-FPA-09"), {"id": id})));
            }

            var path = urlPartenaire + "/supprimer/" + id;

            this.request()
                .del(this.buildUrl(path)) //
                .end(this.endFunction(resolve, reject
                    , "Suppression du partenaire avec l'id " + id));
        });
    }

    supprimerEnMasse(items) {
        logger.info("SERVICES - supprimerEnMasse :", items);

        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            var path = urlPartenaire + "/suppression";
            logger.debug("Envoi d'une liste de partenaires à supprimer :", items);
            this.request()
                .post(this.buildUrl(path))
                .send(items) //
                .end(this.endFunction(resolve, reject,
                    "Suppression en masse de partenaires"));
        });
    }
}

export = PartenaireApi;
