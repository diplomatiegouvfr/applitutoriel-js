module.exports = {
    type: "application",

    gulpTasks: function (gulp, project, conf, helper) {
        //Add task if needed
        gulp.beforeTask('compile', function () {
            helper.info('Exemple before compile task');
        });

        gulp.afterTask('compile', function () {
            helper.info('Exemple after compile task');
        });

        helper.excludeNodeModulesFromWebpack(
            ["config", "continuation-local-storage"],
            conf.webPackConfiguration
        );

        // Exemple d'exclusion de fichiers/répertoires local à l'application
        // Cet exemple est complètement inutile puisque le client.js n'est pas dépendant des middlewares
        // Il est là à titre d'exemple uniquement
        helper.excludeLocalFilesFromWebpack(
            ["src/middleware"],
            conf.webPackConfiguration
        );

        // Cas PARTICULIER de l'application tuto pour pouvoir la générer en mode SPA et ISOMORPHIC sur la PIC
        // => on force la tâche prepare-package:spa tout le temps
        // si mode fullSpa : on redéfini les tâches 'watch' & 'watch-prod' pour y inclure la tâche "prepare-package-spa"
        //gulp.task("watch", ["compile", "prepare-package:spa", "watch:client", "watch:lint"]);
        //gulp.task("watch-prod", ["compile", "prepare-package:spa", "watch:client-prod", "watch:lint"]);
        gulp.addTaskDependency("package-zip-static", "prepare-package:spa");
    },

    externalModules: {
        enabled: false,
        directories: [
        ]
    }
};