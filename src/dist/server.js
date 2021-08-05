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
var _a;
exports.__esModule = true;
exports.seedDb = void 0;
var http_1 = require("http");
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var morgan_1 = require("morgan");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var webService_1 = require("./routes/webService");
var Errors_1 = require("./models/Errors");
var user_1 = require("./schemas/user");
var server = express_1["default"]();
exports.seedDb = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = new user_1.User({
                    username: "usergood",
                    password: "datagood"
                });
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var eraseDatabaseOnSync = false;
mongoose_1["default"].connect(process.env.DATABASE_URL || "", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!eraseDatabaseOnSync) return [3 /*break*/, 3];
                return [4 /*yield*/, Promise.all([user_1.User.deleteMany({})])];
            case 1:
                _a.sent();
                return [4 /*yield*/, exports.seedDb()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                console.log("Connected to db");
                return [2 /*return*/];
        }
    });
}); });
server.use(morgan_1["default"]("dev"));
server.use(express_1["default"].urlencoded({ extended: false }));
server.use(express_1["default"].json());
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "origin, X-Requested-With,Content-Type,Accept, Authorization");
    next();
});
server.use("/", webService_1["default"]);
server.use(function (_req, _res, next) {
    var err = new Errors_1.HttpError(Errors_1.HttpStatusCodes.NOT_FOUND, "not found");
    next(err);
});
server.use(function (err, _req, res, _next) {
    console.log(err);
    var status = err.status || Errors_1.HttpStatusCodes.INTERNAL_SERVER;
    var message = err.message || "something went wrong";
    res.status(status).send({
        status: status,
        message: message
    });
});
var httpServer = http_1["default"].createServer(server);
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 6060;
httpServer.listen(PORT, function () {
    return console.log("The server is running on port " + PORT);
});
