/**
 * Created by s.leduby on 29/01/2015.
 */
/*global : it, describe, ... (cf. 'plugins' dans karma.conf) */
"use strict";

var i18n = require("hornet-js-core/src/i18n/i18n-plugin-fluxible").i18n;
var utils = require("hornet-js-utils");
var React = require("react");
var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var render = TestUtils.render;

// initialisation du logger
var logger = TestUtils.getLogger("applitutoriel.test.page.exemple-page-spec");

var GridForm = require("hornet-js-components/src/form/grid-form");
var Row = GridForm.Row;
var Field = GridForm.Field;

var ExamplePage = require("test/page/example-page");

describe("ExamplePage", function () {

    it("doit afficher les éléments du formulaire", function () {
        // Arrange
        var contexte = construireContext();
        logger.debug("contexte :", contexte);

        // Act
        var $ = render(() =>
                    <ExamplePage />,
                    contexte
        );
        
        var $result = $("div");
        logger.debug("$result :", $result);
    });
});


function construireContext() {

    var messages = {
        "dialog":{
            "close": "Fermer"
        }
    };

    var context ={
        getStore: () => {
            return {
                getAllNotifications: function () {
                    return [];
                },
                getInfoNotifications: function () {
                    return [];
                },
                getErrorNotifications: function () {
                    return [];
                },
                getThemeCss:function () {
                    return "theme";
                }
            }
        },
        executeAction: () => {
        },
        locale: "fr-FR",
        i18n: function (keysString) {
            return i18n(messages)(keysString);
        }
    };

    return context
}
