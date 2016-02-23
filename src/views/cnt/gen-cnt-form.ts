"use strict";
import newforms = require("newforms");

var ContactForm = function (intlMessages:any) {
    return newforms.Form.extend({
        nom: newforms.CharField({
            label: intlMessages.fields.nom.label,
            required: true,
            errorMessages: {required: intlMessages.nomRequired}
        }),
        prenom: newforms.CharField({
            label: intlMessages.fields.prenom.label,
            required: true,
            errorMessages: {required: intlMessages.prenomRequired}
        }),
        mail: newforms.EmailField({
            label: intlMessages.fields.mail.label,
            required: true,
            errorMessages: {
                invalid: intlMessages.emailInvalid,
                required: intlMessages.emailRequired
            }
        }),
        message: newforms.CharField({
            label: intlMessages.fields.message.label,
            required: true,
            widget: newforms.Textarea({attrs: {rows: 6, cols: 60}}),
            errorMessages: {required: intlMessages.messageRequired}
        }),
        errorCssClass: "error",
        requiredCssClass: "required",
        validCssClass: "valid"
    });
};

export = ContactForm;