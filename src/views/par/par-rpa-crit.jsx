"use strict";

var React = require("react"),
    utils = require("hornet-js-utils"),
    logger = utils.getLogger("applitutoriel.views.par.par-rpa-crit"),
    _ = utils._;

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

// Components
var newforms = require("newforms"),
    HornetForm = require("hornet-js-components/src/form/form"),
    GridForm = require("hornet-js-components/src/form/grid-form"),
    FieldSet = GridForm.FieldSet,
    Row = GridForm.Row,
    Field = GridForm.Field;

// Forms
var PartenaireForm = require("src/views/par/par-rpa-form");

// Stores
var RecherchePartenaireStore = require("src/stores/par/par-rpa-store");
var SecteurStore = require("src/stores/adm/adm-lst-store");
var TableStore = require("hornet-js-components/src/table/store/table-store");

// Actions
var PartenaireAction = require("src/actions/par/par-rpa-actions"),
    TableActions = require("hornet-js-components/src/table/actions/table-actions");

var RecherchePartenaireCritere = React.createClass({
    mixins: [HornetComponentMixin],
    statics: {
        storeListeners: {_handleChangeStore: [RecherchePartenaireStore]}

    },

    propTypes: {
        appConfig: React.PropTypes.object
    },

    getInitialState: function () {
        logger.info("RecherchePartenairesPage getInitialState");
        var intlMess = this.i18n("partenairesListePage");

        var recherchePartenaireStore = this.getStore(RecherchePartenaireStore);

        var formConf = {
            autoId: "id_for_PartenaireForm",
            initial: _.cloneDeep(recherchePartenaireStore.getCriterias())
        };

        return {
            i18n: intlMess,
            i18nForm: this.i18n("form"),
            formClass: PartenaireForm(this.getStore(SecteurStore), intlMess.form),
            formConf: formConf
        };
    },

    _handleChangeStore: function () {
        // on synchronise la couche data de newforms avant de mettre à jour la vue !
        this.refs.parRpaForm.state.form.updateData(_.cloneDeep(this.getStore(RecherchePartenaireStore).getCriterias()));

        // on force la mise à jour de la vue
        this.forceUpdate();
    },

    render: function () {
        logger.info("RecherchePartenairesPage render");
        var intlMessages = this.state.i18n.form;

        return (
            <HornetForm
                form={this.state.formClass}
                formConf={this.state.formConf}
                subTitle={intlMessages.sousTitreFormulaire}
                buttons={this._getDefaultButtons()}
                onSubmit={this._onSubmit}
                text={intlMessages.textIntroForm}
                ref="parRpaForm"
            >
                <Row>
                    <Field
                        name="isClient"
                        toolTip={intlMessages.fields.typePartenaire.tooltip}
                        labelClass="pure-u-1-2 blocLabelUp"
                    />
                    <Field
                        name="isVIP"
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
        );
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

    _onReinitialiser: function (e) {
        logger.info("RecherchePartenairesPage _onReinitialiser");
        e.preventDefault();

        this.refs.parRpaForm.state.form.willValidate = false;

        this.executeAction(new TableActions.ResetTableStore().action(), {
                key: this.props.appConfig.name
            }
        );
        this.executeAction(new PartenaireAction.ResetStore().action());
    },

    _onSubmit: function (form) {
        logger.info("RecherchePartenairesPage _onSubmit");

        if (form.validate()) {
            var data = {
                filters: {},
                criterias: _.clone(form.cleanedData),
                pagination: this.getStore(TableStore).getPaginationPageIndexReseted(this.props.appConfig.name) //récupération d'une pagination par défaut
            };
            logger.trace("DATA POSTEES:", data);

            this.executeAction(new TableActions.ResetTableStore().action(), {
                    key: this.props.appConfig.name
                }
            );

            /* Pas besoin de bloquer la soumission intempestive de formulaire maintenant,
             c'est déjà fait dans le composant form */
            window.routeur.setRouteInternal(this.props.appConfig.routes.search, data);
        }
    }
});

module.exports = RecherchePartenaireCritere;
