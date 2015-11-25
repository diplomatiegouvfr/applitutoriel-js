"use strict";

var utils = require("hornet-js-utils");

var React = require("react");
var newforms = require("newforms");
var Onglets = require("hornet-js-components/src/tab/tabs");
var Onglet = require("hornet-js-components/src/tab/tab");
var HornetForm = require("hornet-js-components/src/form/form");
var Notification = require("hornet-js-components/src/notification/notification");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var GridForm = require("hornet-js-components/src/form/grid-form");
var Row = GridForm.Row;
var Field = GridForm.Field;
var FieldSet = GridForm.FieldSet;
var FichePartenaireForm = require("src/views/par/par-fpa-form");

var FichePartenaireStore = require("src/stores/par/par-fpa-store");
var RecherchePartenaireStore = require("src/stores/par/par-rpa-store");
var TableStore = require("hornet-js-components/src/table/store/table-store");

var _ = utils._;
var logger = utils.getLogger("applitutoriel.views.par.par-fpa-page");

var FichePartenairesAction = require("src/actions/par/par-fpa-actions");

/**
 * Ecran de détail de partenaire en lecture ou en édition
 * @type {ComponentClass<P>}
 */
var FichePartenaires = React.createClass({
    mixins: [HornetComponentMixin],

    /** Branchement sur les évenements "onChange" déclenchés par les "Stores" */
    statics: {
        storeListeners: [FichePartenaireStore]
    },

    /** Mise à jour spécifique de la page sur un changement de données FichePartenaire  */
    onChange: function () {
        logger.debug("FichePartenaires onChange");

        var partenaireStore = this.getStore(FichePartenaireStore);

        /* Met à jour la liste de villes proposées suivant le pays sélectionné */
        var villeSelectionnee = this.state.form.data.ville;
        var champVille = this.state.form.fields.ville;

        var listeVilles = [{id: 0, libelle: this.i18n("partenaireFichePage.form.aucune")}];
        var listeVillesStore = partenaireStore.getListeVille(this.state.form.data.pays);
        if(listeVillesStore) {
            listeVilles = listeVilles.concat(listeVillesStore);
        }
        var choices = newforms.util.makeChoices(listeVilles, "id", "libelle");
        champVille.setChoices(choices);
        var updatedData;
        try {
            champVille.clean(villeSelectionnee);
            updatedData = {ville: villeSelectionnee};
        } catch(validationError) {
            /* La liste de villes a changé et la ville précédemment sélectionnée n'en fait pas partie :
            on sélectionne donc par défaut la première ville de la nouvelle liste */
            updatedData = {ville: choices[0][0]};
        }
        /* On s'assure que l'état de validation du formulaire est à jour pour le champ ville */
        this.state.form.updateData(updatedData);
        /* Force le rendu React, car l'état interne du formulaire a changé, mais pas l'état du composant page */
        this.forceUpdate();
    },


    getInitialState: function () {
        logger.debug("FichePartenaires getInitialState");
        var partenaireStore = this.getStore(FichePartenaireStore);
        var isModeCreation = partenaireStore.isFichePartenaireModeCreation();
        var isModeEdition = partenaireStore.isFichePartenaireModeEdition();
        var isModeReadOnly = partenaireStore.isFichePartenaireModeConsultation();
        var partenaireData = partenaireStore.getFichePartenaire();

        var urlAction = this.genUrl("/partenaires");
        if (isModeCreation) {
            urlAction = urlAction + "/sauvegarder";
        } else if (isModeEdition) {
            urlAction = urlAction + "/sauvegarder/" + partenaireData.id;
        } else {
            //mode consultation
        }
        var intlMess = this.i18n("partenaireFichePage");

        return {
            i18n: intlMess,
            readOnly: isModeReadOnly,
            form: this._initNewForm(isModeCreation, intlMess.form),
            lastPays: partenaireData && partenaireData.pays,
            urlAction: urlAction
        }
    },


    /**
     * Fonction appelée lorsque l'état de validation du formulaire change.
     * Vérifie si le pays sélectionné a changé et déclenche si nécessaire le chargement de la liste de villes correspondante.
     */
    onFormChange: function () {
        logger.debug("FichePartenaires onFormChange");
        var nouveauPays = this.state.form.data.pays;
        if (this.state.lastPays != nouveauPays) {
            logger.debug("On Pays Change");
            this.setState({lastPays: nouveauPays});
            logger.debug("Le choix du pays a été modifié, il faut mettre à jour la liste des villes");
            if (nouveauPays && !isNaN(nouveauPays)) {
                this.executeAction(new FichePartenairesAction.ListerVillesParPays().action(), {"id": nouveauPays});
            }
        }
        /* Force le rendu React, car l'état interne de validation du formulaire a changé, mais pas l'état du composant page */
        this.forceUpdate();
    },

    render: function () {
        logger.info("FichePartenairePage render");

        try {

            var titre = this.formatMessage(this.state.i18n.titre, {
                "nom": this.state.form.data.nom,
                "prenom": this.state.form.data.prenom
            });

            return (
                <div className="pure-u-1">
                    <h2>{titre}</h2>
                    <Notification />
                    <HornetForm
                        form={this.state.form}
                        action={this.state.urlAction}
                        buttons={this._getFormButtons(this.state.readOnly)}
                        onSubmit={this._onSubmit}
                        readOnly={this.state.readOnly}
                        formClassName=""
                    >

                        <Onglets selectedTabIndex={0}>
                            <Onglet title={this.state.i18n.ongletIdentiteTitre}>
                                <FieldSet name={this.state.i18n.form.type}>
                                    <Row>
                                        {this.state.readOnly ? <Field name="isClient"/> :
                                        <Field name="isClient"
                                               labelClass="pure-u-1-2 blocLabelUp"
                                        />}
                                        <Field name="isVIP"
                                               toolTip={this.state.i18n.form.fields.isVIP.tooltip}
                                               abbr={this.state.i18n.form.fields.isVIP.title}
                                               lang="en"
                                        />
                                    </Row>
                                </FieldSet>

                                <FieldSet name={this.state.i18n.form.civilite}>
                                    <Row>
                                        <Field groupClass="pure-u-1-2" name="civilite"/>
                                    </Row>
                                    <Row>
                                        <Field name="nom"/>
                                        <Field name="nomLocal"/>
                                    </Row>
                                    <Row>
                                        <Field name="prenom"/>
                                        <Field name="prenomLocal"/>
                                    </Row>
                                    <Row>
                                        <Field groupClass="pure-u-1-2" name="nationalite"/>
                                    </Row>
                                </FieldSet>
                                <FieldSet name={this.state.i18n.form.sectionCoordPro}>
                                    <Row>
                                        <Field labelClass="pure-u-1-4" name="organisme"/>
                                    </Row>
                                    <Row>
                                        <Field labelClass="pure-u-1-4" name="fonction"/>
                                    </Row>
                                    <Row>
                                        <Field name="proTelFixe"/>
                                        <Field name="proTelPort"/>
                                    </Row>
                                    <Row>
                                        <Field labelClass="pure-u-1-4" name="proCourriel"
                                               toolTip="Courriel utilisé pour les invitations"/>
                                    </Row>
                                    <Row>
                                        <Field groupClass="pure-u-1-2" name="proFax"/>
                                    </Row>
                                </FieldSet>
                                <FieldSet name={this.state.i18n.form.sectionAdresse}>
                                    <Row>
                                        <Field labelClass="pure-u-1-4" name="proAdrRue"/>
                                    </Row>
                                    <Row>
                                        <Field groupClass="pure-u-1-2" name="proAdrCP"/>
                                    </Row>
                                    <Row>
                                        <Field name="pays"/>
                                        <Field name="ville"/>
                                    </Row>
                                </FieldSet>
                                <FieldSet name={this.state.i18n.form.sectionCoordAssistance}>
                                    <Row>
                                        <Field name="assistNom"/>
                                        <Field name="assistPrenom"/>
                                    </Row>
                                    <Row>
                                        <Field groupClass="pure-u-1-2" name="assistTel"/>
                                    </Row>
                                    <Row>
                                        <Field labelClass="pure-u-1-4" name="assistCourriel"/>
                                    </Row>
                                </FieldSet>
                                <FieldSet name={this.state.i18n.form.sectionDivers}>
                                    <Field labelClass="pure-u-1-4 blocLabelUp" name="commentaire"/>
                                    <Field labelClass="pure-u-1-4" name="photo"/>
                                </FieldSet>
                                <FieldSet name="Satisfaction client">
                                    <Row>
                                        <Field labelClass="pure-u-1-4 blocLabelUp" name="satisfaction"/>
                                    </Row>
                                </FieldSet>

                            </Onglet>
                            <Onglet title={this.state.i18n.ongletListeProduitTitre}>
                                <p>{this.state.i18n.ongletListeProduitContenu}</p></Onglet>
                        </Onglets>
                    </HornetForm>

                </div>
            )

        } catch (e) {
            logger.error("Render Fiche Partenaire exception", e);
            throw e;
        }
    },
    _getFormButtons: function (isConsultation) {
        var intlMessages = this.i18n("form");

        var buttons = [];
        if (!isConsultation) {
            buttons.push({
                type: "submit",
                id: "envoi",
                name: "action:envoi",
                value: "Valider",
                className: "hornet-button",
                label: intlMessages.valid,
                title: this.state.i18n.form.validTitle
            });
        }

        buttons.push({
            type: "button",
            id: "annuler",
            name: "action:annuler",
            value: "Annuler",
            className: "hornet-button",
            label: intlMessages.cancel,
            title: (isConsultation) ? this.state.i18n.form.backTitle : this.state.i18n.form.cancelTitle,
            onClick: this._onCancel
        });

        return buttons;
    },

    _onSubmit: function () {
        logger.info("Submit du formulaire fiche partenaire");
        if (this.state.form.validate()) {
            var tableStore = this.getStore(TableStore);
            var parStore = this.getStore(RecherchePartenaireStore);
            var name = "PARTENAIRE";

            var data = {
                partenaire: _.assign({}, this.state.form.cleanedData),
                recherche: {
                    pagination: tableStore.getPaginationData(name),
                    sort: tableStore.getSortData(name),
                    filters: tableStore.getFilterData(name),
                    criterias: parStore.getCriterias()
                }
            };

            // Uniformisation du type de données de string vers boolean
            data.partenaire.isClient = data.partenaire.isClient == "true";

            window.routeur.setRouteInternal(this.state.urlAction, data);
        } else {
            document.getElementById("envoi").blur();
        }
    },

    /** Annulation : retour à l"écran de recherche de partenaires */
    _onCancel: function () {
        logger.info("Retour écran de recherche de partenaires");
        window.routeur.setRoute(this.genUrl("/partenaires/cancel"));
    },

    /**
     * Gere l"instanciation du newForm
     * @param isModeCreation indique si on est en mode création de partenaire
     * @param intMessForm messages internationalisés pour le formulaire fiche partenaire
     * @returns {FichePartenaireForm}
     * @private
     */
    _initNewForm: function (isModeCreation, intMessForm) {
        var partenaireStore = this.getStore(FichePartenaireStore);

        var defaultData = null;
        if (!isModeCreation) {
            //En mode non création on va chercher les données dans le store plutot que présenter une page vide
            defaultData = partenaireStore.getFichePartenaire();
        }

        // Création du newForm avec les listes de choix récupérées
        var formClass = FichePartenaireForm(partenaireStore, intMessForm);

        var localForm = new formClass({
            onChange: this.onFormChange,
            autoId: "id_for_PartenaireFichePage",
            data: defaultData,
            validation: "manual"
        });

        // Affiche les villes du pays sélectionné (restreint la liste)
        if (defaultData && !_.isUndefined(defaultData.pays)) {
            var storeListeVilles = partenaireStore.getListeVille(defaultData.pays);
            if (storeListeVilles && storeListeVilles.length <= 0) {
                this.executeAction(new FichePartenairesAction.ListerVillesParPays().action(), {"id": defaultData.pays});
            }
            if (storeListeVilles && storeListeVilles.length > 0) {
                var choix = newforms.util.makeChoices(storeListeVilles, "id", "libelle");
                localForm.fields.ville.setChoices(choix);
            }
        } else {
            var noVilles = [{id: 0, libelle: intMessForm.aucune}];
            var nochoice = newforms.util.makeChoices(noVilles, "id", "libelle");
            localForm.fields.ville.setChoices(nochoice);
            partenaireStore.villes = [];
        }
        return localForm;
    }
});

module.exports = FichePartenaires;
