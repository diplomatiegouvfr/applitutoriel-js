// En tout premier: transpileur jsx -> js
require("node-jsx").install({
    extension: ".jsx",
    harmony: true
});

// L'import du logger doit être fait le plus tôt possible
import utils = require("hornet-js-utils");
import Server = require("hornet-js-core/src/server");
import ServerConfiguration = require("hornet-js-core/src/server-conf");

import Routes = require("src/routes/routes");
import React = require("react");
import fs = require("fs");

import AppI18nLoader = require("src/i18n/app-i18n-loader");
var Menu = require("src/resources/navigation");

var HornetApp = require("src/views/hornet-app");
var HornetAppReact = React.createFactory(HornetApp);

var HornetLayout = require("src/views/layouts/hornet-layout");
var HornetLayoutReact = React.createFactory(HornetLayout);
var HornetErrorComponent = require("src/views/gen/gen-err-page");

// Enregistrement des stores
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
    sessionStore: null, // new RedisStore({host: "localhost",port: 6379,db: 2,pass: "RedisPASS"}),
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

var key = utils.config.getOrDefault("server.https.key", false);
var cert = utils.config.getOrDefault("server.https.cert", false);
if (key && cert) {
    configServer.httpsOptions = {
        key: fs.readFileSync(key, "utf8"),
        cert: fs.readFileSync(cert, "utf8"),
        passphrase: utils.config.get("server.https.passphrase")
    };
}

import HornetMiddlewares = require("hornet-js-core/src/middleware/middlewares");
import AuthenticationMiddleware = require("src/middleware/authentication");
import ThemeSwitcherMiddleware = require("src/middleware/theme-switcher");

// Cas avec "hornet-js-cas"
import Roles = require("src/utils/roles");
import { PassportCas } from "hornet-js-cas/src/passport-cas";
import { CasConfiguration } from "hornet-js-cas/src/cas-configuration";

var hornetMiddlewareList = new HornetMiddlewares.HornetMiddlewareList()
    .addMiddlewareBefore(ThemeSwitcherMiddleware, HornetMiddlewares.MulterMiddleware);

// Ajout du middleware d'authentification (passport)

// En mode CAS enabled, utiliser le middleware pour le CAS (module "authentication-cas-js")
if (utils.config.getOrDefault("authentication.cas.enabled", false)) {
    // Injection de la config authentication-cas à partir de la configuration applicative & fonction "verifyFunction" redéfinie à la volée
    let configuration = new CasConfiguration(
        utils.config.get("authentication.loginUrl"),
        utils.config.get("authentication.logoutUrl"),
        utils.config.get("authentication.cas.configuration.hostUrlReturnTo"),
        utils.config.get("authentication.cas.configuration.urls.casValidate"),
        utils.config.get("authentication.cas.configuration.urls.casLogin"),
        utils.config.get("authentication.cas.configuration.urls.casLogout"),
        (login, done) => {
            // mock d'un user avec role ADMIN
            return done(null, {name: login, roles: [{name: Roles.ADMIN_STR}]});
        }
    );
    hornetMiddlewareList.addMiddlewareAfter(new PassportCas(configuration).getMiddleware(), HornetMiddlewares.SessionMiddleware);

} else {
    hornetMiddlewareList.addMiddlewareAfter(AuthenticationMiddleware, HornetMiddlewares.SessionMiddleware);
}

var server = new Server(configServer, hornetMiddlewareList);
server.start();
