"use strict";

/**
 * Classe regroupant les rôles disponibles dans l'appli-tuto
 */
class Roles {
    static USER_STR = "AppliTuto_USER";
    static ADMIN_STR = "AppliTuto_ADMIN";

    static USER = [Roles.USER_STR];
    static ADMIN = [Roles.ADMIN_STR];

    static EVERYONE = [Roles.USER_STR, Roles.ADMIN_STR];

}

export = Roles;
