"use strict";
var utils = require("hornet-js-utils");
var newforms = require("newforms");
var React = require("react");
var PageInformationsStore = require("hornet-js-core/src/stores/page-informations-store");
var HornetNavUtils = require("hornet-js-components/src/navigation/utils/navigation-utils").NavigationUtils;

var Menu = require("hornet-js-components/src/navigation/menu");
var MenuLink = require("hornet-js-components/src/navigation/menu-link");
var MenuConstants = require("hornet-js-components/src/navigation/menu-constantes");
var MenuInfosComplementaires = require("hornet-js-components/src/navigation/menu-infos-complementaires");
var BreadCrumb = require("hornet-js-components/src/navigation/bread-crumb");
var SpinnerComponent = require("hornet-js-components/src/spinner/spinner");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var Header = require("src/views/gen/gen-hea-cmp");
var Footer = require("src/views/gen/gen-foo-cmp");
var Content = require("src/views/gen/gen-cnt-cmp");

var NavigationStore = require("hornet-js-components/src/navigation/store/navigation-base-store");

var WError = utils.werror;
var logger = utils.getLogger("applitutoriel.views.hornet-app");

var HornetApp = React.createClass({
    mixins: [HornetComponentMixin],

    statics: {
        storeListeners: [PageInformationsStore]
    },

    propTypes: {
        componentContext: React.PropTypes.object,
        context: React.PropTypes.object,

        relativeLogoUrl: React.PropTypes.string,
        composantPage: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            composantPage: null,
            relativeLogoUrl: "/img/logoHornet.png"
        };
    },

    getInitialState: function () {
        var composantPage = this.props.composantPage || this.getStore(PageInformationsStore).getCurrentPageComponent();

        if (!composantPage) {
            var error = new WError(this.i18n("error.message.ER-GE-APP-01"));
            error.name = " ";
            logger.error("HornetApp : Le composant à rendre est null", error);
            throw error;
        }
        /* Initialisation de la locale pour les formulaire newforms (sinon les dates sont rendues avec le 1er format par défaut qui est "%Y-%m-%d") */
        this.initNewFormsLocale();

        /* Ajoute les extensions nécessaires pour que les champs newforms gèrent les champ aria-required et aria-invalid */
        utils.newFormsAriaModifications();

        this._changePageTitle();
        return {
            themeName: this.getStore(PageInformationsStore).getThemeName(),
            logoUrl: this.genUrlStatic(this.props.relativeLogoUrl),
            composantPage: composantPage
        };
    },

    onChange: function () {
        this._changePageTitle();
        this.setState({
            composantPage: this.getStore(PageInformationsStore).getCurrentPageComponent()
        });
    },

    render: function () {
        logger.info("VIEW HornetApp render");
        var title = this.i18n("applicationTitle");
        return (
            <div id="site">
                <Header applicationTitle={title}
                        linkAccessibilityVisible={true}
                        linkHelpVisible={true}
                        linkContactVisible={true}
                        logoAppliPath={this.state.logoUrl}
                />
                <Menu store={NavigationStore}>
                    <MenuInfosComplementaires>
                        <div className="info">
                            <MenuLink item={this._getMenuItemAuth()} dataPassThru={true}/>
                        </div>
                    </MenuInfosComplementaires>
                </Menu>
                <BreadCrumb store={NavigationStore}/>
                <Content composantPage={this.state.composantPage}/>
                <Footer title={title + " - v" + utils.appSharedProps.get("appVersion")}/>
                <SpinnerComponent/>
            </div>
        );
    },

    _getMenuItemAuth: function () {
        var menuItem;
        var userLogin = this.getStore(PageInformationsStore).getCurrentUser();
        userLogin = (userLogin && userLogin.name) || "guest";

        var items = this.getStore(NavigationStore).getConfigMenu();
        var lastIndex = 0;
        for (var i = 0; i < items.length; i++) {
            if (items[i].visibleDansMenu === true) {
                lastIndex++;
            }
        }
        if (this.getStore(PageInformationsStore).isAuthenticated()) {
            menuItem = {
                id: MenuConstants.MENU_ROOT + lastIndex,
                url: utils.appSharedProps.get("logoutUrl"),
                visibleDansMenu: true,
                level: 0,
                text: this.formatMessage(this.i18n("navigation.disconnect"), {userLogin: userLogin})
            };
        } else {
            menuItem = {
                id: MenuConstants.MENU_ROOT + "1",
                url: utils.appSharedProps.get("loginUrl"),
                visibleDansMenu: true,
                level: 0,
                text: "navigation.connect"
            };
        }
        return menuItem;
    },

    _changePageTitle: function () {
        if (!utils.isServer) {
            var titlePage = HornetNavUtils.retrievePageTextKey(this.getStore(NavigationStore).getConfigMenu(), this.getStore(PageInformationsStore).getCurrentUrlWithoutContextPath());
            if (titlePage) {
                HornetNavUtils.applyTitlePageOnClient(this.i18n(titlePage));
            }
        }
    }
});

module.exports = HornetApp;
