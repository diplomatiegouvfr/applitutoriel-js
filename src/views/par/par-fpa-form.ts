"use strict";
import newforms = require("newforms");
import FichePartenaireStore = require("src/stores/par/par-fpa-store");
var HornetAutoCompleteField = require("hornet-js-components/src/auto-complete/auto-complete-field");
var HornetUploadFileField = require("hornet-js-components/src/upload-file/upload-file-field");

// on accepte les chiffre et "+" ")"  et "(" à n"impoprte quelle place
var regexTelephone = "^([0-9]|\\(|\\)|\\+)*$";

var FichePartenaireForm = function (partenaireStore:any, intlMessages:any) {

    // Création des listes de choix
    var listePays = [{id: 0, libelle: intlMessages.aucun}];
    listePays.push.apply(listePays, partenaireStore.getListePays());
    var paysData = newforms.util.makeChoices(listePays, "id", "libelle");

    var civilites = [
        {id: 0, name: intlMessages.aucune},
        {id: 1, name: intlMessages.mme},
        {id: 2, name: intlMessages.mr}];
    var civiliteData = newforms.util.makeChoices(civilites, "id", "name");

    var listeVilles = [{id: 0, libelle: intlMessages.aucun}];
    listeVilles.push.apply(listeVilles, partenaireStore.getVilles());
    var villeData = newforms.util.makeChoices(listeVilles, "id", "libelle");

    var choices = [
        [1, intlMessages.fields.satisfaction.internet]
        , [2, intlMessages.fields.satisfaction.bao]
        , [3, intlMessages.fields.satisfaction.pub]
        , [4, intlMessages.fields.satisfaction.tele]
        , [5, intlMessages.fields.satisfaction.journal]
        , [6, intlMessages.fields.satisfaction.radio]
        , [7, intlMessages.fields.satisfaction.autres]
    ];

    var form = newforms.Form.extend({
        id: newforms.CharField({
            required: false,
            widget: newforms.HiddenInput

        }),
        isClient: newforms.ChoiceField({
            custom: {
                useReadOnlyWidget: true
            },
            required: false,
            widget: newforms.RadioSelect,
            label: intlMessages.fields.isClient.label,
            choices: [[true, intlMessages.fields.isClient.clientLabel], [false, intlMessages.fields.isClient.fournisseurLabel]]
        }),
        isVIP: newforms.BooleanField({
            custom: {
                useReadOnlyWidget: true
            },
            required: false,
            label: intlMessages.fields.isVIP.label,
            /* Validation automatique pour ce champ, car il doit déclencher le passage en lecture seule
              d'une partie des autres champs */
            validation: "auto"
        }),
        civilite: newforms.ChoiceField({
            custom: {
                useReadOnlyWidget: true
            },
            required: true,
            label: intlMessages.fields.civilite.label,
            widget: newforms.Select,
            errorMessages: {
                required: intlMessages.fields.civilite.required
            },
            choices: civiliteData
        }),
        cleanCivilite: function () {
            var civiliteValue = this.cleanedData.civilite;
            if (civiliteValue == 0) {
                throw newforms.ValidationError(intlMessages.fields.civilite.required, {code: "required"});
            }
        },
        nom: newforms.CharField({
            label: intlMessages.fields.nom.label,
            required: true,
            maxLength: 50,
            errorMessages: {
                required: intlMessages.fields.nom.required
            }
        }),
        nomLocal: newforms.CharField({
            label: intlMessages.fields.nomLocal.label,
            required: false,
            maxLength: 50,
            errorMessages: {
                required: intlMessages.fields.nomLocal.required
            }
        }),
        prenom: newforms.CharField({
            label: intlMessages.fields.prenom.label,
            required: true,
            maxLength: 50,
            errorMessages: {
                required: intlMessages.fields.prenom.required
            }
        }),
        prenomLocal: newforms.CharField({
            label: intlMessages.fields.prenomLocal.label,
            required: false,
            maxLength: 50
        }),
        nationalite: HornetAutoCompleteField({
            store: {
                class: FichePartenaireStore,
                functionName: "getListeNationalites"
            },
            actionClass: require("src/actions/par/par-fpa-actions").ListerNationalites,
            label: intlMessages.fields.nationalite.label,
            required: true,
            errorMessages: {
                required: intlMessages.fields.nationalite.required
            },
            i18n: intlMessages.fields.nationalite.autoComplete
        }),
        organisme: newforms.CharField({
            widget: newforms.TextInput({
                attrs: {size: "50"}
            }),
            maxLength: 50,
            label: intlMessages.fields.organisme.label,
            required: false
        }),
        fonction: newforms.CharField({
            widget: newforms.TextInput({
                attrs: {size: "50"}
            }),
            maxLength: 50,
            label: intlMessages.fields.fonction.label,
            required: false
        }),
        proTelFixe: newforms.RegexField(regexTelephone, {
            widget: newforms.TextInput({
                attrs: {size: "12"}
            }),
            maxLength: 14,
            label: intlMessages.fields.proTelFixe.label,
            required: false,
            errorMessages: {
                invalid: intlMessages.fields.proTelFixe.invalid
            }
        }),
        proTelPort: newforms.RegexField(regexTelephone, {
            widrsget: newforms.TextInput({
                attrs: {size: "12"}
            }),
            maxLength: 14,
            label: intlMessages.fields.proTelPort.label,
            required: false,
            errorMessages: {
                invalid: intlMessages.fields.proTelPort.invalid
            }
        }),
        proCourriel: newforms.EmailField({
            label: intlMessages.fields.proCourriel.label,
            maxLength: 80,
            minLength: 3,
            widget: newforms.EmailInput({
                attrs: {size: "50"}
            }),
            required: true,
            errorMessages: {
                minLength: intlMessages.fields.proCourriel.minLength,
                required: intlMessages.fields.proCourriel.required,
                invalid: intlMessages.fields.proCourriel.emailInvalid
            }
        }),
        proFax: newforms.RegexField(regexTelephone, {
            widget: newforms.TextInput({
                attrs: {size: "12"}
            }),
            maxLength: 14,
            label: intlMessages.fields.proFax.label,
            required: false,
            errorMessages: {
                invalid: intlMessages.fields.proFax.invalid
            }
        }),
        proAdrRue: newforms.CharField({
            widget: newforms.TextInput({
                attrs: {size: "80"}
            }),
            maxLength: 250,
            size: 80,
            label: intlMessages.fields.proAdrRue.label,
            required: true,
            errorMessages: {
                required: intlMessages.fields.proAdrRue.required
            }
        }),
        proAdrCP: newforms.CharField({
            widget: newforms.TextInput({
                attrs: {size: "12"}
            }),
            maxLength: 9,
            label: intlMessages.fields.proAdrCP.label,
            required: true,
            errorMessages: {
                required: intlMessages.fields.proAdrCP.required
            }
        }),
        pays: newforms.ChoiceField({
            custom: {
                useReadOnlyWidget: true
            },
            label: intlMessages.fields.pays.label,
            widget: newforms.Select,
            required: true,
            errorMessages: {
                required: intlMessages.fields.pays.required
            },
            /* Validation automatique pour ce champ, car il doit déclencher la mise à jour du champ ville */
            validation: "auto",
            choices: paysData
        }),
        cleanPays: function() {
            var value = this.cleanedData.pays;
            if (value == 0) {
                this.addError("pays", intlMessages.fields.pays.required);
            }
        },
        ville: newforms.ChoiceField({
            custom: {
                useReadOnlyWidget: true
            },
            label: intlMessages.fields.ville.label,
            widget: newforms.Select,
            required: true,
            /* Le champ ville est susceptible d'être mis à jour programmatiquement.
            L'attribut controlled est donc nécessaire.
            (http://newforms.readthedocs.org/en/latest/react_client.html#controlled-user-inputs) */
            controlled: true,
            errorMessages: {
                required: intlMessages.fields.ville.required,
                invalidChoice: ""
            },
            choices: villeData
        }),
        cleanVille: function () {
            var villeValue = this.cleanedData.ville;
            if (villeValue == 0) {
                this.addError("ville", intlMessages.fields.ville.required);
            }
        },
        assistNom: newforms.CharField({
            label: intlMessages.fields.assistNom.label,
            maxLength: 50,
            required: false
        }),
        assistPrenom: newforms.CharField({
            label: intlMessages.fields.assistPrenom.label,
            maxLength: 50,
            required: false
        }),
        assistTel: newforms.RegexField(regexTelephone, {
            widget: newforms.TextInput({
                attrs: {size: "12"}
            }),
            label: intlMessages.fields.assistTel.label,
            maxLength: 14,
            required: false,
            errorMessages: {
                invalid: intlMessages.fields.assistTel.invalid
            }
        }),
        assistCourriel: newforms.CharField({
            widget: newforms.EmailInput({
                attrs: {size: "50"}
            }),
            maxLength: 80,
            label: intlMessages.fields.assistCourriel.label,
            required: false,
            errorMessages: {
                invalid: intlMessages.fields.assistCourriel.emailInvalid
            }
        }),
        photo: HornetUploadFileField(
            {
                required: false,
                label: intlMessages.fields.photo.selection,
                helpText: intlMessages.fields.photo.help,
                /*Définir l'url d"accès à l'image affiché en lecture seule*/
                fileRoute: "partenaires/photo/",
                fileTitle: intlMessages.fields.photo.altImage,
                widgetAttrs :{
                    accept: [".png", ".jpg", ".gif", ".bmp", ".pdf", ".xlsx"],
                    maxSize: "1000000"
                },
                errorMessages: {
                    invalid: intlMessages.fields.photo.fileType,
                    maxSize: intlMessages.fields.photo.maxSize
                }
            }
        ),
        commentaire: newforms.CharField({
            widget: newforms.Textarea({
                attrs: {rows: "4", cols: "80"}
            }),
            maxLength: 255,
            label: intlMessages.fields.commentaire.label,
            required: false,
            errorMessages: {
                maxLength: intlMessages.fields.commentaire.maxLength
            }
        }),
        satisfaction: newforms.MultipleChoiceField({
            choices: choices,
            required: false,
            label: intlMessages.fields.satisfaction.label,
            attrs: {
                row: 50
            }
        }),
        errorCssClass: "error",
        requiredCssClass: "required",
        validCssClass: "valid",
        isFormAsync: true
    });

    return form;
};

module.exports = FichePartenaireForm;
