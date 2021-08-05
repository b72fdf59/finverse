import { NextFunction, Request, Response } from "express";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";
import * as cheerio from "cheerio";
import sanitizeHtml from "sanitize-html";
import dotenv from "dotenv";
dotenv.config();

import {
  HttpError,
  DatabaseError,
  ParseHtmlError,
  HttpStatusCodes,
} from "../models/Errors";
import User from "../models/User";
import { User as DbUser } from "../schemas/user";
import Account from "../models/Accounts";
import Accounts from "../models/Accounts";
import Transaction from "../models/Transactions";
import { getQueryParams, isQueryParamsExist, QueryParams } from "../helpers";

export const getDbUser = async (username: string) => {
  return await DbUser.findOne(
    { username },
    { _id: 0, accounts: 0, __v: 0 },
    undefined,
    (err, _) => {
      if (err) {
        throw new DatabaseError(500, err.message);
      }
    }
  );
};

export const updateDbUser = async (username: string, accounts: Accounts[]) => {
  let user = await DbUser.findOne(
    { username: username },
    {},
    undefined,
    (err, _) => {
      if (err) {
        throw new DatabaseError(500, err.message);
      }
    }
  );
  user.accounts = accounts;
  await user.save();
};

export const loginWithCredentials = async (username: string) => {
  const loginUrl = `${process.env.WEBSERVICE_URL}/login`;
  const tmp = await getDbUser(username);
  const data: Omit<User, "accounts"> = {
    username: tmp.username,
    password: tmp.password,
  };
  const config: AxiosRequestConfig = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  let result: AxiosResponse;
  try {
    result = await axios.post(loginUrl, qs.stringify(data), config);
  } catch (err) {
    const error = new HttpError(
      500,
      err.response?.data || "An error occured while logging in with credentials"
    );
    throw error;
  }

  return result.data;
};

export const parseHtmlAccounts = (html: string) => {
  const accounts: Accounts[] = [];
  const $ = cheerio.load(html);
  $("table > tbody > tr").each((index, elem) => {
    if (index == 0) return true;
    const tds = $(elem).find("td");
    console.log($(tds[2]).text());
    const name = sanitizeHtml($(tds[0]).text());
    const accountNumber = sanitizeHtml($(tds[1]).text());
    const currency = sanitizeHtml($(tds[2]).text());
    const sanitizedBalance = parseFloat(sanitizeHtml($(tds[3]).text()));
    const balance = isNaN(sanitizedBalance) ? 0 : sanitizedBalance;
    const reportingCurrency = sanitizeHtml($(tds[4]).text());
    const sanitizedReportingBalance = parseFloat(
      sanitizeHtml($(tds[5]).text())
    );
    const reportingBalance = isNaN(sanitizedReportingBalance)
      ? 0
      : sanitizedReportingBalance;
    let acc: Account = {
      name,
      accountNumber,
      currency,
      balance,
      reportingCurrency,
      reportingBalance,
      transaction: [],
    };
    accounts.push(acc);
  });
  return accounts;
};

export const parseHtmlTransactions = (html: string) => {
  const transactions: Transaction[] = [];
  const $ = cheerio.load(html);
  $.html();
  $("table > tbody > tr").each((index, elem) => {
    if (index == 0) return true;
    const tds = $(elem).find("td");
    const transactionDate = sanitizeHtml($(tds[0]).text());
    const description = sanitizeHtml($(tds[1]).text());
    const currency = sanitizeHtml($(tds[2]).text());
    const sanitizedAmount = parseFloat(sanitizeHtml($(tds[3]).text()));
    const amount = isNaN(sanitizedAmount) ? 0 : sanitizedAmount;
    let transaction: Transaction = {
      transactionDate,
      description,
      amount,
      currency,
    };
    transactions.push(transaction);
  });
  return transactions;
};

export const parseTransactionUrl = (html: string) => {
  let urls: (string | undefined)[] = [];
  const $ = cheerio.load(html);
  const links = $("td a");
  $(links).each((_, link) => {
    urls.push(sanitizeHtml($(link).attr("href") || ""));
  });
  return urls;
};

export const extractAccountNumberFromTranactionDetails = (html: string) => {
  const $ = cheerio.load(html);
  const accountNumber = $("b").text();
  if (accountNumber === "") {
    throw new ParseHtmlError(
      500,
      "Transaction page does not have an account number to verify"
    );
  }
  return accountNumber;
};

export const collectTransactionsData = async (
  user: string,
  html: string,
  accounts: Account[]
): Promise<Account[]> => {
  let transUrl = parseTransactionUrl(html);
  transUrl = transUrl.map((elem) =>
    elem
      ? `${process.env.WEBSERVICE_URL}/users/${user}` + elem.substr(1)
      : undefined
  );
  let data = await Promise.all(
    transUrl.map(async (url) => {
      if (!url) return { accountNumber: "", transactions: [] };
      try {
        const result = await axios.get(url);
        const accountNumber = extractAccountNumberFromTranactionDetails(
          result.data
        );
        const transactions = parseHtmlTransactions(result.data);
        return { accountNumber, transactions };
      } catch (err) {
        const error = new HttpError(
          500,
          `An error occured while collecting transaction data of ${url}: ${err.response.data}`
        );
        throw error;
      }
    })
  );

  for (let elem of data) {
    for (let acc of accounts) {
      if (`${acc.accountNumber}_${acc.currency}` === elem.accountNumber) {
        acc.transaction = elem.transactions;
      }
    }
  }
  return accounts;
};

export const collectUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isQueryParamsExist(req.query)) {
    const err = new HttpError(
      HttpStatusCodes.BAD_REQUEST,
      "Please provide correct query parameters"
    );
    next(err);
  }
  const queryParams: QueryParams = getQueryParams(req.query);
  try {
    const htmlData = await loginWithCredentials(queryParams.username);
    let accounts = parseHtmlAccounts(htmlData);
    accounts = await collectTransactionsData(
      queryParams.username,
      htmlData,
      accounts
    );
    await updateDbUser(queryParams.username, accounts);
    return res.status(HttpStatusCodes.OK).json({
      message: "collected",
    });
  } catch (err) {
    next(err);
  }
};

export default { collectUserData };
