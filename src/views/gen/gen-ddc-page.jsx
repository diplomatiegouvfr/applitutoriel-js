"use strict";

var utils = require("hornet-js-utils");
var logger = utils.getLogger("applitutoriel.views.gen.gen-acb-ddc");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var DeclarationconformitePage = React.createClass({
    mixins: [HornetComponentMixin],
    render: function () {
        return (
            <div>
                <h2>Déclaration de conformité</h2>
                <div className="pure-g-r">
                    <div className="pure-u-3-4">

                        <p className="texte">Cette page n'est pas une page d'aide, mais une déclaration de conformité au RGAA 3.0 qui vise à définir le niveau d'accessibilité général constaté sur le site conformément à la règlementation.
                            Cette page est obligatoire pour être conforme au RGAA 3.0. Pour des aides relatives à la navigation et aux aménagements particuliers du site, <a href={this.genUrl("/politiqueAccessibilite")}>visitez la page accessibilité</a>.</p>

                        <p className="texte">La déclaration de conformité du site http://www.url-de-applicationweb a été établie le jj/mm/aaaa.</p>
                        <p className="texte">La version du RGAA utilisée pour réaliser les tests est la version 3.0.</p>
                        <div>
                            <p className="texte">Adresse de l'application Web : http://www.url-de-applicationweb</p>
                            <p className="texte">Date de réalisation : Janvier 2015</p>
                        </div>


                        <h3>Identité du déclarant</h3>
                        <p className="texte">Ministère des Affaires Etrangères et du Développement International<br/>
                            Direction des Systèmes d'Information<br/>
                            11 r Maison Blanche<br/>
                            44100 NANTES<br/>
                            Téléphone :+33 8 26 08 06 04<br/>
                            Télécopie :+33 2 51 77 36 99<br/>
                            Courriel : [à compléter]</p>


                        <h3>Technologies utilisées pour la réalisation du site</h3>
                        <ul>
                            <li>HTML5</li>
                            <li>CSS</li>
                            <li>JavaScript</li>
                        </ul>


                        <h3>Agents utilisateurs et technologies d’assistance utilisés pour vérifier l’accessibilité des contenus</h3>
                        <p className="texte">Les vérifications de restitution de contenus ont été réalisées sur la base de la combinaison fournie par la base de référence du RGAA, avec les versions suivantes :</p>
                        <table>
                            <caption>Base de référence utilisée pour vérifier la compatibilité avec l'accessibilité</caption>
                            <thead>
                            <tr>
                                <th scope="col">Agent utilisateur</th>
                                <th scope="col">Technologie d'assistance</th>
                            </tr>
                            </thead>
                            <tbody><tr>
                                <td><span lang="en">Firefox</span> 38</td>
                                <td>NVDA 2015.1</td>
                            </tr>
                            <tr>
                                <td><span lang="en">Internet Explorer</span> 11</td>
                                <td><span lang="en">JAWS</span> 15</td>
                            </tr>
                            <tr>
                                <td><span lang="en">Firefox</span> 38</td>
                                <td><span lang="en">VoiceOver</span></td>
                            </tr>
                            </tbody></table>


                        <h3>Les règles pour l’accessibilité des contenus web</h3>
                        <div>
                            <p className="texte">Les règles pour l'accessibilité des contenus web, qui sont proposées à travers ce référentiel, reposent sur les WCAG 2.0
                                (Web Content Accessibility Guidelines 2.0), rédigées par la WAI.
                                Les WCAG 2.0 adoptent une approche thématique proposant 12 règles structurantes selon 4 principes fondamentaux :
                            </p>

                            <h4>Principe 1 : Perceptible</h4>
                            <ul>
                                <li>Proposer des équivalents textuels à tout contenu non textuel qui pourra alors être présenté sous d'autres formes selon les besoins de l'utilisateur : grands caractères, braille, synthèse vocale, symboles ou langage simplifié</li>
                                <li>Proposer des versions de remplacement aux média temporels </li>
                                <li>Créer un contenu qui puisse être présenté de différentes manières sans perte d'information ni de structure (par exemple avec une mise en page simplifiée)</li>
                                <li>Faciliter la perception visuelle et auditive du contenu par l'utilisateur, notamment en séparant le premier plan de l'arrière-plan </li>
                            </ul>

                            <h4>Principe 2 : Utilisable</h4>
                            <ul>
                                <li>Rendre toutes les fonctionnalités accessibles au clavier</li>
                                <li>Laisser à l'utilisateur suffisamment de temps pour lire et utiliser le contenu </li>
                                <li>Ne pas concevoir de contenu susceptible de provoquer des crises</li>
                                <li>Fournir à l'utilisateur des éléments d'orientation pour naviguer, trouver le contenu et se situer dans le site</li>
                            </ul>

                            <h4>Principe 3 : Compréhensible</h4>
                            <ul>
                                <li>Rendre le contenu textuel lisible et compréhensible</li>
                                <li>Faire en sorte que les pages apparaissent et fonctionnent de manière prévisible</li>
                                <li>Aider l'utilisateur à éviter et à corriger les erreurs de saisie. </li>
                            </ul>

                            <h4>Principe 4 : Robuste</h4>
                            <ul>
                                <li>Optimiser la compatibilité avec les agents utilisateurs actuels et futurs, y compris les technologies d'assistance</li>
                            </ul>

                            <h3>Critères de validation</h3>
                            <p className="texte">
                                Pour appliquer au mieux l’accessibilité sur le site, 13 critères de succès du <a href="https://references.modernisation.gouv.fr/sites/default/files/RGAA3_RC2-1/referentiel_technique.htm" target="_blank" title="Référentiel Général d'Accessibilté pour les Administrations | nouvelle fenêtre">Référentiel Général d'Accessibilté pour les Administrations</a> ont été appliqué. Les voici :
                            </p>
                            <ul>
                                <li>Images</li>
                                <li>Cadres</li>
                                <li>Couleurs</li>
                                <li>Multimédia</li>
                                <li>Tableaux</li>
                                <li>Liens</li>
                                <li>Scripts</li>
                                <li>Eléments obligatoires</li>
                                <li>Structuration de l'information</li>
                                <li>Présentation de l'information</li>
                                <li>Formulaires</li>
                                <li>Navigation</li>
                                <li>Consultation</li>
                            </ul>

                        </div>

                        <h3>Pages du site ayant fait l'objet de la vérification de conformité</h3>
                        <ul>
                            <li>Page d'accueil</li>
                            <li>Page contact</li>
                            <li>Page d'aide</li>
                            <li>Page édition d'un partenaire</li>
                            <li>Page liste des secteurs</li>
                        </ul>

                        <h3>Résultats des tests</h3>
                        <p className="texte">Un audit du site, réalisé en interne, révèle une conformité aux critères du RGAA de niveau simple A et double A (AA), à l'exception des points suivants :</p>

                        <ul>
                            <li>Dans les tableaux, l'information de trie est mal implémentée (information donnée uniquement par la forme ou la couleur)</li>
                            <li>Il n'y a pas d'alternative à l'utilisation de script</li>
                            <li>Il reste quelques erreurs de sémantique HTML</li>
                            <li>Dans les formulaires, les suggestions facilitant la correction des erreurs pourraient être plus précis</li>
                            <li>La navigation dans le calendrier n'est pas totalement possible au clavier</li>
                        </ul>


                        <h3>Droit à la compensation</h3>

                        <p className="texte">Dans l'attente d'une mise en conformité totale, vous pouvez obtenir une version accessible des documents ou des informations qui y seraient contenues en envoyant un courriel à [à compléter]  en indiquant le nom du document concerné et/ou les informations que vous souhaiteriez obtenir. Les informations demandées vous seront transmises dans les plus bref délais.</p>

                        <h4>Amélioration et contact</h4>

                        <p className="texte">Vous pouvez nous aider à améliorer l'accessibilité du site en nous signalant les problèmes éventuels que vous rencontrez. Pour ce faire, envoyez-nous un courriel via la page <a href={this.genUrl("/contact")}>contact</a>.</p>


                        <h3>Défenseur des droits</h3>

                        <p className="texte">Si vous constatiez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site, que vous nous le signaliez et que vous ne parveniez pas à obtenir une réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou demande de saisine à :</p>

                        <p className="texte">Le défenseur des droits<br/>
                            7 rue Saint-Florentin 75409 Paris cedex 08<br/>
                            Téléphone : 09 69 39 00 00<br/></p>

                        <p className="texte">Contacter le défenseur des droits <a href="http://www.defenseurdesdroits.fr/contact" target="_blank" title="Contacter le défenseur des droits via le formulaire en ligne | nouvelle fenêtre">via le formulaire en ligne</a>.</p>
                    </div>
                    </div>
            </div>

        );
    }
})
module.exports = DeclarationconformitePage;
