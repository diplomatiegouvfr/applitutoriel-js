"use strict";

var React = require("react"),
    utils = require("hornet-js-utils"),
    _ = utils._,
    logger = utils.getLogger("applitutoriel.views.par.par-rpa-tab");


var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var Roles = require("src/utils/roles");

// Components
var Icon = require("hornet-js-components/src/icon/icon"),
    Tableau = require("hornet-js-components/src/table/table"),
    Alert = require("hornet-js-components/src/dialog/alert");

// Stores
var RecherchePartenaireStore = require("src/stores/par/par-rpa-store"),
    TableStore = require("hornet-js-components/src/table/store/table-store"),
    PageInformationsStore = require("hornet-js-core/src/stores/page-informations-store");

// Actions
var PartenaireAction = require("src/actions/par/par-rpa-actions"),
    TableActions = require("hornet-js-components/src/table/actions/table-actions");

var RecherchePartenaireTableau = React.createClass({
    mixins: [HornetComponentMixin],
    statics: {
        storeListeners: [RecherchePartenaireStore]
    },

    propTypes: {
        appConfig: React.PropTypes.object,
        i18nTab: React.PropTypes.object,
        i18n: React.PropTypes.object
    },

    onChange: function () {
        this.forceUpdate();
    },

    getInitialState: function () {
        var intlTab = this.props.i18nTab;
        var tableConfig = {
            name: this.props.appConfig.name,
            columns: {
                nom: {
                    title: intlTab.colonnes.nom,
                    sort: "text",
                    filter: {
                        type: "text"
                    }
                },
                prenom: {
                    title: intlTab.colonnes.prenom,
                    sort: "text",
                    filter: {
                        type: "text"
                    }
                },
                proCourriel: {
                    title: intlTab.colonnes.courriel,
                    sort: "text",
                    filter: {
                        type: "text"
                    }
                },
                organisme: {
                    title: intlTab.colonnes.organisme,
                    /*sort: "text",*/
                    filter: {
                        type: "text"
                    }
                },
                labelIsVIP: {
                    title: intlTab.colonnes.labelIsVIP,
                    sort: {
                        by: "VIP",
                        type: "text"
                    },
                    filter: {
                        type: "checkbox"
                    }
                },
                dateModif: {
                    title: intlTab.colonnes.dateModif,
                    render: this._getDateFormatee,
                    sort: "timestamp",
                    filter: {
                        type: "date",
                        errorValidation: intlTab.colonnes.dateModifInvalid
                    }
                },
                consulter: {
                    title: "",
                    render: this.getIconeConsulter,
                    custom: true
                },
                modifier: {
                    title: "",
                    render: this.getIconeModifier,
                    hide: true,
                    custom: true
                },
                supprimer: {
                    title: "",
                    render: this.getIconeSupprimer,
                    hide: true,
                    custom: true
                }
            },
            messages: {
                tableTitle: intlTab.tableTitle,
                emptyResult: intlTab.emptyResult,
                deleteAllConfirmation: intlTab.deleteAllConfirmation,
                deleteAllActionTitle: intlTab.deleteAllActionTitle,
                deleteAllTitle: intlTab.deleteAllActionTitle,
                captionText: intlTab.captionText,
                addTitle: intlTab.addTitle,
                filterValid: intlTab.filterValid,
                filterValidTitle: intlTab.filterValidTitle,
                filterCancel: intlTab.filterCancel,
                filterCancelTitle: intlTab.filterCancelTitle,
                hideFiltering: intlTab.hideFiltering,
                hideFilteringTitle: intlTab.hideFilteringTitle,
                hideFilter: intlTab.hideFilter,
                hideFilterTitle: intlTab.hideFilterTitle,
                showFilter: intlTab.showFilter,
                showFiltering: intlTab.showFiltering,
                selectedAllTitle: intlTab.selectedAllTitle,
                deselectedAllTitle: intlTab.deselectedAllTitle,
                exportTitle: intlTab.exportTitle
            },
            store: RecherchePartenaireStore,
            options: {
                itemsPerPage: 10,
                hasFilter: true,
                clientSideSorting: false,
                hasExportButtons: true,
                hasAddButton: false,
                hasDelAllButton: false,
                selectedKey: "id",
                defaultSort: {
                    key: "nom",
                    dir: "ASC",
                    type: "text"
                }
            },
            routes: {
                search: this.genUrl("/partenaires/rechercher"),
                add: this.genUrl("/partenaires/creer"),
                export: this.genUrl("services/partenaires/export"),
                deleteAll: this.genUrl("/partenaires/supprimer/0")
            }
            /* Il est possible de spécifier ici d'autre choix de taille de page que ceux proposés par défaut
             * grâce à la propriété pageSizeSelect (ne pas oublier d'ajouter les libellés dans messages). */
            //,
            /* Il est possible de surcharger les icones/pictogrammes du tableau */
            //imgFilePath: "http://localhost/default"
        };


        var pageInformationsStore = this.getStore(PageInformationsStore);
        if (pageInformationsStore.userHasRole(Roles.ADMIN)) {
            logger.debug("Accès aux actions admin");
            tableConfig.columns.modifier.hide = false;
            tableConfig.columns.supprimer.hide = false;
            tableConfig.options.hasAddButton = true;
            tableConfig.options.hasDelAllButton = true;
        }

        return ({
            tableConfig: tableConfig,
            isOpenAlertDelete: false,
            /* Indique si les critères de recherche, le tri et la pagination doivent être réinitialisés
             au démontage du composant */
            resetStoreOnRedirect: true
        }
        )
    },

    render: function () {
        return (
            <div>
                {this._renderAlertSuppression()}
                <Tableau
                    config={this.state.tableConfig}
                    isVisible={this.getStore(RecherchePartenaireStore).isTableVisible()}
                />
            </div>
        )
    },

    componentWillUnmount: function () {
        logger.trace("par-rpa-tab componentWillUnmount");

        if (this.state.resetStoreOnRedirect) {
            this.executeAction(new TableActions.ResetTableStore().action(), {
                    key: this.props.appConfig.name
                }
            );
            this.executeAction(new PartenaireAction.ResetStore().action());
        }
    },

    _renderAlertSuppression: function () {
        logger.debug("par-rpa-tab _renderAlertSuppression");
        return (
            <Alert
                message={this.props.i18n.confirmationSuppression}
                isVisible={this.state.isOpenAlertDelete}
                onClickOk={this._supprimer}
                onClickCancel={this._closeMessageSupprimer}
                onClickClose={this._closeMessageSupprimer}
                title={this.props.i18n.suppression}
            />
        );
    },

    getIconeConsulter: function (value, item) {
        return (
            <Icon
                url={this.props.appConfig.routes.view + "/" + item.id}
                src={this.genUrlTheme("/img/tableau/ico_consulter.png")}
                alt={ this._formatIconLabel(this.props.i18n.tableau.iconConsulter, item)}
                title={ this._formatIconLabel(this.props.i18n.tableau.iconConsulter, item)}
                onClick={this._onClickTable}
            />
        );
    },

    getIconeModifier: function (value, item) {

        var self = this,
            modifierFunction = function () {
                self._onClickTable();
            };

        return (
            <Icon
                url={this.props.appConfig.routes.modify + "/" + item.id }
                src={this.genUrlTheme("/img/tableau/ico_editer.png")}
                alt={ this._formatIconLabel(this.props.i18n.tableau.iconEditer, item)}
                title={ this._formatIconLabel(this.props.i18n.tableau.iconEditer, item)}
                onClick={modifierFunction}
            />
        );
    },

    getIconeSupprimer: function (value, item) {

        var self = this,
            deleteFunction = function () {
                self._showSupprimeAlert(item)
            };

        return (
            <Icon
                url="#"
                src={this.genUrlTheme("/img/tableau/ico_supprimer.png")}
                alt={ this._formatIconLabel(this.props.i18n.tableau.iconSupprimer, item)}
                title={ this._formatIconLabel(this.props.i18n.tableau.iconSupprimer, item)}
                onClick={deleteFunction}
            />
        );
    },

    _onClickTable: function () {
        this.setState({
            resetStoreOnRedirect: false
        });
    },

    _showSupprimeAlert: function (item) {
        this.setState({
            isOpenAlertDelete: true,
            itemToDelete: item.id
        });
    },
    _supprimer: function () {
        logger.info("RecherchePartenairesPage _supprimer");

        var id = this.state.itemToDelete;
        var tableStore = this.getStore(TableStore);
        var parStore = this.getStore(RecherchePartenaireStore);
        var name = this.props.appConfig.name;

        var data = {
            pagination: tableStore.getPaginationData(name),
            sort: tableStore.getSortData(name),
            filters: tableStore.getFilterData(name),
            criterias: parStore.getCriterias()
        };
        logger.trace("Data to Delete : ", data);

        window.routeur.setRouteInternal(this.props.appConfig.routes.delete + "/" + id, data);

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

    _formatIconLabel: function (message, item) {
        return this.formatMessage(message, {
            nom: item.nom,
            prenom: item.prenom
        });
    },

    /**
     * @param time {Number} temps UTC en ms depuis "Epoch"
     * @returns {string} la date formatée suivant le format défini pour les calendriers
     */
    _getDateFormatee: function (time) {
        return utils.dateUtils.formatInTZ(new Date(time), this.i18n("calendar").dateFormat, utils.dateUtils.TZ_EUROPE_PARIS);
    }
});

module.exports = RecherchePartenaireTableau;
