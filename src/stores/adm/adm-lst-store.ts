///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
var _ = utils._;

import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import ITableStore = require("hornet-js-components/src/table/store/table-store-interface");

var logger = utils.getLogger("applitutoriel.stores.adm.adm-lst-store");

import BaseStore = require("fluxible/addons/BaseStore");

class SecteurStore extends BaseStore implements ITableStore{

    static storeName:string = "SecteurStore";

    private secteurs:Array<any>;


    static handlers:any = {
        "SECTEUR_RECEIVE_LIST": function (secteurs) {
            logger.info("SECTEUR_RECEIVE_LIST nbTotal", (secteurs) ? secteurs.length : "");
            logger.trace("SECTEUR_RECEIVE_LIST liste", (secteurs) ? secteurs : "");
            this.updateData(secteurs);
        },
        "SORT_DATA_SECTEURS": function (secteurs) {
            logger.info("SORT_DATA_SECTEURS nbTotal", (secteurs) ? secteurs.length : "");
            logger.trace("SORT_DATA_SECTEURS liste", (secteurs) ? secteurs : "");
            this.updateData(secteurs);
        }
    };

    constructor(dispatcher) {
        super(dispatcher);
        this.secteurs = new Array();
    }

    private updateData(secteurs:Array<any>) {
        this.secteurs = secteurs;
        this.emitChange();
    }

    getListSecteurs():Array<any> {
        logger.trace("Récupération des secteurs.");
        return this.secteurs;
    }

    getAllResults():any {
        logger.trace("Récupération des secteurs par le composant tableau");
        return {
            items: this.secteurs,
            nbTotal: this.secteurs.length
        };
    }

    getFilters():any {
        return null;
    }

    getCriterias(){
        return null;
    }

    rehydrate(state:any) {
        logger.debug("SecteurStore rehydrate");
        this.secteurs = state.secteurs;
    }

    dehydrate():any {
        logger.debug("SecteurStore dehydrate");
        return {
            secteurs: this.secteurs
        };
    }
}

export = SecteurStore;
