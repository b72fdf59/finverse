"use strict";

exports.__esModule = true;

var helpers_1 = require("../src/helpers");

var chai = require("chai");

require("mocha");

var expect = chai.expect;
describe("Check if user parameter exist", function () {
  it("False if no parameter exist", function () {
    var req = {};
    chai.expect(helpers_1.isQueryParamsExist(req)).to.equal(false);
  });
  it("True if user query parameter exists", function () {
    var req = {
      user: "test234"
    };
    chai.expect(helpers_1.isQueryParamsExist(req)).to.equal(true);
  });
  it("False if other query paramerters other than user", function () {
    var req = {
      test: "test234",
      test2: "sab"
    };
    chai.expect(helpers_1.isQueryParamsExist(req)).to.equal(false);
  });
});
describe("Check if getQuestParams gets correct params", function () {
  it("Should return string with username", function () {
    var req = {
      user: "test"
    };
    chai.expect(helpers_1.getQueryParams(req)).to.eql({
      username: "test"
    });
  });
  it("Return object with undefined username", function () {
    var req = {
      test: "test",
      test2: "usergood"
    };
    chai.expect(helpers_1.getQueryParams(req)).to.eql({
      username: undefined
    });
  });
});