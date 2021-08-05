import * as chai from "chai";
import "mocha";
import QueryString from "qs";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../src/schemas/user";
import { updateDbUser, getDbUser } from "../src/controllers/collector";
import { getDbUser as getDbUserRet } from "../src/controllers/retriever";

const expect = chai.expect;
const DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost:27017/test";

export const seedDb = async (username: string, password: string) => {
  const user = new User({
    username: username,
    password: password,
    accounts: [],
  });
  await user.save();
};

describe("Function to check if database functiions are working", () => {
  it("Should be equal to seeded data without accounts", () => {
    const eraseDatabaseOnSync = true;
    const DATABASE_URL = "mongodb://localhost:27017/finverse_test";
    mongoose.connect(DATABASE_URL, async () => {
      if (eraseDatabaseOnSync) {
        await Promise.all([User.deleteMany({})]);
        await seedDb("usergood", "datagood");
      }
      const user = await getDbUser("usergood");
      chai.expect(user).to.eql({
        username: "usergood",
        password: "datagood",
      });
    });
  });
  it("Should be equal to seeded data with accounts", () => {
    const eraseDatabaseOnSync = true;
    const DATABASE_URL = "mongodb://localhost:27017/finverse_test";
    mongoose.connect(DATABASE_URL, async () => {
      if (eraseDatabaseOnSync) {
        await Promise.all([User.deleteMany({})]);
        await seedDb("usergood", "datagood");
      }
      const user = await getDbUserRet("usergood");
      chai.expect(user).to.eql({
        username: "usergood",
        password: "datagood",
        accounts: [],
      });
    });
  });
  it("Should return updated object", () => {
    const eraseDatabaseOnSync = true;
    const DATABASE_URL = "mongodb://localhost:27017/finverse_test";
    mongoose.connect(DATABASE_URL, async () => {
      if (eraseDatabaseOnSync) {
        await Promise.all([User.deleteMany({})]);
        await seedDb("usergood", "notdatagood");
      }
      const testAcc = {
        name: "test",
        accountNumber: "123456",
        balance: 0,
        currency: "HKD",
        reportingBalance: 0,
        reportingCurrency: "HKD",
        transaction: [],
      };
      const updatedUser = await updateDbUser("usergood", [testAcc]);
      chai.expect(updatedUser).to.eql({
        username: "usergood",
        password: "datagood",
        accounts: [testAcc],
      });
    });
  });
});
