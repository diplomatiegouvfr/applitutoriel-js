"use strict";
import newforms = require("newforms");

var SecteurForm = function (intlMessages:any) {
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
        errorCssClass: "error",
        requiredCssClass: "required",
        validCssClass: "valid"
    });
};

export = SecteurForm;
