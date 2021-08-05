"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.loginWithCredentials = exports.updateDbUser = exports.getDbUser = void 0;
var axios_1 = require("axios");
var qs_1 = require("qs");
var cheerio = require("cheerio");
var sanitize_html_1 = require("sanitize-html");
var Errors_1 = require("../models/Errors");
var user_1 = require("../schemas/user");
var helpers_1 = require("../helpers");
exports.getDbUser = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.findOne({ username: username }, { _id: 0, accounts: 0, __v: 0 }, undefined, function (err, _) {
                    if (err) {
                        throw new Errors_1.HttpError(500, err.message);
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateDbUser = function (username, accounts) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.findOne({ username: username }, {}, undefined, function (err, _) {
                    if (err) {
                        throw new Errors_1.HttpError(500, err.message);
                    }
                })];
            case 1:
                user = _a.sent();
                user.accounts = accounts;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.loginWithCredentials = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    var loginUrl, tmp, data, config, result, err_1, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loginUrl = "http://localhost:8080/login";
                return [4 /*yield*/, exports.getDbUser(username)];
            case 1:
                tmp = _a.sent();
                data = {
                    username: tmp.username,
                    password: tmp.password
                };
                config = {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1["default"].post(loginUrl, qs_1["default"].stringify(data), config)];
            case 3:
                result = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                error = new Errors_1.HttpError(500, err_1.response.data || "An error occured while logging in with credentials");
                throw error;
            case 5: return [2 /*return*/, result.data];
        }
    });
}); };
var parseHtmlAccounts = function (html) {
    var accounts = [];
    var $ = cheerio.load(html);
    $.html();
    $("table > tbody > tr").each(function (index, elem) {
        if (index == 0)
            return true;
        var tds = $(elem).find("td");
        var name = sanitize_html_1["default"]($(tds[0]).text());
        var accountNumber = sanitize_html_1["default"]($(tds[1]).text());
        var currency = sanitize_html_1["default"]($(tds[2]).text());
        var balance = parseInt(sanitize_html_1["default"]($(tds[3]).text()), 10);
        var reportingCurrency = sanitize_html_1["default"]($(tds[4]).text());
        var reportingBalance = parseInt(sanitize_html_1["default"]($(tds[5]).text()), 10);
        var acc = {
            name: name,
            accountNumber: accountNumber,
            currency: currency,
            balance: balance,
            reportingCurrency: reportingCurrency,
            reportingBalance: reportingBalance,
            transaction: []
        };
        accounts.push(acc);
    });
    return accounts;
};
var parseHtmlTransactions = function (html) {
    var transactions = [];
    var $ = cheerio.load(html);
    $.html();
    $("table > tbody > tr").each(function (index, elem) {
        if (index == 0)
            return true;
        var tds = $(elem).find("td");
        var transactionDate = sanitize_html_1["default"]($(tds[0]).text());
        var description = sanitize_html_1["default"]($(tds[1]).text());
        var currency = sanitize_html_1["default"]($(tds[2]).text());
        var amount = parseInt(sanitize_html_1["default"]($(tds[3]).text()), 10);
        var transaction = {
            transactionDate: transactionDate,
            description: description,
            amount: amount,
            currency: currency
        };
        transactions.push(transaction);
    });
    return transactions;
};
var parseTransactionUrl = function (html) {
    var urls = [];
    var $ = cheerio.load(html);
    var links = $("td a");
    $(links).each(function (_, link) {
        urls.push(sanitize_html_1["default"]($(link).attr("href") || ""));
    });
    return urls;
};
var extractAccountNumberFromTranactionDetails = function (html) {
    var $ = cheerio.load(html);
    var accountNumber = $("b").text();
    return accountNumber;
};
var collectTransactionsData = function (user, html, accounts) { return __awaiter(void 0, void 0, Promise, function () {
    var transUrl, data, _i, data_1, elem, _a, accounts_1, acc;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                transUrl = parseTransactionUrl(html);
                transUrl = transUrl.map(function (elem) {
                    return elem ? "http://localhost:8080/users/" + user + elem.substr(1) : undefined;
                });
                return [4 /*yield*/, Promise.all(transUrl.map(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        var result, accountNumber, transactions, err_2, error;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!url)
                                        return [2 /*return*/, { accountNumber: "", transactions: [] }];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, axios_1["default"].get(url)];
                                case 2:
                                    result = _a.sent();
                                    accountNumber = extractAccountNumberFromTranactionDetails(result.data);
                                    transactions = parseHtmlTransactions(result.data);
                                    return [2 /*return*/, { accountNumber: accountNumber, transactions: transactions }];
                                case 3:
                                    err_2 = _a.sent();
                                    error = new Errors_1.HttpError(500, "An error occured while collecting transaction data of " + url + ": " + err_2.response.data);
                                    throw error;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                data = _b.sent();
                for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                    elem = data_1[_i];
                    for (_a = 0, accounts_1 = accounts; _a < accounts_1.length; _a++) {
                        acc = accounts_1[_a];
                        if (acc.accountNumber + "_" + acc.currency === elem.accountNumber) {
                            acc.transaction = elem.transactions;
                        }
                    }
                }
                return [2 /*return*/, accounts];
        }
    });
}); };
var collectUserData = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var err, queryParams, htmlData, accounts, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!helpers_1.isQueryParamsExist(req.query)) {
                    err = new Errors_1.HttpError(Errors_1.HttpStatusCodes.BAD_REQUEST, "Please provide correct query parameters");
                    next(err);
                }
                queryParams = helpers_1.getQueryParams(req.query);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, exports.loginWithCredentials(queryParams.username)];
            case 2:
                htmlData = _a.sent();
                accounts = parseHtmlAccounts(htmlData);
                return [4 /*yield*/, collectTransactionsData(queryParams.username, htmlData, accounts)];
            case 3:
                accounts = _a.sent();
                return [4 /*yield*/, exports.updateDbUser(queryParams.username, accounts)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.status(Errors_1.HttpStatusCodes.OK).json({
                        message: "collected"
                    })];
            case 5:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports["default"] = { collectUserData: collectUserData };
