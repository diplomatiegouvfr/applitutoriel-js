"use strict";

var React = require("react");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("applitutoriel.views.gen.gen-err-page");

var Notification = require("hornet-js-components/src/notification/notification");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");


var ErreurPage = React.createClass({
    mixins: [HornetComponentMixin],

    render: function () {
        logger.info("VIEW ErreurPage render");
        return (
            <div>
                <h2>{this.i18n("errorsTitle")}</h2>
                <Notification />
            </div>
        );
    }
});

module.exports = ErreurPage;
