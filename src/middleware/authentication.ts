"use strict";

import utils = require("hornet-js-utils");
import React = require("react");
import passport = require("passport");
import passportLocal = require("passport-local");
var sha1 = require("sha1");
var flash = require("connect-flash");
var LocalStrategy = passportLocal.Strategy;

var ConnexionPage = require("src/views/gen/gen-cnx-page");

import AuthentificationApi = require("src/services/gen/gen-cnx-api");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");

var _ = utils._;

import RouterAbstract = require("hornet-js-core/src/routes/router-abstract");
import ServerConfiguration = require("hornet-js-core/src/server-conf");
import HornetMiddlewares = require("hornet-js-core/src/middleware/middlewares");

class AuthenticationMiddleware extends HornetMiddlewares.AbstractHornetMiddleware {

    private static logger = utils.getLogger("applitutoriel.middleware.authentication");

    constructor(appConfig:ServerConfiguration) {
        AuthenticationMiddleware.logger.info("MIDDLEWARE CONFIGURATION : Init AuthenticationMiddleware...");
        super(appConfig);
    }

    public insertMiddleware(app) {
        // init passport
        /**
         * Insertion de la stratégie login/mot de passe (= stratégie 'locale', voir doc passport)
         */
        passport.use(new LocalStrategy(
            function (username, password, done) {
                AuthenticationMiddleware.logger.info("Tentative d'authentification de l'utilisateur ", username);

                var encodedPassword = sha1(password);
                new AuthentificationApi().auth({
                    login: username,
                    password: encodedPassword
                }).then((retourApi:ActionsChainData) => {
                    AuthenticationMiddleware.logger.debug("Retour API utilisateur : ", retourApi.result);
                    done(null, retourApi.result);
                }, (error:any) => {
                    AuthenticationMiddleware.logger.warn("Retour en erreur:", error);

                    if (error.we_cause && error.we_cause.status === 401) {
                        done(null, false, {message: "Votre identifiant ou votre mot de passe est incorrect"});
                    } else {
                        done(null, false, {message: "Erreur technique du serveur"});
                    }
                });

            }
        ));
        passport.serializeUser(function (user, done) {
            // Pour l'applituto on sérialise tout l'objet plutot que juste son ID
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        // init middleware
        var loginUrl = utils.appSharedProps.get("loginUrl");
        var logoutUrl = utils.appSharedProps.get("logoutUrl");
        var welcomePageUrl = utils.appSharedProps.get("welcomePageUrl");

        function ensureAuthenticated(req, res, next) {
            if (req.isAuthenticated() || _.startsWith(req.originalUrl, loginUrl)) {
                return next();
            }
            req.getSession().setAttribute("previousUrl", utils.buildContextPath(req.originalUrl));
            res.redirect(utils.buildContextPath(loginUrl));
        }

        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

        var dispatcherLoaderFn = RouterAbstract.prepareInternationalizationContextFunction(this.appConfig);
        app.post(loginUrl,
            passport.authenticate("local", {failureRedirect: utils.buildContextPath(loginUrl), failureFlash: true}),
            function (req, res, next) {
                AuthenticationMiddleware.logger.info("Authentification ok, redirection vers la page d'accueil");
                var previousUrl = req.body.previousUrl || req.getSession().getAttribute("previousUrl") || utils.buildContextPath(welcomePageUrl);
                res.redirect(previousUrl);
            }
        );
        app.all(loginUrl, function (req, res) {
            var errors = req.flash("error");
            if (errors.length > 0 && errors[0] === "Missing credentials") {
                errors = ["Votre identifiant ou votre mot de passe est incorrect"];
            }

            var props = {"errorMessage": errors};

            // Cas d'un perte de connexion liée à un timeout
            if (req.query.previousUrl) {
                props["previousUrl"] = req.query.previousUrl;
            }

            // cas d'une perte de connexion liée à un timeout + F5
            if (req.getSession().getAttribute("previousUrl") && !props["previousUrl"]) {
                props["previousUrl"] = req.getSession().getAttribute("previousUrl");
                req.getSession().removeAttribute("previousUrl");
            }

            var locales:Array<string> = req.acceptsLanguages();
            var fluxibleContext:FluxibleContext = dispatcherLoaderFn(locales);

            props["context"] = fluxibleContext;

            var authentificationPageReact = React.createFactory(ConnexionPage);

            var htmlApp = React.renderToStaticMarkup(authentificationPageReact(props));
            var docTypeHtml:string = "<!DOCTYPE html>";
            res.setHeader("x-is-login-page", true);
            res.send(docTypeHtml + htmlApp);
        });
        app.get(logoutUrl, function (req, res, next) {
            // notifie passport
            req.logout();
            // notifie le session-maanger et redirige une fois la session détruite
            req.getSession().invalidate(() => {
                res.redirect(utils.buildContextPath(welcomePageUrl));
            });
        });

        app.use(ensureAuthenticated);
    }
}

export = AuthenticationMiddleware;
