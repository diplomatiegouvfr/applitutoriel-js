///<reference path="../../../node_modules/app/hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import newforms = require("newforms");
var DatePickerField = require("hornet-js-components/src/calendar/date-picker-field");

var SecteurForm = function (intlMessages) {
    return newforms.Form.extend({
        nom: newforms.CharField({
            label: intlMessages.fields.nom.label,
            widget: newforms.TextInput({
                attrs: {size: "40"}
            }),
            maxLength: 50,
            required: true,
            errorMessages: {required: intlMessages.nomRequired}
        }),
        desc: newforms.CharField({
            label: intlMessages.fields.desc.label,
            widget: newforms.TextInput({
                attrs: {size: "40"}
            }),
            maxLength: 200,
            required: true,
            errorMessages: {required: intlMessages.descRequired}
        }),
        date: DatePickerField({
            label: "test modal",
            required: false
        }),
        errorCssClass: "error",
        requiredCssClass: "required",
        validCssClass: "valid"
    });
};

module.exports = SecteurForm;