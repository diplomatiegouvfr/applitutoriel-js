# applitutoriel-js

L'application TUTORIEL a pour objectif de présenter une application basée sur le framework Hornet.

A noter :
* Hornet facilite la mise en oeuvre du RGAA V3 dans une application.
* Mais l'utilisation de Hornet ne garantit pas qu'une application soit valide RGAA.

__Cas fonctionnels__

Les cas fonctionnels présentés dans l'application sont :

* Formulaire de recherche
* Présentation du résultat sous forme de tableau éditable
* Formulaire étendu
* Tableau d'ajout/suppression/modification d'items
* Affichage de graphique

__RGAA V3__

L'applitutoriel est une mise en pratique du RGAA V3 au travers du framework Hornet.

## Prérequis #

* NodeJS 4.X
* hornet-js-builder 1.X installé en global:

```shell
    $ npm install -g hornet-js-builder
```

* checkout du projet `applitutoriel-js`

## Initialisation #
Se positionner dans le répertoire du projet `applitutoriel-js` et lancer la commande:

```shell
    $ hb install
```

## Démarrage de l'application en mode développement #

### Commande par défaut

la commande à exécuter en mode développement est la suivante:

```shell
    $ hb w
```

Elle permet de lancer l'application en mode `watcher` afin que les modifications soient prises en compte (ce qui
entrainera un redémarrage du serveur node dans le cas d'une détection de modification).

### Options

Il est également possible d'ajouter à cette commande l'option:

```shell
    $ hb w -i
```

Cette commande indique au builder de ne pas transpiler les fichiers typescript en javascript.
Elle est à utiliser dans le cas où l'IDE a été configuré de telle sorte que la transpilation ts->js
se fasse via ce dernier.


## Vérification

L'application est accessible depuis un navigateur à l'addresse : `http://localhost:8888/applitutoriel/`
où __applitutoriel__ correspond au `contextPath` dans le fichier `config/default.json`.

## Mode Mock

Il est possible d'utiliser l'applitutoriel sans déployer la partie service.
Pour cela, activer le mode `mock` dans le `config/default.json`.

```json
  "mock": {
    "enabled": true,
    "host": "127.0.0.1", //default localhost
    "routes": "/mock/routes"
  }
```

## Packaging de l'application

```shell
$ hb package
```

Les livrables sont à récupérer dans le répertoire : `target`

- `applitutoriel-5.0.X-static.zip`
- `applitutoriel-5.0.X-dynamic.zip`

## Fichier de configuration de l'application : default.json

L'ensemble de la configuration applicative du serveur NodeJS se situe dans le fichier default.json contenu dans les sources de l'application

Ce fichier ne doit pas être modifié, excepté pour le log console. Les modifications sont à apporter dans les fichiers d'infrastructure.

### Configuration applicative

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|contextPath| Context de l'applicatin déployé|Par défaut vide|
|welcomePage|Page de démarrage de l'application|Passé en paramètre du ServerConfiguration|
|themeUrl|Url du thème applicative|[Protocol]://[host]:[port]/hornet/themName|

```json
{
  "contextPath": "applitutoriel",
  "welcomePage": "/accueil",
  "themeHost": "http://localhost:7777",
  "themeUrl": "${themeHost}/5.0.X/default"
  ...
}
```

### Configuration serveur

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|route|Route identifié pour l'affinité de session nodejs|js1|
|port|Port de démarrage du serveur|8888|
|keepAlive|Activation du mode HTTP KeepAlive|true|
|maxConnections|Nombre maximal de connexion à l'instance nodejs|100|
|timeout|Timeout des réponses HTTP|300000|
|uploadFileSize|Taille maximal d'upload de fichier|1000000|
|sessionTimeout|Timeout des sessions utilisateur|1800000|

```json
  "server": {
    "route": "js1",
    "port": 8888,
    "keepAlive": true,
    "maxConnections": 100,
    "timeout": 300000,
    "uploadFileSize": 1000000,
    "sessionTimeout": 1800000
  }
```

### Configuration Cookie

Cette partie contient l'ensemble du paramétrage spécifique aux exécutions réalisées coté serveur, ainsi que ses spécificités de démarrage.

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|domain|Domain du cookie|null|
|path|Path du cookie|null|
|httpOnly|Activation du mode HTTP KeepAlive|true|
|secure|securisation du cookie|true|
|alwaysSetCookie|Ajout du cookie dans le Header|false|

```json
  "cookie": {
    //"domain": null,
    //"path": null,
    "httpOnly": true,
    "secure": false
    //"alwaysSetCookie": false
  }
```


### Configuration de la sécurité

Ce bloc contient l'ensemble des paramètres destinés à la configuration de helmet.

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|enabled|Activation de la sécurité| true |
|hpp|HTTP Parameter Pollution attacks| true |
|ienoopen|Middleware for IE security. Set `X-Download-Options` to noopen| true |
|noSniff| keep clients from sniffing the MIME type| true |
|csp.enabled|Activation de CSP (Content Security Policy)| true |
|csp.defaultSrc|noms de domaine par défaut des différentes ressources du site| ["'self'", {hostname}] |
|csp.scriptSrc|noms de domaine des différentes ressources de scripts du site| ["'self'", "'unsafe-inline'", "'unsafe-eval'"]|
|csp.styleSrc|noms de domaine des différentes ressources de css du site | ["'self'", {hostname}]|
|csp.fontSrc|noms de domaine des différentes ressources de fonts du site| ["'self'", {hostname}]|
|csp.imgSrc|noms de domaine des différentes ressources d'images scripts du site | ["'self'", {hostname}]|
|csp.reportOnly|si valorisé à true, génération d'un rapport d'erreur uniquement|false|
|csp.setAllHeaders|valorisé à true si tous les headers doivent être settés|false|
|csp.disableAndroid|permet de désactiver la navigation via Android|false|
|csp.safari5|permet de désactiver la navigation via safari5|false|
|xss.enabled|Activation de la protection contre les failles XSS|true|
|xss.setOnOldIE|Force le header X-XSS-Protection sur les anciens IE|true|
|hpkp.enabled|Activation du Public Key Pinning: HPKP, HTTPS certificates can be forged, allowing man-in-the middle attacks|true|
|hpkp.maxAge|Durée de validation|7776000000|
|hpkp.sha256s|Liste des sha au format 256|["AbCdEf123=","ZyXwVu456="]|
|hpkp.includeSubdomains|Inclusion des sous domaines|true|
|hpkp.reportUri|url de rapport|vide|
|hsts.enabled|Activation du HTTP Strict Transport Security: hsts|false|
|hsts.maxAge|Durée de validation|7776000000|
|hsts.includeSubdomains|Inclusion des sous domaines|true|
|hsts.preload|Activation du preload dans le header HSTS|false|
|csrf.enabled|Activation du mode CSRF : Cross-Site Request Forgery|true|
|csrf.maxTokensPerSession|Nombre de token par session|10|


```json
"security": {
    "enabled": true,
    "hpp": true,
    "ienoopen": true,
    "noSniff": true,
    "csp": {
      "enabled": true,
      "defaultSrc": [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "[Protocol]://[host]:[port]"
      ],
      "scriptSrc": [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'"
      ],
      "styleSrc":[
        "'self'",
        "[Protocol]://[host]:[port]",
        "'unsafe-inline'"
      ],
      "fontSrc":[
        "'self'",
        "[Protocol]://[host]:[port]"
      ],
      "imgSrc":[
        "'self'",
        "[Protocol]://[host]:[port]"
      ],
      "reportOnly": false,
      "setAllHeaders": false,
      "disableAndroid": false,
      "safari5": false
    },
    "frameguard": {
      "enabled": true,
      "mode": "deny",
      "allowFromPattern": ""
    },
    "xss": {
      "enabled": true,
      "setOnOldIE": true
    },
    "hpkp": {
      "enabled": true,
      "maxAge": 7776000000,
      "sha256s": [
        "AbCdEf123=",
        "ZyXwVu456="
      ],
      "includeSubdomains": true,
      "reportUri": null
    },
    "hsts": {
      "enabled": false,
      "maxAge": 10886400000,
      "includeSubdomains": true,
      "preload": false
    },
    "csrf": {
      "enabled": true,
      "maxTokensPerSession": 10
    }
  }
```

### Configuration des logs serveurs

Niveau de log :

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|level.[all]|niveau de log pour toute l'application|INFO|
|level.monappli.view|niveau de log spécifique pour une partie de l'application |optionnel|

```json
 "log": {
    "levels": {
      "[all]": "DEBUG",
      "hornet-js-components.table": "TRACE"
    }
    ...
```

Déclaration des appenders :

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|type|Type d'appender|*file* pour un fichier simple<br/>*dateFile* pour un fichier contenant la date<br/>*console* ...|
|filename| Chemin absolu ou relatif au lancement du fichier de log | /var/log/nodejs/applitutoriel/applitutoriel-1.log|
|pattern| Présent pour les types *dateFile* <br />Permet de donner un pattern de date qui sera ajouté au nom du fichier.|-yyyy-MM-dd|
|layout.type| Type d'affichage des messages|pattern|
|layout.pattern| Schéma d'affichage des messages |"%[%d{ISO8601}|%x{tid}|%x{user}|%p|%c|%x{fn}|%m%]"|


Ex: type console

```json
"appenders": [
	{
	    "type": "console",
	    "layout": {
	      "type": "pattern",
	      "pattern": "%[%d{ISO8601}|%x{tid}|%x{user}|%p|%c|%x{fn}|%m%]"
	    }
	}
]
```

ex : type fichier

```json
"appenders": [
	{
	    "type": "dateFile",
	    "filename": "log/app.log",
	    "layout": {
	      "type": "pattern",
	      "pattern": "%d{ISO8601}|%x{tid}|%x{user}|%p|%c|%x{fn}|%m"
	    }
	}
]
```

### Configuration des logs client

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|remote|Activatino des remotes log|false|
|level|niveau de log|INFO|

```json
  "logClient": {
    "remote": false,
    "level": "TRACE",
    ...
```

### Déclaration des appenders

Type BrowserConsole :


| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|type|Type d'appender|BrowserConsole|
|layout.type| Type d'affichage des messages|THIN/BASIC/pattern/...|
|layout.pattern| Schéma d'affichage des messages |"%p|%c|%m%"|

```json
"appenders": [
{
	"type": "BrowserConsole",
	"layout": {
	  "type": "THIN"
	}
}
```

Type Ajax :

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|type|Type d'appender|Ajax|
|layout.type| Type d'affichage des messages|THIN/BASIC/pattern/...|
|layout.pattern| Schéma d'affichage des messages |"%p|%c|%m%"|
|threshold|Seuil d'envoi des messages de log|100|
|timeout|Timeout d'envoie des messages|3000|
|url|url d'envoie des logs|/logs|

```json
"appenders": [
	{
	    "type": "Ajax",
	    "layout": {
	      "type": "BASIC"
	    },
	    "threshold": 100,
	    "timeout": 3000,
	    "url": "/log"
	}
]
```

### Configuration des services

Configuration de l'adresse du service par défaut
+ possibilité de définir des adresses supplémentaires pour gérer le multi-services.

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|defaultServices.host| URL de déploiement du module applitutoriel-service| [Protocol]://[host]:[port] |
|defaultServices.name| Nom de déploiement des services|applitutoriel|
|secteursServices.host| URL de déploiement d'un service supplémentaire| [Protocol]://[host]:[port] |
|secteursServices.name| Nom de déploiement d'un service supplémentaire|applitutoriel|

```json
    "defaultServices": {
      "host": "http://localhost:8080/",
      "name": "applitutoriel-service"
    },
    "secteursServices": { // configuration multi-service : exemple de definition d'un service specifique pour les secteurs
      "host": "http://localhost:8080/",
      "name": "applitutoriel-service"
    },
```

### Mode mock

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|enabled|Activation du mode mock de l'application|false|
|routes|Chemin vers le fichier de routes mocké sans le /src |/mock/routes|
|defaultServices.host|Host local du mock|localhost|
|secteursServices.host| URL de déploiement d'un service mock supplémentaire| [Protocol]://[host]:[port] |
|secteursServices.name| Nom de déploiement d'un service mock supplémentaire|applitutoriel/hornet-mock|

```json
  "mock": {
      "enabled": false,
      "routes": "/mock/routes",
      "defaultServices": { // service mock par defaut : le contexte est toujours "applitutoriel/hornet-mock"
        "host": "http://localhost:${server.port}/" //default localhost:8888
      },
      "secteursServices": { // configuration multi-service : exemple de definition d'un mock specifique pour les secteurs
        "host": "http://localhost:${server.port}/",
        "name": "applitutoriel/hornet-mock"
      }
  }
```

### Mode fullSPA

NOTE : Le mode fullSPA n'est pas encore complètement supporté par hornet, la configuration est présente à titre d'information

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|enabled|Activation du mode fullSPA|false|
|host|Host du mode fullSPA|""|
|name|nom du service pour le mode fullSPA|/services|
|staticPath|prefixe des resources statiques pour le mode fullSPA|""|

```json
"fullSpa": {
    "enabled": false,
    "host": "",
    "name": "/services",
    "staticPath": ""
  }
```

__NOTE__ : non opérationnel

### Configuration de l'authentification

Note : Il ne s'agit pas d'une configuration à proprement parler de Hornet mais uniquement viable dans l'applitutoriel

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|loginUrl|Url de connexion à l'application|/login|
|logoutUrl|Url de déconnexion à l'application|/logout|
|cas.enabled|Activation du mode CAS|false|
|cas.configuration.urlCas|url complète du CAS||
|cas.configuration.hostUrlReturnTo|url de retour après authentification sur le CAS||
|cas.configuration.paths.login|url déclenchant le process de connexion|/login|
|cas.configuration.paths.logout|url déclenchant le process de déconnexion|/logout|
|cas.configuration.paths.validate|url du service de validation des tichets CAS||
|cas.configuration.paths.casLogin|url de connexion du CAS||
|cas.configuration.paths.casLogout|url de déconnexion du CAS||

```json
  "authentication": {
    "loginUrl": "/login",
    "logoutUrl": "/logout"
    "cas": {
      "enabled": true,
      "configuration": {
        "urlCas": "http://cas-url:80",
        "hostUrlReturnTo": "http://localhost:8888",
        "paths": {
          "login": "/login",
          "logout": "/logout",
          "validate": "http://cas-url/serviceValidate",
          "casLogin": "http://cas-url/login",
          "casLogout": "http://cas-url/logout"
        }
      }
    }
  }
```

### Configuration du Cache

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|enabled|Activation du cache sur les requêtes de services|true|
|timetolive|Durée de rétention du cache|60|

```json
"cache": {
    "enabled": true,
    "timetolive": 60
  }
```

## Licence

`applitutoriel-service` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)
