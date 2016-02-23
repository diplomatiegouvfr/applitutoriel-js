"use strict";

import React = require("react");
import utils = require("hornet-js-utils");
var GridForm = require("hornet-js-components/src/form/grid-form");
var Form = require("hornet-js-components/src/form/form");
import ContactForm = require("src/views/cnt/gen-cnt-form");
import ContactStore = require("src/stores/cnt/gen-cnt-store");
import ActionsContact = require("src/actions/cnt/gen-cnt-actions");
var Notification = require("hornet-js-components/src/notification/notification");
import HornetComponent = require("hornet-js-components/src/hornet-component");

var Row = GridForm.Row;
var Field = GridForm.Field;
var logger = utils.getLogger("applitutoriel.views.cnt.gen-cnt-page");

@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class ContactPage extends HornetComponent<any,any> {

    static displayName:string = "ContactPage";

    static storeListeners = [ContactStore];

    constructor(props?:any, context?:any) {
        super(props, context);

        var formData = this.getStore(ContactStore).getFormData();
        var formConf = {
            onChange: this.forceUpdate.bind(this),
            autoId: "{name}",
            data: formData || null,
            controlled: true
        };
        var intlMess = this.i18n("contactPage");
        var formClass = ContactForm(intlMess.form);
        this.state = {
            i18n: intlMess,
            data: formData,
            form: new formClass(formConf)
        };
    }

    @HornetComponent.AutoBind
    onChange() {
        var formData = this.getStore(ContactStore).getFormData();
        if (formData != this.state.form.data) {
            this.state.form.setData(formData || {}, {validate: false});
        }
    }

    getDefaultButtons() {
        return [{
            "type": "submit",
            "id": "envoi",
            "name": "action:envoi",
            "value": "Valider",
            "className": "hornet-button",
            "label": this.i18n("form.valid"),
            "title": this.state.i18n.form.validTitle
        }];

    }

    @HornetComponent.AutoBind
    onSubmit() {
        logger.debug("onSubmit click");
        var form = this.state.form;
        if (form.validate()) {
            this.executeAction(new ActionsContact.Send().action(), form.data);
        }
    }

    render() {
        logger.info("VIEW ContactPage render");
        logger.debug("render, form data = ", this.state.form.data);
        return (
            <div>
                <h2>{this.state.i18n.title}</h2>
                <Notification />
                <Form
                    form={this.state.form}
                    buttons={this.getDefaultButtons()}
                    onSubmit={this.onSubmit}
                >

                    <Row>
                        <Field name="nom" labelClass={"pure-u-1-3"}/>
                    </Row>
                    <Row>
                        <Field name="prenom" labelClass={"pure-u-1-3"}/>
                    </Row>
                    <Row>
                        <Field name="mail" labelClass={"pure-u-1-3"}/>
                    </Row>
                    <Row>
                        <Field name="message" labelClass={"pure-u-1-3"}/>
                    </Row>
                </Form>
            </div>
        );
    }
}

export = ContactPage;