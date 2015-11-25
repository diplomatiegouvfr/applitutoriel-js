"use strict";

var React = require("react");
var ChartDonut = require("hornet-js-components/src/chart/chart-donut");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var ProduitStore = require("src/stores/adm/adm-rps-store");

var logger = require("hornet-js-utils").getLogger("applitutoriel.views.adm.adm-rps-page");

var RepartitionPage = React.createClass({

    mixins: [HornetComponentMixin],

    getInitialState() {

        return {
            i18n: this.i18n("repartitionPage"),
            data: this.getStore(ProduitStore).getRepartitionProduits()
        }
    },

    render() {
        logger.info("VIEW RepartitionPage render");
        return (
            <div id="donutdiv">
                <ChartDonut data={this.state.data} messages={this.state.i18n}/>
            </div>
        );
    }
});

module.exports = RepartitionPage;
