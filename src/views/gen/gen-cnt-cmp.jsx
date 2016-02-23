"use strict";
var utils = require("hornet-js-utils");

var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("applitutoriel.views.gen.gen-foo-cmp");

var Content = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        composantPage: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            composantPage: null
        };
    },

    render: function () {
        logger.info("VIEW Content render");
        return (
            <main id="bd" role="main">
                    <this.props.composantPage/>
            </main>);

    }

});

module.exports = Content;