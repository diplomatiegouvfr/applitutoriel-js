"use strict";
import utils = require("hornet-js-utils");
import BaseStore = require("fluxible/addons/BaseStore");

var logger = utils.getLogger("applitutoriel.stores.adm.adm-rps-store");
var _ = utils._;

class ProduitStore extends BaseStore {

    static storeName:string = "ProduitStore";

    private produits:Array<any>;

    static handlers:any = {
        "PRODUIT_RECEIVE_REPARTITION": function (produits) {
            logger.debug("PRODUIT_RECEIVE_REPARTITION : ", produits);
            this.updateData(produits);
        }
    };

    private updateData(produits) {
        var stateChange = !_.isEqual(this.produits, produits);
        if (stateChange) {
            this.produits = produits;
            this.emitChange();
        }
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.produits = new Array();
    }

    getRepartitionProduits():Array<any> {
        logger.debug("Récupération de la repartition des produits.");
        return this.produits;
    }

    rehydrate(state:any) {
        logger.debug("ProduitStore rehydrate");
        this.produits = state.produits;
    }

    dehydrate():any {
        logger.debug("ProduitStore dehydrate");
        return {
            produits: this.produits
        };
    }
}

export = ProduitStore;
