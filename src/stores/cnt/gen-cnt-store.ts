///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import utils = require("hornet-js-utils");
import BaseStore = require("fluxible/addons/BaseStore");

var logger = utils.getLogger("applitutoriel.stores.cnt.gen-cnt-store");

class ContactStore extends BaseStore{

    static storeName:string = "ContactStore";

    private formData:any;

    static handlers:any = {
        "CONTACT_RECEIVE_FORM_DATA": function (formData) {
            logger.info("RECEIVE_FORM_DATA");
            this.formData = formData;
            this.emitChange();
        },
        "CONTACT_SENT": function () {
            logger.info("CONTACT_SENT");
            this.formData = null;
            this.emitChange();
        }
    };

    constructor(dispatcher) {
        super(dispatcher);
        this.formData = null;
    }

    getFormData():any {
        return this.formData;
    }

    rehydrate(state:any) {
        logger.debug("ContactStore rehydrate");
        this.formData = state.formData;
    }

    dehydrate():any {
        logger.debug("ContactStore dehydrate");
        return {
            formData: this.formData
        };
    }
}

export = ContactStore;
