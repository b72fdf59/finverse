import {
  parseHtmlAccounts,
  parseHtmlTransactions,
  parseTransactionUrl,
  extractAccountNumberFromTranactionDetails,
} from "../src/controllers/collector";
import * as chai from "chai";
import "mocha";

const expect = chai.expect;

describe("Extract Accounts from account overview page", () => {
  it("Should be an empty array", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
        <th>Nickname</th>
        <th>Account Number</th>
        <th>Currency</th>
        <th>Balance</th>
        <th>Reporting Currency</th>
        <th>Reporting Balance</th>
        <th>Details</th>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseHtmlAccounts(html)).to.eql([]);
  });
  it("Should be matching data in the html", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
        <th>Nickname</th>
        <th>Account Number</th>
        <th>Currency</th>
        <th>Balance</th>
        <th>Reporting Currency</th>
        <th>Reporting Balance</th>
        <th>Details</th>
    </tr>
    <tr>
        <td>HKD Checking</td>
        <td>123-456-789</td>
        <td>HKD</td>
        <td>70013.12</td>
        <td>HKD</td>
        <td>70013.12</td>
        <td><a href="./accounts/123-456-789_HKD/transactions?testingType=">details</a> </td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseHtmlAccounts(html)).to.eql([
      {
        name: "HKD Checking",
        accountNumber: "123-456-789",
        currency: "HKD",
        balance: 70013.12,
        reportingCurrency: "HKD",
        reportingBalance: 70013.12,
        transaction: [],
      },
    ]);
  });
  it("Balance should be 0 if not a number", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
        <th>Nickname</th>
        <th>Account Number</th>
        <th>Currency</th>
        <th>Balance</th>
        <th>Reporting Currency</th>
        <th>Reporting Balance</th>
        <th>Details</th>
    </tr>
    <tr>
        <td>HKD Checking</td>
        <td>123-456-789</td>
        <td>HKD</td>
        <td>sdfasdf</td>
        <td>HKD</td>
        <td>@#$!</td>
        <td><a href="./accounts/123-456-789_HKD/transactions?testingType=">details</a> </td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseHtmlAccounts(html)).to.eql([
      {
        name: "HKD Checking",
        accountNumber: "123-456-789",
        currency: "HKD",
        balance: 0,
        reportingCurrency: "HKD",
        reportingBalance: 0,
        transaction: [],
      },
    ]);
  });
  it("Should be empty string for attributes that are not present and 0 for balance", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
        <th>Nickname</th>
        <th>Account Number</th>
        <th>Currency</th>
        <th>Balance</th>
        <th>Reporting Currency</th>
        <th>Reporting Balance</th>
        <th>Details</th>
    </tr>
    <tr>
        <td>HKD Checking</td>
        <td>123-456-789</td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseHtmlAccounts(html)).to.eql([
      {
        name: "HKD Checking",
        accountNumber: "123-456-789",
        currency: "",
        balance: 0,
        reportingCurrency: "",
        reportingBalance: 0,
        transaction: [],
      },
    ]);
  });
});

describe("Extract transactions from Transaction Detail page", () => {
  it("Should be an empty array", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
        <th>Transaction Date</th>
        <th>Description</th>
        <th>Currency</th>
        <th>Amount</th>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseHtmlTransactions(html)).to.eql([]);
  });
  it("Should be matching data in the html", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
        <th>Transaction Date</th>
        <th>Description</th>
        <th>Currency</th>
        <th>Amount</th>
    </tr>
    <tr>
        <td>2020-11-13</td>
        <td>COFFEE</td>
        <td>HKD</td>
        <td>-45.00</td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseHtmlTransactions(html)).to.eql([
      {
        transactionDate: "2020-11-13",
        description: "COFFEE",
        currency: "HKD",
        amount: -45,
      },
    ]);
  });
  it("Should be empty string for attributes that are not present and 0 for balance", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
        <th>Transaction Date</th>
        <th>Description</th>
        <th>Currency</th>
        <th>Amount</th>
    </tr>
    <tr>
        <td>2020-11-13</td>
        <td>COFFEE</td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseHtmlTransactions(html)).to.eql([
      {
        transactionDate: "2020-11-13",
        description: "COFFEE",
        currency: "",
        amount: 0,
      },
    ]);
  });
});

describe("Extract transactions Urls from account overview page", () => {
  it("Should be an array of empty strings", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
    <td><a href="">details</a></td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseTransactionUrl(html)).to.eql([""]);
  });
  it("Should be an array of empty strings", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
    <td><a>details</a> </td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseTransactionUrl(html)).to.eql([""]);
  });
  it("Should be an array with url", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
    <td><a href="url">details</a> </td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseTransactionUrl(html)).to.eql(["url"]);
  });
  it("Should be an empty array", () => {
    const html = `
    <html>
    <body>
    <table>
    <tbody>
    <tr>
    <td>details</td>
    </tr>
    </tbody>
    </table>
    </body>
    </html>`;
    chai.expect(parseTransactionUrl(html)).to.eql([]);
  });
});

describe("Extracting account number from transaction detail page", () => {
  it("Should return the account number as in the html", () => {
    const html =
      "<p> This is a text with something in bold <b>123-456-789_HKD</b> </p>";
    chai
      .expect(extractAccountNumberFromTranactionDetails(html))
      .to.eql("123-456-789_HKD");
  });
  it("Should be an empty string", () => {
    const html =
      "<p> This is a text with something in bold 123-456-789_HKD </p>";
    chai.expect(extractAccountNumberFromTranactionDetails(html)).to.eql("");
  });
});
