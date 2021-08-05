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
exports.seedDb = void 0;
var chai = require("chai");
require("mocha");
var mongoose_1 = require("mongoose");
var user_1 = require("../src/schemas/user");
var collector_1 = require("../src/controllers/collector");
var retriever_1 = require("../src/controllers/retriever");
var expect = chai.expect;
exports.seedDb = function (username, password) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = new user_1.User({
                    username: username,
                    password: password,
                    accounts: []
                });
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
describe("Function to check if database functiions are working", function () {
    it("Should be equal to seeded data without accounts", function () {
        var eraseDatabaseOnSync = true;
        var DATABASE_URL = "mongodb://localhost:27017/finverse_test";
        mongoose_1["default"].connect(DATABASE_URL, function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!eraseDatabaseOnSync) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all([user_1.User.deleteMany({})])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, exports.seedDb("usergood", "datagood")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, collector_1.getDbUser("usergood")];
                    case 4:
                        user = _a.sent();
                        chai.expect(user).to.eql({
                            username: "usergood",
                            password: "datagood"
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it("Should be equal to seeded data with accounts", function () {
        var eraseDatabaseOnSync = true;
        var DATABASE_URL = "mongodb://localhost:27017/finverse_test";
        mongoose_1["default"].connect(DATABASE_URL, function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!eraseDatabaseOnSync) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all([user_1.User.deleteMany({})])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, exports.seedDb("usergood", "datagood")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, retriever_1.getDbUser("usergood")];
                    case 4:
                        user = _a.sent();
                        chai.expect(user).to.eql({
                            username: "usergood",
                            password: "datagood",
                            accounts: []
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it("Should return updated object", function () {
        var eraseDatabaseOnSync = true;
        var DATABASE_URL = "mongodb://localhost:27017/finverse_test";
        mongoose_1["default"].connect(DATABASE_URL, function () { return __awaiter(void 0, void 0, void 0, function () {
            var testAcc, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!eraseDatabaseOnSync) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all([user_1.User.deleteMany({})])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, exports.seedDb("usergood", "notdatagood")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        testAcc = {
                            name: "test",
                            accountNumber: "123456",
                            balance: 0,
                            currency: "HKD",
                            reportingBalance: 0,
                            reportingCurrency: "HKD",
                            transaction: []
                        };
                        return [4 /*yield*/, collector_1.updateDbUser("usergood", [testAcc])];
                    case 4:
                        updatedUser = _a.sent();
                        chai.expect(updatedUser).to.eql({
                            username: "usergood",
                            password: "datagood",
                            accounts: [testAcc]
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
