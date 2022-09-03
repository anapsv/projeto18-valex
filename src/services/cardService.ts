import * as cardRepository from '../repositories/cardRepository.js';
import * as companyRepository from '../repositories/companyRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import Cryptr from "cryptr";
import dotenv from "dotenv";
import {faker} from "@faker-js/faker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dotenv.config();

export async function createCard(apiKey: string | string[] | undefined, employeeId: number, type: cardRepository.TransactionTypes) {
    
    const company = await validateApiKey(apiKey);

    const employee = await validateEmployee(employeeId, company.id);

    await validateCardType(type, employee.id);

    const cardNumber = faker.finance.creditCardNumber();
    const cardholderName = generateName(employee.fullName);
    const expirationDate = dayjs().add(5, "year").format("MM/YY");
    const securityCode = generateCVV();

    const newCardData : cardRepository.CardInsertData = {
        employeeId,
        number: cardNumber,
        cardholderName,
        securityCode: securityCode.encryptedCVV,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type,
    }

    await cardRepository.insert(newCardData);

    return { number: cardNumber, cardholderName, expirationDate, securityCode: securityCode.CVV }

}

async function validateApiKey(apiKey: string | string[] | undefined) {
    
    const company = await companyRepository.findByApiKey(apiKey);

    if(!company) throw { type: "unauthorized_error", message: "API Key not valid" };

    return company;
}

async function validateEmployee(employeeId: number, companyId: number) {

    const employee = await employeeRepository.findById(employeeId);

    if(!employee) throw { type: "notfound_error", message: "User not registered" }

    if(employee.companyId !== companyId) throw { type: "unauthorized_error", message: "User is not an employee at this company" }

    return employee;
    
}

async function validateCardType(type: cardRepository.TransactionTypes, employeeId: number) {

    const validation = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

    if(validation) throw { type: "unauthorized_error", message: "Employee already owns this type of card" }

    return validation;
    
}

function generateName(name: string){

    let cardName = name.toUpperCase().split(" ").filter(name => name.length >= 3);

    for(let i = 1; i < cardName.length - 1; i++){
        cardName[i] = cardName[i][0];
    }

    return cardName.join(" ");

}

function generateCVV() {

    const cryptr = new Cryptr(process.env.SECRET_KEY);

    const CVV = faker.finance.creditCardCVV();

    const encryptedCVV = cryptr.encrypt(CVV);

    return { CVV, encryptedCVV };

}