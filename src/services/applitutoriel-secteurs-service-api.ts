"use strict";
import utils = require("hornet-js-utils");
import ServiceApi = require("hornet-js-core/src/services/service-api");

var logger = utils.getLogger("applitutoriel-js.services.applitutoriel-secteurs-service-api");

/**
 * Exemple de surcharge de la classe ServiceApi fournie par le framework
 * afin de changer l'adresse du serveur tomcat pour gerer le multi service
 */
class ApplitutorielSecteursServiceApi extends ServiceApi {

    /**
     * Le service par défaut est configuré dans default.json (partie services)
     * Mais il est possible d'en configurer d'autres (configuration "multi-services")
     * Exemple :
     * Si le service des secteurs est déployé sur un autre serveur que celui par défaut
     * alors on redéfinit les variables serviceHost et serviceName pour mettre l'adresse
     * du service spécifique des secteurs (secteursServices.host dans default.json)
     *
     * @param actionContext
     */
    constructor(actionContext?:ActionContext) {
        super(actionContext);
        if (utils.isServer) {
            // exemple de configuration multi-service
            // coté serveur (requetes depuis le serveur nodejs vers le serveur tomcat), on redéfinit l'adresse du service
            if (utils.config.getOrDefault("mock.enabled", false)) {
                super.setServiceHost(utils.config.getOrDefault("mock.secteursServices.host", "localhost"));
                super.setServiceName(utils.config.getOrDefault("mock.secteursServices.name", utils.buildContextPath("/hornet-mock")));
            } else {
                super.setServiceHost(utils.config.get("secteursServices.host"));
                super.setServiceName(utils.config.get("secteursServices.name"));
            }
            logger.info("Redefinition de l'adresse des services pour les secteurs : ", super.getServiceHost(), super.getServiceName());
        } else {
            // coté client, mode fullSpa (requêtes depuis le browser/client js vers le serveur tomcat),
            // on redéfinit aussi l'adresse du service
            var fullSpa:boolean = utils.config.getOrDefault("fullSpa.enabled", false);
            if (fullSpa) {
                super.setServiceHost(utils.config.getOrDefault("fullSpa.secteurs.host", ""));
                super.setServiceName(utils.buildContextPath(utils.config.getOrDefault("fullSpa.secteurs.name", "/services")));
                logger.info("Redefinition de l'adresse des services pour les secteurs : ", super.getServiceHost(), super.getServiceName());
            } else {
                // sinon (requêtes depuis le browser/client js vers le serveur nodejs)
                // on garde l'adresse du serveur node
            }
        }
    }
}

export = ApplitutorielSecteursServiceApi;
