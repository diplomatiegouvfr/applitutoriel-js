///<reference path="../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
// En tout premier: transpileur jsx -> js
require("node-jsx").install({
    extension: ".jsx",
    harmony: true
});

//L'import du logger doit être fait le plus tôt possible
import utils = require("hornet-js-utils");
import Server = require("hornet-js-core/src/server");
import ServerConfiguration = require("hornet-js-core/src/server-conf");

import Logger = require("hornet-js-utils/src/logger");

import ServerLog = require("hornet-js-core/src/log/server-log");
var serveurLoggerFn = ServerLog.getLoggerBuilder(utils.config.get("log"));

var logger = utils.getLogger("applitutoriel.server", serveurLoggerFn);

(<any> Error).stackTraceLimit = Infinity;

import Routes = require("src/routes/routes");
import React = require("react");

import AppI18nLoader = require("src/i18n/app-i18n-loader");
var Menu = require("src/resources/navigation");

var HornetApp = require("src/views/hornet-app");
var HornetAppReact = React.createFactory(HornetApp);

var HornetLayout = require("src/views/layouts/hornet-layout");
var HornetLayoutReact = React.createFactory(HornetLayout);
var HornetErrorComponent = require("src/views/gen/gen-err-page");

//Enregistrement des stores
import AppDispatcher = require("src/dispatcher/app-dispatcher");

function routeLoader(name) {
    return require("src/routes/" + name);
}

var appDispatcher = new AppDispatcher().getDispatcher();

var configServer:ServerConfiguration = {
    serverDir: __dirname,
    staticPath: "../static",
    appComponent: HornetAppReact,
    layoutComponent: HornetLayoutReact,
    errorComponent: HornetErrorComponent,
    defaultRoutesClass: new Routes(),
    sessionStore: null, //new RedisStore({host: "localhost",port: 6379,db: 2,pass: "RedisPASS"}),
    routesLoaderfn: routeLoader,
    /*Directement un flux JSON >>internationalization:require("./i18n/messages-fr-FR.json"),*/
    /*Sans utiliser le système clé/valeur>> internationalization:null,*/
    internationalization: new AppI18nLoader(),
    dispatcher: appDispatcher,
    menuConfig: Menu.menu,
    loginUrl: utils.config.get("authentication.loginUrl"),
    logoutUrl: utils.config.get("authentication.logoutUrl"),
    welcomePageUrl: utils.config.get("welcomePage"),
    publicZones: [
        utils.config.get("welcomePage")
    ]
};


import HornetMiddlewares = require("hornet-js-core/src/middleware/middlewares")
import AuthenticationMiddleware = require("src/middleware/authentication");
import ThemeSwitcherMiddleware = require("src/middleware/theme-switcher");

var middlewares = [
    HornetMiddlewares.LoggerTIDMiddleware,
    HornetMiddlewares.DisableKeepAliveMiddleware,
    HornetMiddlewares.SecurityMiddleware,
    HornetMiddlewares.WelcomePageRedirectMiddleware,
    HornetMiddlewares.StaticPathMiddleware,
    HornetMiddlewares.BodyParserJsonMiddleware,
    HornetMiddlewares.BodyParserUrlEncodedMiddleware,
    HornetMiddlewares.MockManagerMiddleware,
    HornetMiddlewares.SessionMiddleware,
    AuthenticationMiddleware,
    HornetMiddlewares.LoggerUserMiddleware,
    HornetMiddlewares.CsrfMiddleware,
    ThemeSwitcherMiddleware,
    HornetMiddlewares.MulterMiddleware,
    HornetMiddlewares.RouterDataMiddleware,
    HornetMiddlewares.RouterViewMiddleware,
    HornetMiddlewares.ErrorMiddleware
];

var server = new Server(configServer, middlewares);
server.start();
