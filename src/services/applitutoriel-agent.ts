"use strict";
import utils = require("hornet-js-utils");
import HornetSuperAgentRequest = require("hornet-js-core/src/services/hornet-superagent-request");
import HornetAgent = require("hornet-js-core/src/services/hornet-agent");
import authUtils = require("hornet-js-utils/src/authentication-utils");

import superAgentPlugins = require("hornet-js-core/src/services/superagent-hornet-plugins");

var logger = utils.getLogger("applitutoriel-js.services.applitutoriel.applitutoriel-agent");

/**
 * Exemple de surcharge de la classe HornetAgent fournie par le framework afin d'ajouter les roles de l'utilisateur
 */
class ApplitutorielAgent extends HornetAgent<HornetSuperAgentRequest> {

    private currentUser:authUtils.UserInformations;

    constructor(user?:authUtils.UserInformations) {
        this.currentUser = user;
        super();
    }

    protected _callSuperAgent(method:string, url:string, callback?:any):HornetSuperAgentRequest {
        var superAgentRequest = super._callSuperAgent(method, url, callback);
        var roles:string = (this.currentUser)? JSON.stringify(this.currentUser.roles) : "";
        logger.trace("Roles ajoutés à la requête : ", roles);
        return superAgentRequest.use(superAgentPlugins.addParam("role", roles));
    }
}

export = ApplitutorielAgent;
