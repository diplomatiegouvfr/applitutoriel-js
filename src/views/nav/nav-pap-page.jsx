"use strict";

var React = require("react");
var utils = require("hornet-js-utils");
var Plan = require("hornet-js-components/src/navigation/plan");
var NavigationStore = require("hornet-js-components/src/navigation/store/navigation-base-store");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("applitutoriel.views.nav.nav-pap-page");

var PlanAppliPage = React.createClass({
    mixins: [HornetComponentMixin],

    render: function () {
        logger.info("VIEW PlanAppliPage render");
        return (
            <div>
                <h2>{this.i18n("navigation.plan")}</h2>
                <Plan store={NavigationStore} />
            </div>
        );
    }
});

module.exports = PlanAppliPage;
