"use strict";

var React = require("react");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("applitutoriel.views.par.par-rpa-page");

var Icon = require("hornet-js-components/src/icon/icon");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var newforms = require("newforms");
var HornetForm = require("hornet-js-components/src/form/form");
var Notification = require("hornet-js-components/src/notification/notification");
var GridForm = require("hornet-js-components/src/form/grid-form");
var Row = GridForm.Row;
var Field = GridForm.Field;
var FieldSet = GridForm.FieldSet;
var PartenaireForm = require("src/views/par/par-rpa-form");
var Tableau = require("hornet-js-components/src/table/table");
var Roles = require("src/utils/roles");

var TableActions = require("hornet-js-components/src/table/actions/table-actions");

// Stores
var RecherchePartenaireStore = require("src/stores/par/par-rpa-store");
var SecteurStore = require("src/stores/adm/adm-lst-store");
var TableStore = require("hornet-js-components/src/table/store/table-store");

var PageInformationsStore = require("hornet-js-core/src/stores/page-informations-store");

var Alert = require("hornet-js-components/src/dialog/alert");

// Actions
var PartenaireAction = require("src/actions/par/par-rpa-actions");

var _ = utils._;

var RecherchePartenairesPage = React.createClass({
    mixins: [HornetComponentMixin],
    statics: {
        storeListeners: [RecherchePartenaireStore]
    },

    getInitialState: function () {
        logger.info("RecherchePartenairesPage getInitialState");
        var intlMess = this.i18n("partenairesListePage");
        var intlTab = intlMess.tableau;

        var recherchePartenaireStore = this.getStore(RecherchePartenaireStore);

        var appName = "PARTENAIRE";

        var tableConfig = {
            name: appName,
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
        };

        var pageInformationsStore = this.getStore(PageInformationsStore);
        if (pageInformationsStore.userHasRole(Roles.ADMIN)) {
            logger.debug("Accès aux actions admin");
            tableConfig.columns.modifier.hide = false;
            tableConfig.columns.supprimer.hide = false;
            tableConfig.options.hasAddButton = true;
            tableConfig.options.hasDelAllButton = true;
        }

        var appConfig = {
            name: appName,
            routes: {
                search: this.genUrl("/partenaires/rechercher"),
                modify: this.genUrl("/partenaires/editer"),
                view: this.genUrl("/partenaires/consulter"),
                delete: this.genUrl("/partenaires/supprimer")
            }
        };

        return {
            i18n: intlMess,
            i18nCalendar: this.i18n("calendar"),
            i18nForm: this.i18n("form"),
            items: recherchePartenaireStore.getAllResults(),
            formClass: PartenaireForm(this.getStore(SecteurStore), intlMess.form),
            formData: recherchePartenaireStore.getCriterias(),
            appConfig: appConfig,
            tableConfig: tableConfig,
            isOpenAlertDelete: false,
            itemToDelete: null,
            resetStoreOnRedirect: true
        };
    },

    onChange: function () {
        this.forceUpdate();
    },

    componentDidMount: function () {
        logger.trace("RecherchePartenairesPage componentDidMount");
        this.throttledSetRouteInternal = this.throttle(window.routeur.setRouteInternal.bind(window.routeur));
    },

    render: function () {
        logger.info("RecherchePartenairesPage render");
        var intlMessages = this.state.i18n.form;

        var localFormConf = {
            autoId: "id_for_PartenaireForm",
            data: this.getStore(RecherchePartenaireStore).getCriterias()
        };

        return (
            <div>
                <h2>{intlMessages.titreFormulaire}</h2>
                <Notification />
                {this._renderAlertSuppression()}
                <HornetForm
                    form={this.state.formClass}
                    formConf={localFormConf}
                    subTitle={intlMessages.sousTitreFormulaire}
                    action={this.state.appConfig.routes.search}
                    buttons={this._getDefaultButtons()}
                    onSubmit={this._onSubmit}
                    text={intlMessages.textIntroForm}
                >
                    <Row>
                        <Field name="isClient"
                               toolTip={intlMessages.fields.typePartenaire.tooltip}
                               labelClass="pure-u-1-2 blocLabelUp"
                        />
                        <Field name="isVIP"
                               toolTip={intlMessages.fields.isVIP.tooltip}
                               abbr={intlMessages.fields.isVIP.title}/>
                    </Row>
                    <Row>
                        <Field groupClass="pure-u-1-2" name="idSecteur"/>
                    </Row>

                    <FieldSet name={intlMessages.groupChamp} classNames="groupeChamps">
                        <Row>
                            <Field name="startDate"/>
                            <Field name="endDate"/>
                        </Row>
                    </FieldSet>
                </HornetForm>

                <Tableau
                    config={this.state.tableConfig}
                    isVisible={this.getStore(RecherchePartenaireStore).isTableVisible()}
                />
            </div>
        );
    },

    componentWillUnmount: function () {
        logger.trace("RecherchePartenairesPage componentWillUnmount");

        if (this.state.resetStoreOnRedirect) {
            this.executeAction(new TableActions.ResetTableStore().action(), {
                    key: this.state.tableConfig.name
                }
            );
            this.executeAction(new PartenaireAction.ResetStore().action());
        }
    },

    _getDefaultButtons: function () {
        return [
            {
                type: "submit",
                id: "envoi",
                name: "action:envoi",
                value: "Valider",
                className: "hornet-button",
                label: this.state.i18nForm.search,
                title: this.state.i18n.form.searchTitle
            },
            {
                type: "submit",
                id: "reinitialiser",
                name: "action:reinitialiser",
                value: "Réinitialiser",
                className: "hornet-button",
                label: this.state.i18nForm.reinit,
                onClick: this._onReinitialiser,
                title: this.state.i18n.form.reinitTitle
            }
        ];
    },

    _renderAlertSuppression: function () {
        logger.debug("VIEW PartenairesPage _renderAlertSuppression");
        return (
            <Alert message={this.state.i18n.confirmationSuppression}
                   isVisible={this.state.isOpenAlertDelete}
                   onClickOk={this._supprimer}
                   onClickCancel={this._closeMessageSupprimer}
                   onClickClose={this._closeMessageSupprimer}
                   title={this.state.i18n.suppression}
            />
        );
    },

    getIconeConsulter: function (value, item) {
        return (
            <Icon url={this.state.appConfig.routes.view + "/" + item.id}
                  src={this.genUrlTheme("/img/tableau/ico_consulter.png")}
                  alt={ this._formatIconLabel(this.state.i18n.tableau.iconConsulter, item)}
                  title={ this._formatIconLabel(this.state.i18n.tableau.iconConsulter, item)}
                  onClick={this._onClickTable.bind(this)}
            />
        );
    },

    getIconeModifier: function (value, item) {
        return (
            <Icon url={this.state.appConfig.routes.modify + "/" + item.id }
                  src={this.genUrlTheme("/img/tableau/ico_editer.png")}
                  alt={ this._formatIconLabel(this.state.i18n.tableau.iconEditer, item)}
                  title={ this._formatIconLabel(this.state.i18n.tableau.iconEditer, item)}
                  onClick={this._onClickTable.bind(this)}
            />
        );
    },

    getIconeSupprimer: function (value, item) {
        return (
            <Icon url="#"
                  src={this.genUrlTheme("/img/tableau/ico_supprimer.png")}
                  alt={ this._formatIconLabel(this.state.i18n.tableau.iconSupprimer, item)}
                  title={ this._formatIconLabel(this.state.i18n.tableau.iconSupprimer, item)}
                  onClick={this._showSupprimeAlert.bind(this, item)}
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

    _onReinitialiser: function (e) {
        logger.info("RecherchePartenairesPage _onReinitialiser");
        e.preventDefault();

        this.executeAction(new TableActions.ResetTableStore().action(), {
                key: this.state.tableConfig.name
            }
        );
        this.executeAction(new PartenaireAction.ResetStore().action());
    },

    _onSubmit: function (form) {
        logger.info("RecherchePartenairesPage Submit");

        if (form.validate()) {
            var data = {
                filters: {},
                criterias: _.clone(form.cleanedData),
                pagination: this.getStore(TableStore).getPaginationNewData() //récupération d'une pagination par défaut
            };
            logger.trace("DATA POSTEES:", data);

            this.executeAction(new TableActions.ResetTableStore().action(), {
                    key: this.state.tableConfig.name
                }
            );

            this.throttledSetRouteInternal(this.state.appConfig.routes.search, data);
        }
    },

    _supprimer: function () {
        logger.info("RecherchePartenairesPage _supprimer");

        var id = this.state.itemToDelete;
        var tableStore = this.getStore(TableStore);
        var parStore = this.getStore(RecherchePartenaireStore);
        var name = this.state.appConfig.name;

        var data = {
            pagination: tableStore.getPaginationData(name),
            sort: tableStore.getSortData(name),
            filters: tableStore.getFilterData(name),
            criterias: parStore.getCriterias()
        };
        logger.trace("Data to Delete : ", data);

        this.throttledSetRouteInternal(this.state.appConfig.routes.delete + "/" + id, data);

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
        return utils.dateUtils.formatInTZ(new Date(time), this.i18n('calendar').dateFormat, utils.dateUtils.TZ_EUROPE_PARIS);
    }
});

module.exports = RecherchePartenairesPage;