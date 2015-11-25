///<reference path="../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import ServiceApi = require("hornet-js-core/src/services/service-api");
import ConfigLib = require("hornet-js-utils/src/config-lib");
import ApplitutorielAgent = require("src/services/applitutoriel-agent");

var logger = utils.getLogger("applitutoriel-js.services.applitutoriel-service-api");

/**
 * Exemple de surcharge de la classe ServiceApi fournie par le framework afin d'instancier notre propre Agent de requetage
 */
class ApplitutorielServiceApi extends ServiceApi {
    private user = null;

    constructor(actionContext?:ActionContext, user?:any) {
        super(actionContext);
        this.user=user;
    }

    request() {
        return new ApplitutorielAgent(this.user);
    }
}

export = ApplitutorielServiceApi;
