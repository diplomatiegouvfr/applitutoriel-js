"use strict";

import ITableStore = require("hornet-js-components/src/table/store/table-store-interface");

import utils = require("hornet-js-utils");
import BaseStore = require("fluxible/addons/BaseStore");

var logger = utils.getLogger("applitutoriel.stores.par.par-rpa-store");

class RecherchePartenaireStore extends BaseStore implements ITableStore {

    static storeName:string = "RecherchePartenaireStore";

    public static START_DATE_DEFAULT:Date = new Date(2013, 3, 22);

    private results:any;
    private criterias:any;
    private filters:any;

    private tableVisible:boolean;

    static handlers:any = {
        "PARTENAIRES_RECEIVE_SEARCH_RESULTS": function (res) {
            logger.trace("PARTENAIRES_RECEIVE_SEARCH_RESULTS liste", (res) ? res.liste : "");
            logger.info("PARTENAIRES_RECEIVE_SEARCH_RESULTS nbTotal", (res) ? res.nbTotal : "");
            this.results = {
                items: res.liste,
                nbTotal: res.nbTotal
            };
            this.filters = {};
            this.tableVisible = true;
            this.emitChange();
        },
        "PARTENAIRES_SAVE_CRITERIAS": function (res) {
            this.criterias = res;
        },
        "PARTENAIRES_REINITIALIZE": function () {
            logger.info("PARTENAIRES_REINITIALIZE");
            this.initialize();
            this.emitChange();
        },
        "PARTENAIRES_RESET_FILTRE": function () {
            logger.info("PARTENAIRES_RESET_FILTRE");
            this.filters = {};
        }
    };

    constructor(dispatcher) {
        super(dispatcher);
        this.initialize();
    }

    private initialize() {
        this.results = {};
        this.criterias = {
            isClient: true,
            isVIP: false,
            idSecteur: "0",
            startDate: RecherchePartenaireStore.START_DATE_DEFAULT,
            endDate: ""
        };
        this.filters = {};
        this.tableVisible = false;
    }

    isTableVisible():boolean {
        logger.debug("Récupération de l'état de l'affichage de la table.");
        return this.tableVisible;
    }

    getAllResults(key:string):any {
        logger.debug("Récupération des partenaires.");
        return this.results;
    }

    getFilters(key:string):any {
        logger.debug("Récupération des filters.");
        return this.filters;
    }

    getCriterias(key:string):any {
        logger.debug("Récupération des criteres.");
        return this.criterias;
    }

    rehydrate(state:any) {
        logger.debug("RecherchePartenaireStore rehydrate");
        this.results = state.results;
        this.criterias = state.criterias;
        this.filters = state.filters;
        this.tableVisible = state.tableVisible;
    }

    dehydrate():any {
        logger.debug("RecherchePartenaireStore dehydrate");
        return {
            results: this.results,
            criterias: this.criterias,
            filters: this.filters,
            tableVisible: this.tableVisible
        };
    }
}

export = RecherchePartenaireStore;
