///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import newforms = require("newforms");
var DatePickerField = require("hornet-js-components/src/calendar/date-picker-field");
var utils = require("hornet-js-utils");

var logger = utils.getLogger("applitutoriel.views.par.par-rpa-form");

var RecherchePartenaireForm = function (secteurStore:any, intlMessages:any):any {
    var secteurTab = ([{
        "id": 0,
        "nom": intlMessages.fields.secteur.tous
    }]).concat(secteurStore.getListSecteurs());
    logger.debug("ListeSecteur au format newForms:", secteurTab);

    return newforms.Form.extend({
        isClient: newforms.ChoiceField({
            required: false,
            widget: newforms.RadioSelect,
            label: intlMessages.fields.isClient.label,
            choices: [["true", intlMessages.fields.isClient.clientLabel], ["false", intlMessages.fields.isClient.fournisseurLabel]]
        }),
        isVIP: newforms.BooleanField({
            required: false,
            label: intlMessages.fields.isVIP.label
        }),
        idSecteur: newforms.ChoiceField({
            label: intlMessages.fields.secteur.label,
            required: false,
            choices: newforms.util.makeChoices(secteurTab, "id", "nom")
        }),
        startDate: DatePickerField({
            label: intlMessages.fields.startDate.label,
            /* Libellé utilisé comme texte alternatif à l'image du bouton d'ouverture de calendrier */
            title: intlMessages.fields.startDate.title,
            required: true,
            /* Le format de saisie de date par défaut est défini avec la clé calendar.dateFormat dans messages.json
             ou dans hornet-messages-components.json, mais il peut être surchargé ici au format newforms. Par ex.  inputFormats: ["%d/%m/%Y","%d-%m-%Y"], */
            /* Lorsque le format de saisie n"inclut pas l"année (par exemple "%d/%m"), c"est l"année en cours
            qui est assignée par défaut. Il est possible de la définir ici avec la propriété defaultYear. Par ex. defaultYear: 2015, */
            errorMessages: {
                required: intlMessages.fields.startDate.required,
                invalid: intlMessages.fields.startDate.invalid
            }
        }),
        endDate: DatePickerField({
            required: false,
            label: intlMessages.fields.endDate.label,
            /* Libellé utilisé comme texte alternatif à l'image du bouton d'ouverture de calendrier */
            title: intlMessages.fields.endDate.title,
            /* Le format de saisie de date par défaut est défini avec la clé calendar.dateFormat dans messages.json
             ou dans hornet-messages-components.json, mais il peut être surchargé ici au format newforms. Par ex.  inputFormats: ["%d/%m/%Y","%d-%m-%Y"], */
            /* Lorsque le format de saisie n"inclut pas l"année (par exemple "%d/%m"), c"est l"année en cours
             qui est assignée par défaut. Il est possible de la définir ici avec la propriété defaultYear. Par ex. defaultYear: 2015, */
            errorMessages: {
                invalid: intlMessages.fields.endDate.invalid
            }
        }),
        errorCssClass: "error",
        requiredCssClass: "required",
        validCssClass: "valid",
        clean: ["startDate", "endDate", function () {
            var startDateValue = this.cleanedData.startDate;
            var endDateValue = this.cleanedData.endDate;

            if (startDateValue && endDateValue && startDateValue.getTime() > endDateValue.getTime()) {
                // Validation que la date de début est avant la date de fin
                this.addError("endDate", intlMessages.fields.endDate.mustBeAfterStartDate);
            }
        }]
    });
};

module.exports = RecherchePartenaireForm;
