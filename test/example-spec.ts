"use strict";

var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;

var Logger = TestUtils.getLogger("applitutoriel.test.exemple-spec");

import Hello = require("./example");

describe("Test JS", () => {
    it("doit passer", () => {
        expect(Hello.sayHello("world")).to.be.equal("Hello, world");
    });
});
