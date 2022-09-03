import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {

    const employeeId : number = Number(req.body.employeeId);
    const {type} = req.body;
    const xapikey = req.headers['x-api-key'];

    const data = await cardService.createCard(xapikey, employeeId, type);

    return res.status(201).send(data);
    
}