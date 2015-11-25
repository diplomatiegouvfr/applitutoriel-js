///<reference path="../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>

import utils = require("hornet-js-utils");
import ServerConfiguration = require("hornet-js-core/src/server-conf");
import HornetMiddlewares = require("hornet-js-core/src/middleware/middlewares")
class ThemeSwitcherMiddleware extends HornetMiddlewares.AbstractHornetMiddleware {
    private static logger = utils.getLogger("applitutoriel.middleware.ThemeSwitcherMiddleware")
    constructor() {
        ThemeSwitcherMiddleware.logger.info("MIDDLEWARE CONFIGURATION : Init ThemeSwitcherMiddleware...");
        super(null, null, (req, res, next) => {
            if (req.query.themeName) {
                ThemeSwitcherMiddleware.logger.trace("Insertion du theme présent dans la query:", req.query.themeName);
                req.getSession().setAttribute("themeName", req.query.themeName);
            }
            next();
        });
    }
}

export = ThemeSwitcherMiddleware;