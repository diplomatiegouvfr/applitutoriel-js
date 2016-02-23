"use strict";
var utils = require("hornet-js-utils");

var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("applitutoriel.views.gen.gen-foo-cmp");

var Footer = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        title: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            title: ""
        };
    },

    render: function () {
        return (
            <footer id="ft" className="pure-g-r" role="contentinfo">
                <div id="footer" className="pure-u-1">
                    <p>{this.props.title}</p>
                </div>
            </footer>
        );

    }

});

module.exports = Footer;