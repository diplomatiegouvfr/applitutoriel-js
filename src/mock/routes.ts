///<reference path="../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import Partenaire = require("src/bo/par/par-rpa-bo");

var secteurs = require("src/resources/mock/adm/adm-lst-data").secteurs;
var produits = require("src/resources/mock/adm/adm-rps-data").repartition;
var villes = require("src/resources/mock/par/par-rpa-villes").villes;
var pays = require("src/resources/mock/par/par-pays-data").pays;
var tableauDePartenaires = require("src/resources/mock/par/par-rpa-data").tableau;

var _ = utils._;
var logger = utils.getLogger("applitutoriel.mock.routes");
var partenaires = tableauDePartenaires.liste;

/**
 * Liste des utilisateurs en mode bouchon
 * @type {any[]}
 */
var users = [
    {
        "name": "test",
        "roles": [{"id": 2, "name": "AppliTuto_USER"}]
    },
    {
        "name": "admin",
        "roles": [{"id": 1, "name": "AppliTuto_ADMIN"},{"id": 2, "name": "AppliTuto_USER"}]
    }
];
function findByUsername(username) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.name === username) {
            return user;
        }
    }
    return null;
}

class BouchonRoutes {

    static build(router) {
        //DEFINR LES ROUTES A BOUCHONNER

        router.post("/partenaires/rechercher", function () {
            this.res.send(tableauDePartenaires);
        });

        router.get("/partenaires/:id", function (id) {
            var idPartenaire = parseInt(id, 10), //
                partenaire:Partenaire = null;
            logger.debug("Recupèrer le partenaire bouchonné qui à l\"id:", idPartenaire);
            var partenaire = _.find(partenaires, function (item:Partenaire) {
                logger.debug(item);
                if (item.id == id) {
                    return true;
                }
            });
            if (partenaire) {
                this.res.send(partenaire);
            } else {
                this.res.status(404).send({
                    error: "Not found."
                });
            }
        });

        router.delete("/partenaires/:id", function (id) {
            var idPartenaire = parseInt(id, 10), //
                partenaire = null;
            logger.debug("Suppression du partenaire, id:", id);
            _.remove(partenaires, function (item:Partenaire) {
                if (item.id == id) {
                    return true;
                }
            });

            this.res.send({
                message: "partenaire supprimé"
            });
        });

        router.post("/partenaires", function () {

        });

        router.put("/partenaires/:id", function () {
            this.res.send({
                message: "partenaire envoyé"
            });
        });

        router.post("/contact/envoyer", function () {
            this.res.json({
                message: "Courriel envoyé"
            });
        });

        router.get("/secteurs", function () {
            this.res.send(secteurs);
        });
        router.get("/produits", function () {
            this.res.send(produits);
        });
        router.get("/villes", function () {
            this.res.send(villes);
        });
        router.get("/pays", function () {
            this.res.send(pays);
        });
        router.post("/pays/nationalites/rechercher", function () {
            this.res.send(pays);
        });

        router.post("/utilisateurs/auth", function () {
            var user = findByUsername(this.req.body.login);
            this.res.json(user);
        });
    }
}
export = BouchonRoutes;