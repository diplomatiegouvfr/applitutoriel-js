"use strict";

var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var PageInformationsStore = require("hornet-js-core/src/stores/page-informations-store");
var NavigationStore = require("hornet-js-components/src/navigation/store/navigation-base-store");
var NavigationUtils = require("hornet-js-components/src/navigation/utils/navigation-utils").NavigationUtils;

var utils = require("hornet-js-utils");
var logger = utils.getLogger("applitutoriel.views.layouts.hornet-layout");

var HornetLayout = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        composantApp: React.PropTypes.string.isRequired,
        state: React.PropTypes.any.isRequired,
        appLogo: React.PropTypes.string,
        appTheme: React.PropTypes.string,
        fwkTheme: React.PropTypes.string,
        appStatic: React.PropTypes.string,
        applicationLoading: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            appLogo: "/img/logoHornet.png",
            appTheme: "/css/theme.css",
            fwkTheme: process.env.NODE_ENV === "production" ? "/css/theme-min.css" : "/css/theme.css",
            appStatic: "/js/client.js"
        };
    },

    getInitialState: function () {
        var titlePage = this.i18n(
            NavigationUtils.retrievePageTextKey(
                this.getStore(NavigationStore).getConfigMenu(),
                this.getStore(PageInformationsStore).getCurrentUrlWithoutContextPath()));

        return {
            applicationTitle: titlePage
        };
    },

    _getLoadingText: function() {
        return this.props.applicationLoading || this.i18n("applicationLoading");
    },


    render: function () {
        logger.info("VIEW HornetLayout render");
        var loadingStyle = { position: "absolute", left: "50%", top: "50%", margin: "auto", maxWidth: "100%", WebkitTransform: "translate(-50%, -50%)", transform: "translate(-50%, -50%)", cursor: "default", outline: 0 };
        var loadingMaskStyle = { position: "fixed", top: 0, left: 0, bottom: 0, right: 0, zIndex: 2000, overflowX: "hidden", overflowY: "auto", WebkitOverflowScrolling: "touch", background: "rgba(0,0,0,0.5)" };

        try {
            return (
                <html dir="ltr" lang="fr">
                    <head>
                        <meta name="viewport"
                              content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
                        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8"/>
                        <link rel="icon" type="image/png" href={this.genUrlStatic(this.props.appLogo)}/>
                        <title>{this.state.applicationTitle}</title>
                        <link rel="stylesheet" type="text/css" href={this.genUrlTheme(this.props.fwkTheme)}/>
                        <link rel="stylesheet" type="text/css" href={this.genUrlStatic(this.props.appTheme)}/>
                    </head>
                    <body>
                        <div id="firstLoadingSpinner" style={loadingMaskStyle} >
                            <div style={loadingStyle} className="widget-dialogue-body">
                                <span role="progressbar">
                                    <div className="widget-spinner-body" tabIndex={0}>
                                        <div className="widget-spinner-content">{this._getLoadingText()}</div>
                                        <img src={this.genUrlTheme("/img/spinner/ajax_loader_blue_128.gif")} alt={this._getLoadingText()}/>
                                    </div>
                                </span>
                            </div>
                        </div>

                        <div id="app" dangerouslySetInnerHTML={{__html: this.props.composantApp}}/>
                        <script dangerouslySetInnerHTML={{__html: this.props.state.toString()}}/>
                        <script src={this.genUrlStatic(this.props.appStatic)}></script>
                    </body>
                </html>
            );
        } catch (e) {
            logger.error("Render hornet-layout exception", e);
            throw e;
        }
    }
});
module.exports = HornetLayout;