"use strict";

import GenericDispatcher = require("hornet-js-core/src/dispatcher/generic-dispatcher");

import ContactStore = require("src/stores/cnt/gen-cnt-store");
import RecherchePartenaireStore = require("src/stores/par/par-rpa-store");
import NavigationBaseStore = require("hornet-js-components/src/navigation/store/navigation-base-store");
import TableStore = require("hornet-js-components/src/table/store/table-store");

import FichePartenaireStore = require("src/stores/par/par-fpa-store");
import SecteurStore = require("src/stores/adm/adm-lst-store");
import ProduitStore = require("src/stores/adm/adm-rps-store");

class AppDispatcher extends GenericDispatcher {

    constructor(componentActionErrorHandler?:Function) {
        var dispatcherConf = undefined;
        if (componentActionErrorHandler) {
            dispatcherConf = {
                componentActionHandler: componentActionErrorHandler
            };
        }

        super(dispatcherConf);

        this.dispatcher.registerStore(ContactStore);
        this.dispatcher.registerStore(RecherchePartenaireStore);
        this.dispatcher.registerStore(NavigationBaseStore);
        this.dispatcher.registerStore(TableStore);
        this.dispatcher.registerStore(FichePartenaireStore);
        this.dispatcher.registerStore(SecteurStore);
        this.dispatcher.registerStore(ProduitStore);
    }
}

export = AppDispatcher;
