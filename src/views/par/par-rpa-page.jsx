"use strict";

var React = require("react"),
    utils = require("hornet-js-utils"),
    logger = utils.getLogger("applitutoriel.views.par.par-rpa-page"),
    _ = utils._;

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

// Components
var ComposantRecherche = require("src/views/par/par-rpa-crit"),
    ComposantTableau = require("src/views/par/par-rpa-tab"),
    Notification = require("hornet-js-components/src/notification/notification");

var RecherchePartenairePage = React.createClass({
    mixins: [HornetComponentMixin],

    getInitialState: function () {
        logger.info("RecherchePartenairesPage getInitialState");
        var intlMess = this.i18n("partenairesListePage");
        var intlTab = intlMess.tableau;

        var appName = "PARTENAIRE";

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
            i18nTab: intlTab,
            appConfig: appConfig
        };
    },

    render: function () {
        logger.info("RecherchePartenairesPage render");

        return (
            <div>
                <h2>{this.state.i18n.form.titreFormulaire}</h2>
                <Notification />
                <ComposantRecherche appConfig={this.state.appConfig}/>
                <ComposantTableau
                    i18nTab={this.state.i18nTab}
                    i18n={this.state.i18n}
                    appConfig={this.state.appConfig}
                />
            </div>
        );
    }
});

module.exports = RecherchePartenairePage;
