import { isQueryParamsExist, getQueryParams } from "../src/helpers";
import * as chai from "chai";
import "mocha";
import QueryString from "qs";

const expect = chai.expect;

describe("Check if user parameter exist", () => {
  it("False if no parameter exist", () => {
    const req: QueryString.ParsedQs = {};
    chai.expect(isQueryParamsExist(req)).to.equal(false);
  });
  it("True if user query parameter exists", () => {
    const req: QueryString.ParsedQs = { user: "test234" };
    chai.expect(isQueryParamsExist(req)).to.equal(true);
  });
  it("False if other query paramerters other than user", () => {
    const req: QueryString.ParsedQs = { test: "test234", test2: "sab" };
    chai.expect(isQueryParamsExist(req)).to.equal(false);
  });
});

describe("Check if getQuestParams gets correct params", () => {
  it("Should return string with username", () => {
    const req: QueryString.ParsedQs = { user: "test" };
    chai.expect(getQueryParams(req)).to.eql({ username: "test" });
  });
  it("Return object with undefined username", () => {
    const req: QueryString.ParsedQs = { test: "test", test2: "usergood" };
    chai.expect(getQueryParams(req)).to.eql({ username: undefined });
  });
});
