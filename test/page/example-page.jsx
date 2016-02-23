"use strict";

var utils = require("hornet-js-utils");
var React = require("react");
var logger = utils.getLogger("applitutoriel.test.page.exemple-page");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var newforms = require("newforms");
var Form = require("hornet-js-components/src/form/form");
var GridForm = require("hornet-js-components/src/form/grid-form");
var Row = GridForm.Row;
var Field = GridForm.Field;

var ExampleForm = newforms.Form.extend({
    nom: newforms.CharField({
        required: true,
        errorMessages: {required: "Le champ « Nom » est obligatoire. Veuillez saisir ce champ."}
    }),
    prenom: newforms.CharField({
        required: true,
        errorMessages: {required: "Le champ « Prénom » est obligatoire. Veuillez saisir ce champ."}
    }),
    errorCssClass: "error",
    requiredCssClass: "required",
    validCssClass: "valid"
});

var ExamplePage = React.createClass({
    mixins: [HornetComponentMixin],

    getInitialState: () => {
        logger.info("getInitialState");
        var form = new ExampleForm();
        return {
            form: form
        }
    },

    render: () => {
        logger.info("render - form ");
        var form = this.state.form;

        return (
            <div>
                <h2>Exemple</h2>

                <Form
                    form={form}
                    id="exampleForm"
                    action="/example"
                    onSubmit={this.onSubmit}>
                    <Row>
                        <Field name="nom" />
                        <Field name="prenom" />
                    </Row>
                </Form>
            </div>
        );
    }
});

module.exports = ExamplePage;
