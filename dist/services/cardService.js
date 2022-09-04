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
import * as cardRepository from '../repositories/cardRepository.js';
import * as companyRepository from '../repositories/companyRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import Cryptr from "cryptr";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
dotenv.config();
export function createCard(apiKey, employeeId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var company, employee, cardNumber, cardholderName, expirationDate, securityCode, newCardData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, validateApiKey(apiKey)];
                case 1:
                    company = _a.sent();
                    return [4 /*yield*/, validateEmployee(employeeId, company.id)];
                case 2:
                    employee = _a.sent();
                    return [4 /*yield*/, validateCardType(type, employee.id)];
                case 3:
                    _a.sent();
                    cardNumber = faker.finance.creditCardNumber();
                    cardholderName = generateName(employee.fullName);
                    expirationDate = dayjs().add(5, "year").format("MM/YY");
                    securityCode = generateCVV();
                    newCardData = {
                        employeeId: employeeId,
                        number: cardNumber,
                        cardholderName: cardholderName,
                        securityCode: securityCode.encryptedCVV,
                        expirationDate: expirationDate,
                        isVirtual: false,
                        isBlocked: false,
                        type: type
                    };
                    return [4 /*yield*/, cardRepository.insert(newCardData)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, { number: cardNumber, cardholderName: cardholderName, expirationDate: expirationDate, securityCode: securityCode.CVV }];
            }
        });
    });
}
function validateApiKey(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var company;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, companyRepository.findByApiKey(apiKey)];
                case 1:
                    company = _a.sent();
                    if (!company)
                        throw { type: "unauthorized_error", message: "API Key not valid" };
                    return [2 /*return*/, company];
            }
        });
    });
}
function validateEmployee(employeeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var employee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, employeeRepository.findById(employeeId)];
                case 1:
                    employee = _a.sent();
                    if (!employee)
                        throw { type: "notfound_error", message: "User not registered" };
                    if (employee.companyId !== companyId)
                        throw { type: "unauthorized_error", message: "User is not an employee at this company" };
                    return [2 /*return*/, employee];
            }
        });
    });
}
function validateCardType(type, employeeId) {
    return __awaiter(this, void 0, void 0, function () {
        var validation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findByTypeAndEmployeeId(type, employeeId)];
                case 1:
                    validation = _a.sent();
                    if (validation)
                        throw { type: "unauthorized_error", message: "Employee already owns this type of card" };
                    return [2 /*return*/, validation];
            }
        });
    });
}
function generateName(name) {
    var cardName = name.toUpperCase().split(" ").filter(function (name) { return name.length >= 3; });
    for (var i = 1; i < cardName.length - 1; i++) {
        cardName[i] = cardName[i][0];
    }
    return cardName.join(" ");
}
function generateCVV() {
    var cryptr = new Cryptr(process.env.SECRET_KEY);
    var CVV = faker.finance.creditCardCVV();
    var encryptedCVV = cryptr.encrypt(CVV);
    return { CVV: CVV, encryptedCVV: encryptedCVV };
}
