"use strict";

var utils = require("hornet-js-utils");
var logger = utils.getLogger("applitutoriel.views.gen.gen-acb-page");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");




var AccessibilitePage = React.createClass({
    mixins: [HornetComponentMixin],
    render: function () {
        return (
            <div>
                <h2>Politique d'accessibilité</h2>

                <div className="pure-g-r">
                    <div className="pure-u-3-4">

                        <p className="texte">Cette application Web a été développée en respectant les critères du
                            <abbr title="Référentiel Général d'Accessibilité pour les Administrations"> RGAA </abbr>
                            (
                            <a href={this.genUrl("/declarationConformite")}>Attestation de conformité au RGAA</a>
                            ) et ainsi se conformer à la Loi numéro 2005-102 du 11 février 2005 pour l'égalité des droits et des chances, la participation et la citoyenneté des personnes handicapées ainsi qu'au Décret numéro 2009-546 du 14 mai 2009 pris en application de l'article 47 de la loi numéro 2005-102 du 11 février 2005.</p>

                        <a name="definition" id="definition" href="#"></a>
                        <div>
                            <h3>Qu'est-ce-que l'accessibilité numérique ? </h3>
                            <div>
                                <p className="texte">Selon
                                    <span lang="en">Tim Bernes-Lee </span>
                                    (directeur du
                                    <abbr lang="en" title="World Wide Web Consortium"> W3C </abbr>
                                    et inventeur du
                                    <span lang="en"> World Wide Web </span>
                                    ), l'accessibilité consiste à :</p>

                                <blockquote>Mettre le web et ses services à la disposition de tous les individus, quels que soient leur matériel ou logiciel, leur infrastructure réseau, leur langue maternelle, leur culture, leur localisation géographique ou leurs aptitudes physiques ou mentales.</blockquote>
                                <p className="texte">Un site est accessible lorsqu'il est possible pour n'importe
                                    quelle personne d'y accéder de façon équivalente, quel que soit le
                                    navigateur utilisé, le périphérique d'affichage, l'aide technique
                                    utilisée, le handicap éventuel de l'internaute, ainsi que son niveau
                                    intellectuel et ses capacités à appréhender l'informatique.</p>
                            </div>
                        </div>

                        <a name="aide" id="aide" href="#"></a>
                        <div>
                            <h3>Dispositifs facilitant l'accessibilité</h3>
                            <div>
                                <h4>Aide</h4>
                                <p className="texte">Cette page vise à vous guider dans l'utilisation du site. Pour connaître le niveau d'accessibilité de ce site, <a href={this.genUrl("/declarationConformite")}>consultez la déclaration de conformité au RGAA 3.0</a>.</p>


                                <h4>Respect des standards </h4>
                                <p className="texte">Des efforts ont été réalisés pour que le code
                                    <abbr lang="en" title="HyperText Markup Language"> HTML </abbr>
                                    soit conforme à la spécification
                                    <abbr lang="en" title="HyperText Markup Language"> HTML </abbr>
                                    5.0.
                                    Si malgré nos efforts, des erreurs étaient détectées suite à des validations, nous vous remercions de nous les signaler.</p>

                                <h4>Structure et présentation </h4>
                                <p className="texte">La mise en forme de l'application Web est séparée de son contenu grâce à l'utilisation des feuilles de style. L'utilisation des propriétés de positionnement
                                    <abbr lang="en" title="Cascading Style Sheets"> CSS </abbr>
                                    , en séparant totalement présentation et contenu, permet aux documents de conserver hors
                                    <abbr lang="en" title="Cascading Style Sheets"> CSS </abbr>
                                    un ordre cohérent : titre, menus, contenu...</p>

                                <h4>Aides à la navigation</h4>

                                <p className="texte">La navigation est compatible avec les équipements particuliers
                                    des personnes en situation de handicap, notamment les logiciels de
                                    synthèse vocale, de plage braille et de grossissement de caractère.</p>
                                <p className="texte">Cette application Web propose de nombreuses fonctionnalités permettant de
                                    naviguer facilement :</p>
                                <ul>
                                    <li>ergonomie et navigation optimisées,</li>
                                    <li>ajouter fil d'ariane, plan du site.</li>
                                </ul>

                                <h5>Liens d'accès rapide</h5>

                                <p className="texte">Des liens d'accès direct permettent d'accéder rapidement à une partie recherchée sans avoir à parcourir des informations non souhaitées.</p>
                                <p className="texte">Au début du contenu de chaque page, on trouve :</p>
                                <ul>
                                    <li>lien vers le menu de l'application Web</li>
                                    <li>lien vers le contenu de l'application Web</li>
                                    <li>lien vers le plan de l'application Web</li>
                                    <li>lien vers la page donnant la politique d'accessibilité (cette page)</li>
                                </ul>

                                <h5>Fil d’ariane</h5>

                                <p className="texte">Sur l’ensemble des pages du site (hormis la page d’accueil), un fil d’Ariane, affiché en haut du contenu principal, rappelle le nom de la page dans laquelle vous vous trouvez et vous permet de revenir au niveau de navigation supérieur.</p>


                                <h5>Navigation par tabulation (exceptée pour le menu de navigation et les composants
                                    <a href="#arbo"> "Arborescence"</a>
                                    )</h5>
                                <p className="texte">On peut naviguer d'un lien à l'autre à l'aide de la touche de tabulation (Appuyez sur
                                    <kbd> Tab </kbd>
                                    et répétez jusqu'à sélectionner le lien désiré, validez par
                                    <kbd> Entrée </kbd>
                                    ).</p>
                                <p className="texte">Si vous "dépassez" le lien désiré, vous pouvez revenir en arrière en maintenant appuyé simultanément la touche permettant de faire des majuscules (<kbd>shift</kbd>) et la touche <kbd>Tab</kbd>.</p>

                                <h5>Navigation par titres</h5>
                                <p className="texte">La plupart des technologies d’assistance et des navigateurs facilitent la navigation par les titres. La plupart des lecteurs d’écran fournissent une fonctionnalité pour sauter au titre suivant, par exemple :</p>
                                <ul>
                                    <li>la touche "H" mène au titre suivant</li>
                                    <li>la touche "1" mène au prochain titre de niveau 1</li>
                                    <li>la touche "2" mène au prochain titre de niveau 2</li>
                                </ul>


                                <h5>Le menu de navigation principal</h5>
                                <p className="texte">Le menu de navigation principal (4 rubriques) s’adapte aux différents types de terminaux pour proposer une navigation confortable à tous.</p>
                                <p className="texte">Pour les ordinateurs de bureaux, lors d’une navigation avec la souris :</p>
                                <ul>
                                    <li>lors du survol d’une entrée principale, le sous-menu apparaît.</li>
                                    <li>lors du clic, la page demandée s’affiche.</li>
                                </ul>

                                <p className="texte">Pour les ordinateurs de bureaux, lors d’une navigation au clavier :</p>
                                <ul>
                                    <li>les touches "droite/gauche" permettent de naviguer entre les principales entrées du menu.</li>
                                    <li>la touche "flèche vers le bas" permet de faire apparaître le sous-menu</li>
                                    <li>la touche "entrée" permet d’accéder à la page souhaitée.</li>
                                </ul>


                                <a name="onglet" id="onglet" href="#"></a>
                                <h5>Onglets</h5>
                                <p className="texte">Les onglets sont utilisables au clavier selon les modalités suivantes :</p>
                                <ul>
                                    <li>Se déplacer sur les entête des onglets par la touche<kbd>tab</kbd>.</li>
                                    <li>Se déplacer entre les onglets en validant par entrée lorsque l'en-tête de l'onglet est sélectionné</li>
                                    <li>Se déplacer dans un onglets à l'aide de la touche <kbd>tab</kbd>. </li>
                                </ul>

                                <h5>Logo</h5>
                                <p className="texte">Le logo vous permet, par un simple clic, de retourner sur la page d’accueil.</p>

                                <h5>Images</h5>
                                <p className="texte">Un équivalent textuel est fourni via l’attribut alt des images significatives, lorsqu’elles ne sont pas décrites précisément dans le texte qu’elles illustrent. L’attribut alt des images non-significatives est vide. La mise en page n’utilise pas d’images invisibles ; les images ne sont utilisées que lorsqu’il n’existe aucun élément XHTML permettant de transmettre l’information concernée.</p>

                                <h5>Teléchargement de fichiers</h5>
                                <p className="texte">La majeure partie des documents est proposée en téléchargement. Pour lire les fichiers au format pdf, vous devez au préalable télécharger le logiciel gratuit Acrobat Reader sur le site d’Adobe.</p>



                                <h4>Ajustement de la taille du texte/de la page</h4>
                                <p className="texte">Afin de permettre aux utilisateurs de modifier la présentation de l'application Web, et spécialement la taille des caractères affichés, la mise en page repose sur l'emploi d'unités relatives. Ainsi, la taille du texte/de la page peut être agrandie :</p>
                                <p className="texte">
                                    Avec la majorité des navigateurs :
                                    <kbd> Ctrl </kbd>
                                    +
                                    <kbd> molette de la souris </kbd>
                                    <br />
                                    ou
                                    <br />
                                    <kbd> Ctrl+ </kbd>
                                    pour augmenter la taille de la police et
                                    <kbd> Ctrl- </kbd>
                                    pour la diminuer.</p>

                                <h4>Charte graphique</h4>
                                <p className="texte">La charte graphique a été définie et réalisée en prenant en
                                    compte les paramètres de l'accessibilité. Les problèmes de contrastes et
                                    de superpositions de couleurs ont été pensés pour que les malvoyants
                                    n'aient pas de difficultés de lecture.</p>

                                <h4>Ajouter cette application Web à vos "favoris"</h4>
                                <p className="texte">Dans certains navigateurs en cliquant sur une "étoile" à gauche de l'URL.</p>
                                <p className="texte">Dans la barre de menu en haut du navigateur :</p>
                                <ul>
                                    <li>Sous
                                        <span lang="en"> Internet explorer </span>
                                        :
                                        <em> Favoris ou menu contextuel</em>
                                    &gt;
                                        <em> Ajouter aux favoris </em>
                                    </li>
                                    <li>Sous
                                        <span lang="en"> Mozilla Firefox </span>
                                        :
                                        <em> Marque-pages </em>
                                    &gt;
                                        <em> Marquer cette page </em>
                                    </li>

                                    <li>Sous Safari
                                        <em> : Signets </em>
                                    &gt;
                                        <em> Ajouter aux signets </em>
                                    </li>
                                    <li>Sous Opéra
                                        <em> : Signets </em>
                                    &gt;
                                        <em> Signet vers la page </em>
                                    </li>
                                    <li>Sous Chrome
                                        <em> : Favoris </em>
                                    &gt;
                                        <em> Ajouter cette page aux favoris </em>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                    </div>
                </div>
            );
        }
    })
module.exports = AccessibilitePage;
