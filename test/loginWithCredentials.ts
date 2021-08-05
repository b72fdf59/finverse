import * as chai from "chai";
import "mocha";
import mongoose from "mongoose";
import * as cheerio from "cheerio";

import { loginWithCredentials } from "../src/controllers/collector";
import { User } from "../src/schemas/user";

const expect = chai.expect;

export const seedDb = async (username: string, password: string) => {
  const user = new User({
    username: username,
    password: password,
  });
  await user.save();
};

describe("Function to login with credentials", () => {
  it("Should return string", () => {
    const eraseDatabaseOnSync = true;
    const DATABASE_URL = "mongodb://localhost:27017/finverse_test";
    mongoose.connect(DATABASE_URL, async () => {
      if (eraseDatabaseOnSync) {
        await Promise.all([User.deleteMany({})]);
        await seedDb("usergood", "datagood");
      }
      chai.expect(loginWithCredentials("usergood")).to.be.a("string");
    });
  });
  it("Should return error page", () => {
    const eraseDatabaseOnSync = true;
    const DATABASE_URL = "mongodb://localhost:27017/finverse_test";
    mongoose.connect(DATABASE_URL, async () => {
      if (eraseDatabaseOnSync) {
        await Promise.all([User.deleteMany({})]);
        await seedDb("usergood", "notdatagood");
      }
      const html = await loginWithCredentials("usergood");
      const $ = cheerio.load(html);
      chai.expect($("p").text()).to.eql("password_error");
    });
  });
  it("Should return error page", () => {
    const eraseDatabaseOnSync = true;
    const DATABASE_URL = "mongodb://localhost:27017/finverse_test";
    mongoose.connect(DATABASE_URL, async () => {
      if (eraseDatabaseOnSync) {
        await Promise.all([User.deleteMany({})]);
        await seedDb("usernotgood", "notdatagood");
      }
      const html = await loginWithCredentials("usergood");
      const $ = cheerio.load(html);
      chai.expect($("p").text()).to.eql("username_error");
    });
  });
});
