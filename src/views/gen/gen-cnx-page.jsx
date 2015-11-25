"use strict";

var React = require("react");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("applitutoriel.views.gen.gen-cnx-page");
var _ = utils._;
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var ConnexionPage = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        errorMessage: React.PropTypes.array,
        previousUrl: React.PropTypes.string
    },

    _renderErrorDiv: function () {
        if (_.isArray(this.props.errorMessage) && this.props.errorMessage.length >= 1) {
            return (
                <div className="errors" id="status">
                    <img src={this.genUrlStatic("/img/error.gif")} alt="Erreur : "/>
                    <span>{this.props.errorMessage}</span>
                </div>
            );
        } else {
            return null;
        }
    },

    render: function () {
        logger.info("VIEW ConnexionPage render");

        return (
            <html xmlns='http://www.w3.org/1999/xhtml' lang='fr'>
            <head>
                <title>Magasin de L'Étang-Salé : Authentification centrale</title>
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8"/>
                <link rel="icon" type="image/png" href={this.genUrlStatic("/img/logoHornet.png")}/>
                <link rel='stylesheet' type='text/css' href={this.genUrlStatic("/css/auth.css")}/>
            </head>
            <body id='auth'>
            <div id="site">
                <div id="header">
                    <h1 id="app-name">Magasin de L'Étang-Salé : Authentification centrale.</h1>
                </div>
                <div id="content">
                    <form id="fm1" className="fm-v" method="post">
                        {this._renderErrorDiv()}
                        <div id="login" className="box">
                            <h2>Entrez votre identifiant et votre mot de passe.</h2>

                            <div className="row">
                                <label htmlFor="username"><span className="accesskey">I</span>dentifiant:</label>
                                <input type="text" size="25" accessKey="i" tabIndex="1" className="required"
                                       ref="username" name="username" id="username"/>
                            </div>
                            <div className="row">
                                <label htmlFor="password"><span className="accesskey">M</span>ot de passe:</label>
                                <input type="password" size="25" accessKey="m" tabIndex="2"
                                       className="required" ref="password" name="password" id="password"/>
                            </div>
                            <input type="hidden" name="previousUrl" value={this.props.previousUrl}/>

                            <div className="row btn-row">
                                <input type="submit" tabIndex="4" value="SE CONNECTER" accessKey="l" name="submit"
                                       className="btn-submit"></input>
                            </div>
                        </div>
                        <div id="sidebar">
                            <p>Pour des raisons de sécurité, veuillez vous déconnecter et fermer votre navigateur
                                lorsque vous avez fini d'accéder aux pages authentifiés.</p>
                        </div>
                    </form>
                </div>
                <div id="footer">
                    <div>
                        <p>&nbsp;</p>
                    </div>
                </div>
            </div>
            </body>
            </html>
        );
    }
});

module.exports = ConnexionPage;
