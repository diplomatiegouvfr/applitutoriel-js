"use strict";
import utils = require("hornet-js-utils");
import Photo = require("hornet-js-core/src/data/file");
import BaseStore = require("fluxible/addons/BaseStore");

var logger = utils.getLogger("applitutoriel.stores.par.par-fpa-store");
var _ = utils._;

class FichePartenaireStore extends BaseStore {

    static storeName:string = "FichePartenaireStore";

    private currentFiche:any;

    private villes:Array<any>;
    private pays:Array<any>;
    private nationalites:Array<any>;
    private produits:Array<any>;
    private secteurs:Array<any>;

    static handlers:any = {
        "REMOVE_PARTENAIRE_FORM_DATA": function () {
            this.currentFiche = {
                partenaire: {
                    civilite: 0,
                    pays: null,
                    isClient: false,
                    ville: null
                },
                modeFiche: "creer"
            };
        },
        "PARTENAIRE_RECEIVE_FORM_DATA": function (res) {
            logger.debug("PARTENAIRE_RECEIVE_FORM_DATA", res);
            this.currentFiche = {partenaire: this._convertToWebPartenaire(res.data), modeFiche: res.mode};
            this.emitChange();
        },
        "RECEIVE_VILLES_FORM_DATA": function (villes) {
            logger.debug("RECEIVE_VILLES_FORM_DATA");
            this.villes = villes;
            this.emitChange();
        },
        "RECEIVE_PAYS_FORM_DATA": function (pays) {
            logger.debug("RECEIVE_PAYS_FORM_DATA");
            this.pays = pays;
            this.emitChange();
        },
        "RECEIVE_NATIONALITE_RESULTS": function (nationalites) {
            logger.debug("RECEIVE_NATIONALITE_RESULTS");
            this.nationalites = (nationalites || []).map(function (nationalite) {
                return {
                    value: nationalite.id,
                    text: nationalite.nationalite
                };
            });
            this.emitChange();
        }
    };

    constructor(dispatcher) {
        super(dispatcher);
        this.initialize();
    }

    private initialize() {
        this.currentFiche = {
            partenaire: {
                civilite: null,
                pays: null,
                ville: null,
                nationalite: null,
                nationalite$text: null,
                isClient: true,
                isVIP: false
            },
            modeFiche: "creer"
        };
        this.secteurs = new Array();
        this.pays = new Array();
        this.villes = new Array();
        this.nationalites = new Array();
        this.produits = new Array();
    }

    private _transformToId(remotePartenaire, champs) {
        return remotePartenaire[champs] && remotePartenaire[champs].id;
    }

    private _convertToWebPartenaire(partenaire:any):any {
        logger.debug("Objet à convertir: ", partenaire);

        var webPartenaire:any = _.assign({}, partenaire);

        // newforms ne prend pas en compte les objets complexes, il faut mettre à plat les objets
        webPartenaire.civilite = this._transformToId(partenaire, "civilite");
        webPartenaire.pays = this._transformToId(partenaire, "pays");

        if (webPartenaire.ville) {
            webPartenaire.pays = this._transformToId(partenaire.ville, "pays");
            // webPartenaire.ville.pays = undefined; //supprimé pour ne pas permettre d'ambiguité
        }

        if (partenaire.photo) {
            webPartenaire.photo = <Photo>_.assign({
                originalname: partenaire.photo.nom,
                name: partenaire.photo.nom
            }, partenaire.photo);

        }

        webPartenaire.ville = this._transformToId(partenaire, "ville");

        if (partenaire.nationalite) {
            webPartenaire.nationalite = partenaire.nationalite.id;
            // Pour faire fonctionner l'auto-complete
            webPartenaire.nationalite$text = partenaire.nationalite.nationalite;
        }

        if (partenaire.satisfaction) {
            webPartenaire.satisfaction = JSON.parse(partenaire.satisfaction);
        }

        webPartenaire.isClient = partenaire.isClient === true;
        return webPartenaire;
    }

    getFichePartenaire():any {
        return this.currentFiche.partenaire;
    }

    isFichePartenaireModeConsultation():boolean {
        return this.currentFiche.modeFiche === "consulter";
    }

    isFichePartenaireModeEdition():boolean {
        return this.currentFiche.modeFiche === "editer";
    }

    isFichePartenaireModeCreation():boolean {
        return !this.isFichePartenaireModeConsultation() && !this.isFichePartenaireModeEdition();
    }

    getListePays():Array<any> {
        return this.pays;
    }

    getListeNationalites():Array<any> {
        return this.nationalites;
    }

    getListeVille(idPays:number):Array<any> {
        if (idPays) {
            return this.villes.filter(function (ville) {
                // == Pour avoir la coercition de type (int / string)
                if (ville.pays && ville.pays.id === idPays) {
                    return true;
                }
                return false;
            });
        } else {
            return this.villes;
        }
    }

    getVilles():Array<any> {
        return this.villes;
    }

    getListeProduits():Array<any> {
        return this.produits;
    }

    rehydrate(state:any) {
        logger.debug("FichePartenaireStore rehydrate");
        this.currentFiche = state.currentFiche;
        this.villes = state.villes;
        this.pays = state.pays;
        this.nationalites = state.nationalites;
        this.produits = state.produits;
    }

    dehydrate():any {
        logger.debug("FichePartenaireStore rehydrate");
        return {
            currentFiche: this.currentFiche,
            villes: this.villes,
            pays: this.pays,
            nationalites: this.nationalites,
            produits: this.produits
        };
    }
}

export = FichePartenaireStore;
