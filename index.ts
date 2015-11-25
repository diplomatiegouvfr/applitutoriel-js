///<reference path='./node_modules/app/hornet-js-ts-typings/definition.d.ts'/>
"use strict";

// Bootstrap de lancement de l'application
// permet la résolution de modules dans des répertoires autres que "node_modules"
var Module = require('module').Module;
var fs = require('fs');
var path = require('path');

var appDirectory = process.cwd();
var moduleDirectoriesContainer = [];
var moduleDirectories = [];
var old_nodeModulePaths = Module._nodeModulePaths;

var NODE_MODULES_APP = path.join('node_modules', 'app');


// on surcharge la méthode de résolution interne nodejs pour gérer d'autres répertoires
Module._nodeModulePaths = function(from) {
    var paths = [];//old_nodeModulePaths.call(this, from);
    var matched = matchModuleDirectory(from);

    moduleDirectoriesContainer.forEach((path) => { paths.push(path); });
    paths.push(path.join(appDirectory, NODE_MODULES_APP));
    paths.push(path.join(matched || appDirectory));

    return paths;
};

function matchModuleDirectory(from) {
    var match = null, len = 0;
    for (var i=0;i<moduleDirectories.length;i++) {
        var mod = moduleDirectories[i];
        if (from.indexOf(mod) === 0 && mod.length > len) {
            match = mod;
            len = mod.length;
        }
    }
    return match;
}

function addModuleDirectory(path2add) {
    path2add = path.normalize(path2add);
    if (moduleDirectories.indexOf(path2add) === -1) {
        moduleDirectories.push(path2add);
    }
}

function addModuleDirectoryContainer(path2add) {
    path2add = path.normalize(path2add);
    if (moduleDirectoriesContainer.indexOf(path2add) === -1) {
        moduleDirectoriesContainer.push(path2add);
    }
}

function isNodeModule(directory) {
    // si un fichier 'package.json' existe, c'est un module nodejs
    var isModule = false;
    try {
        var stat = fs.statSync(path.normalize(path.join(directory, 'package.json')));
        isModule = true;
    } catch (e) {
        isModule = false;
    }
    return isModule;
}

// Lecture et ajout dans le resolver des répertoires externes déclarés par le package courant
try {
    var builder = require('./builder.js');
    if (builder.externalModules && builder.externalModules.enabled && builder.externalModules.directories && builder.externalModules.directories.length > 0) {

        builder.externalModules.directories.forEach(function(directory) {
            try {
                var stat = fs.statSync(directory);
                if (stat.isDirectory()) {

                    if (isNodeModule(directory)) {
                        addModuleDirectory(directory);
                        addModuleDirectoryContainer(path.normalize(path.join(directory, "..")));
                        console.log("MODULE RESOLVER > le répertoire '" + directory + "' est déclaré comme module nodejs");
                        console.log("MODULE RESOLVER > le répertoire '" + (path.normalize(path.join(directory, ".."))) + "' est déclaré comme container de module nodejs");

                    }
                    //} else {
                        // on vérifie si des répertoires du 1er niveau sont des modules nodejs pour les ajouter eux aussi
                        var files = fs.readdirSync(directory);
                        var moduleFound = false;
                        files.forEach(function (file) {
                            var modPath = path.normalize(path.join(directory, file));
                            if (fs.statSync(modPath).isDirectory(modPath)) {
                                if (file.indexOf(".") == 0) return;

                                if (isNodeModule(modPath)) {
                                    addModuleDirectory(modPath);
                                    moduleFound = true;
                                    console.log("MODULE RESOLVER > le répertoire '" + modPath + "' est déclaré comme module nodejs");
                                } else {
                                    console.log("MODULE RESOLVER > le répertoire '" + modPath + "' est ignoré car ce n'est pas un module nodejs")
                                }
                            }
                        });
                        if (moduleFound) {
                            console.log("MODULE RESOLVER > le répertoire '" + directory + "' est déclaré comme container de module nodejs");
                            addModuleDirectoryContainer(directory);
                        }
                    //}
                }
            } catch (e) {
                console.log("MODULE RESOLVER > erreur lors de la déclaration du répertoire externe '" + directory + "' :", e);
                process.exit(1);
            }
        });
    }
} catch(e) {
    // pas de fichier 'builder.js' >> mode production
    // on ignore en silence
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Gestion du cas particulier du main (car nodejs le considère différent des autres modules ...)  //
require.main.paths = [];
moduleDirectoriesContainer.forEach((path) => { require.main.paths.push(path); });
require.main.paths.push(path.join(process.cwd()));
require.main.paths.push(path.join(process.cwd(), NODE_MODULES_APP));
////////////////////////////////////////////////////////////////////////////////////////////////////

// initialisation des infos de l'application courante
import AppSharedProps = require("hornet-js-utils/src/app-shared-props");
var packageJson = require('./package');
AppSharedProps.set("appName", packageJson.name);
AppSharedProps.set("appVersion", packageJson.version);
AppSharedProps.set("appDescription", packageJson.description);
AppSharedProps.set("appAuthor", packageJson.author);

// lancement de l'application
require('src/server');