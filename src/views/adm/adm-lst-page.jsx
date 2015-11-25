"use strict";

var React = require("react");
var utils = require("hornet-js-utils");
var Tableau = require("hornet-js-components/src/table/table");
var Icon = require("hornet-js-components/src/icon/icon");
var SecteurStore = require("src/stores/adm/adm-lst-store");
var PageInformationsStore = require("hornet-js-core/src/stores/page-informations-store");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var ListForm = require("src/views/adm/adm-lst-form");
var Form = require("hornet-js-components/src/form/form");
var GridForm = require("hornet-js-components/src/form/grid-form");
var Modal = require("hornet-js-components/src/dialog/modal");
var Alert = require("hornet-js-components/src/dialog/alert");
var Notification = require("hornet-js-components/src/notification/notification");
var SimpleAction = require("hornet-js-core/src/actions/simple-action");

var _ = utils._;
var logger = utils.getLogger("applitutoriel.views.adm.adm-lst-page");
var Row = GridForm.Row;
var Field = GridForm.Field;

var SecteursPage = React.createClass({
    mixins: [HornetComponentMixin],

    statics: {
        storeListeners: {
            onChangeSecteurStore: [SecteurStore]
        }
    },
    getInitialState: function () {
        var intlMessages = this.i18n("administration.secteurs");
        var tableConfig = {
            name: "SECTEURS",
            columns: {
                nom: {
                    title: intlMessages.nom,
                    sort: "text"
                },
                desc: {
                    title: intlMessages.description,
                    sort: "text"
                },
                dateCreat: {
                    title: intlMessages.dateCr,
                    sort: "timestamp",
                    render: this.getDateFormatee
                },
                dateMajEnreg: {
                    title: intlMessages.dateMaj,
                    sort: "timestamp",
                    render: this.getDateFormatee
                },
                auteurCreat: {
                    title: intlMessages.auteur,
                    sort: "text"
                },
                modifier: {
                    title: "",
                    render: this.getIconeModifier,
                    custom: true,
                    hide: false
                },
                supprimer: {
                    title: "",
                    render: this.getIconeSupprimer,
                    custom: true,
                    hide: false
                }
            },
            messages: {
                tableTitle: intlMessages.tableTitle,
                emptyResult: intlMessages.emptyResult,
                captionText: intlMessages.captionText,
                addTitle: intlMessages.addTitle
            },
            store: SecteurStore,
            options: {
                hasAddButton: true,
                clientSideSorting: true,
                defaultSort: {
                    key: "nom",
                    dir: "ASC",
                    type: "text"
                }
            },
            routes: {

            },
            actions: {
                add: this._ajouterSecteur
            },
            dispatchEvent: {
                sortingEvent: "SORT_DATA_SECTEURS"
            }
        };

        var routes = {
            delete: this.genUrl("/secteurs/supprimer") + "/",
            creer: this.genUrl("/secteurs/creer"),
            sauvegarder: this.genUrl("/secteurs/sauvegarder") + "/"
        };

        return {
            i18n:intlMessages,
            tableConfig: tableConfig,
            routes: routes,
            isModalOpen: false,
            isOpenAlertDelete: false,
            formClass: ListForm(intlMessages.form),
            formData: null,
            itemToDelete: null,
            modaleTitle: "",
            modaleClose: ""
        };
    },

    render: function () {
        logger.info("VIEW SecteursPage render");
        return (
            <div>
                <h2>{this.state.i18n.titreSecteur}</h2>
                {this.state.isModalOpen ? null : <Notification isModal={false}/>}
                <Tableau config={this.state.tableConfig}/>
                {this._renderModal()}
                {this._renderAlertSuppression()}
            </div>
        );
    },

    _renderAlertSuppression: function () {
        return (
            <Alert message={this.state.i18n.confirmationSuppression}
                         isVisible={this.state.isOpenAlertDelete}
                         onClickOk={this._supprimer}
                         onClickCancel={this._closeMessageSupprimer}
                         onClickClose={this._closeMessageSupprimer}
                         title={this.state.i18n.suppressionTitle}
                />)
    },

    _renderModal: function () {
        logger.debug("VIEW SecteursPage _renderModal");

        var formConf = {
            autoId: "{name}",
            data: this.state.formData || null
        };

        return (
            <Modal isVisible={this.state.isModalOpen} onClickClose={this._onCancel}
                          title={this.state.modaleTitle} closeLabel={this.state.modaleClose}>
                <div className="content-modal-body">
                    <Notification isModal={true}/>
                    <Form
                        form={this.state.formClass}
                        formConf={formConf}
                        buttons={this.getButtons()}
                        onSubmit={this._onSubmitEdition}
                        isModal={true}
                        >
                        <Row>
                            <Field name="nom" labelClass={"pure-u-1-3"}/>
                        </Row>
                        <Row>
                            <Field name="desc" labelClass={"pure-u-1-3"}/>
                        </Row>
                        <Row>
                            <Field name="date" labelClass={"pure-u-1-3"}/>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    },


    onChangeSecteurStore: function () {
        logger.debug("onChangeSecteurStore");
        this.setState({
            isModalOpen: false
        });
    },

    /**
     * @param time {Number} temps UTC en ms depuis "Epoch"
     * @returns {string} la date formatée suivant le format défini pour les calendriers
     */
    getDateFormatee: function (time) {
        //TODO Uniformiser ce code car la date n"est pas affichée de la même manière côté client/serveur (-> fuseau horaire potentiellement différent?)
        return utils.dateUtils.format(new Date(time), this.i18n("calendar"));
    },

    getIconeModifier: function (value, item) {
        var title = this.formatMessage(this.state.i18n.modificationTitle, {
            "nom": item.nom
        });
        return (<Icon onClick={this._editItem.bind(this,item) }
                      src={this.genUrlTheme("/img/tableau/ico_editer.png")}
                      alt={title}
                      title={title}
                      url="#"/>);
    },

    getIconeSupprimer: function (value, item) {
        var title = this.formatMessage(this.state.i18n.suppresionTitle, {
            "nom": item.nom
        });
        return (<Icon
            onClick={this._showSupprimeAlert.bind(this,item)}
            src={this.genUrlTheme("/img/tableau/ico_supprimer.png")}
            alt={title}
            title={title}
            url="#"/>);
    },

    _showSupprimeAlert: function (item, e) {
        e.preventDefault();
        this.setState({
            isOpenAlertDelete: true,
            itemToDelete: item.id
        });
    },

    _supprimer: function () {
        var idToDelete = this.state.itemToDelete;
        logger.info("Utilisateur est OK pour supprimer l item id:", idToDelete);
        window.routeur.setRouteInternal(this.state.routes.delete + idToDelete);
        this.setState({
            isOpenAlertDelete: false,
            itemToDelete: null
        });
    },

    _closeMessageSupprimer: function () {
        this.setState({
            isOpenAlertDelete: false
        });
    },

    _editItem: function (item, e) {
        e.preventDefault();

        var title = this.i18n("administration.modification");
        var close = this.i18n("administration.closeModification");
        logger.debug("Titre Modale :", title);
        this.executeAction(new SimpleAction(SimpleAction.REMOVE_ALL_NOTIFICATIONS).action());
        this.setState({
            isModalOpen: true,
            modaleTitle: title,
            modaleClose: close,
            formData: _.cloneDeep(item)
        });
    },

    _ajouterSecteur: function (e) {
        e.preventDefault();

        var title = this.i18n("administration.ajout");
        var close = this.i18n("administration.closeAjout");
        logger.debug("Titre Modale :", title);
        this.executeAction(new SimpleAction(SimpleAction.REMOVE_ALL_NOTIFICATIONS).action());
        this.setState({
            isModalOpen: true,
            modaleTitle: title,
            modaleClose: close,
            formData: null
        });
    },

    _onSubmitEdition: function (form) {
        logger.info("Submit Secteur");

        //pour l"exemple demande validation à l"utilisateur (alert dans dialog)
        if (form.validate()) {
            var routeValidationForm = this.state.routes.creer;
            var secteur = form.data;
            // Insertion de l"utilisateur actuellement loggué dans les secteurs
            secteur.user = this.getStore(PageInformationsStore).getCurrentUser().name;
            if (_.isNumber(secteur.id)) {
                routeValidationForm = this.state.routes.sauvegarder + secteur.id;
            }
            window.routeur.setRouteInternal(routeValidationForm, secteur);
        } else {
        document.getElementById("enregistrer").blur();
}
    },

    _onCancel: function () {
        logger.debug("Ferme la boite de dialogue d'édition");
        //this.executeAction(new SimpleAction(SimpleAction.REMOVE_ALL_NOTIFICATIONS).action());

        this.setState({
            isModalOpen: false,
            formData: null
        });
    },

    getButtons: function () {
        var intlForm = this.i18n("form");
        var intlFormMess = this.i18n("administration");
        return [{
            type: "submit",
            id: "enregistrer",
            name: "action:save",
            value: "Enregistrer",
            className: "hornet-button",
            label: intlForm.valid,
            title: intlFormMess.validTitle
        }, {
            type: "button",
            id: "cancel",
            name: "action:cancel",
            value: "Annuler",
            className: "hornet-button",
            onClick: this._onCancel,
            label: intlForm.cancel,
            title: intlFormMess.cancelTitle
        }];

    }
});

module.exports = SecteursPage;
