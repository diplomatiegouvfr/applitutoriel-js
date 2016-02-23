"use strict";
import ApplitutorielServiceApi = require("src/services/applitutoriel-service-api");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");

import Photo = require("hornet-js-core/src/data/file");

import utils = require("hornet-js-utils");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");

var logger = utils.getLogger("applitutoriel.services.par.par-fpa-api");
var WError = utils.werror;
var _ = utils._;

var urlPartenaire = "/partenaires";
var urlPhoto = urlPartenaire + "/photo";

class FichePartenaireApi extends ApplitutorielServiceApi {
    charger(id, mode:string) {
        logger.info("SERVICES - charger : ", id, mode);
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            if (!_.isNumber(parseInt(id))) {
                reject(new WError(this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-PA-FPA-09"), {"id": id})));
            }
            var path = "/partenaires/" + mode;

            this.request()
                .get(this.buildUrl(path + "/" + id)) //
                .end(this.endFunction(resolve, reject
                    , "Lecture partenaire d'id " + id));
        });
    }

    modifier(id, partenaire) {
        logger.info("SERVICES - modifier : ", id, partenaire);

        if (id && utils.isServer) {

            return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
                if (!_.isNumber(parseInt(id))) {
                    reject(new WError(this.actionContext.formatMsg(this.actionContext.i18n("error.message.ER-PA-FPA-09"), {"id": id})));
                }
                logger.debug("Envoi d'une mise à jour de partenaire : ", partenaire);

                this.request()
                    .put(this.buildUrl(urlPartenaire + "/sauvegarder/" + id)) //
                    .send(this.convertToRemotePartenaire(partenaire)) //
                    .end(this.endFunction(resolve, reject
                        , "Modification partenaire d'id " + id));
            });
        } else {

            var sendPart = partenaire;
            return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
                logger.debug("Envoi d'une creation de partenaire : ", partenaire);
                var path = "/partenaires/sauvegarder";

                // ajout = POST
                var request = this.request().post(this.buildUrl(path));
                if (id) {
                    path = path + "/" + id; // en modification
                    // modif = PUT
                    request = this.request().put(this.buildUrl(path));
                }//else en création


                if (utils.isServer) {
                    // On est sur NodeJS et on envoi vers le backend, on encode donc la photo en JSON et on POST de manière "classique"
                    sendPart = this.convertToRemotePartenaire(partenaire);
                    request.send(sendPart);
                } else {
                    // On est sur le browser, on va encoder le POST en multipart et transférer le corps en JSON et l"image dans un "part" séparé
                    request.field("content", JSON.stringify(sendPart));
                    if (sendPart.photo && sendPart.photo instanceof File) {
                        // mantis 55104
                        // L'objet photo est de type "File" seulement
                        // quand un fichier est a été uploadé dans le formulaire et transmis dans la requête
                        // Si ce n'est pas un fichier, on peut l'ignorer (cela signifie que la photo n'a pas changé)
                        // De plus, si on essaye quand même de l'attacher dans la requête alors que ce n'est pas un fichier,
                        // firefox plante (Argument 2 of FormData.append does not implement interface Blob)
                        request.attach("photo", sendPart.photo, sendPart.photo.name);
                    }
                }
                request.end(this.endFunction(resolve, reject, "Enregistrement partenaire"));
            });
        }
    }

    lirePhoto(idPhoto) {
        logger.info("SERVICES - lirePhoto : ", idPhoto);
        return new ExtendedPromise((resolve:(n:ActionsChainData) => void, reject) => {
            this.request()
                .get(this.buildUrl(urlPhoto + "/" + idPhoto)) //
                .end(function (err, res) {
                    if (res && res.ok && res.body) {
                        // création d"un objet Image pour que le router sache qu"il foit renvoyer un
                        var photo = new Photo();
                        photo.buffer = res.body.buffer;
                        photo.id = res.body.id;
                        photo.name = res.body.nom;
                        photo.mimeType = res.body.mimeType;

                        resolve(new ActionsChainData().parseResponse(res).withBody(photo));
                    } else {
                        reject(new WError(err, this.actionContext.i18n("error.message.ER-PA-FPA-10")));
                    }
                });

        });
    }

    /**
     * node >v10 does not parse JSON buffer too a buffer so we must detect and create a buffer
     * @param buff
     * @returns {*}
     */
    convertBufferToArray(buff:any) {
        var buffer = buff;
        if (buff !== undefined && Buffer.isBuffer(buff)) {
            buffer = new Buffer(buff).toJSON();
        }
        return buffer;
    }

    convertToRemotePartenaire(webPartenaire) {

        var remotePartenaire:any = _.assign({}, webPartenaire);

        remotePartenaire.civilite = {id: webPartenaire.civilite};
        remotePartenaire.pays = {id: webPartenaire.pays};
        remotePartenaire.ville = {id: webPartenaire.ville, pays: {id: webPartenaire.pays}};

        remotePartenaire.nationalite = {id: webPartenaire.nationalite};
        remotePartenaire.satisfaction = (_.isArray(webPartenaire.satisfaction)) ? JSON.stringify(webPartenaire.satisfaction) : webPartenaire.satisfaction;

        if (remotePartenaire.photo && remotePartenaire.photo.buffer) {
            var photo:any = remotePartenaire.photo;
            var buffer = this.convertBufferToArray(photo.buffer);
            remotePartenaire.photo = {
                id: null,
                nom: photo.originalname,
                originalname: photo.originalname,
                name: photo.originalname,
                mimeType: photo.mimetype,
                encoding: photo.encoding,
                size: photo.size,
                buffer: buffer.data
            };
            photo = null;

        }
        return remotePartenaire;
    }
}

export = FichePartenaireApi;
