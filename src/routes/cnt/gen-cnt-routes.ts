"use strict";
import IRoutes = require("hornet-js-core/src/routes/router-interfaces");
import utils = require("hornet-js-utils");
import fvaNS = require("hornet-js-core/src/actions/form-validation-action");

import actionsContact = require("src/actions/cnt/gen-cnt-actions");
import ContactForm = require("src/views/cnt/gen-cnt-form");
import Roles = require("src/utils/roles");
import contactPage = require("src/views/cnt/gen-cnt-page");

var logger = utils.getLogger("applitutoriel.routes.gen.ren-cnt-routes");

class ContactRoutes implements IRoutes.IRoutesBuilder {

    buildViewRoutes(match:IRoutes.MatchViewFn) {
        logger.info("Initialisation des routes view de la page Contact");
        match("/", () => {
            logger.info("routes CONTACT / ROUTER VIEW");
            return {
                composant: contactPage,
                roles: Roles.EVERYONE
            };
        });
    }

    buildDataRoutes(match:IRoutes.MatchDataFn) {

        logger.info("Initialisation des routes data de la page Contact");

        match("/envoyer", (context) => {
            logger.info("routes CONTACT envoyer ROUTER DATA");
            var formData = context.req.body;
            var formClass = ContactForm(context.actionContext.i18n("contactPage.form"));
            var actionValider = new fvaNS.FormValidationAction().withApplicationForm(<fvaNS.NewsFormValidation> new formClass({
                data: formData
            })).dispatchIfFormNotValid("CONTACT_RECEIVE_FORM_DATA");
            return {
                actions: [actionValider, new actionsContact.Send().withPayload(formData)],
                roles: Roles.EVERYONE
            };
        }, "post");
    }
}

export = ContactRoutes;
