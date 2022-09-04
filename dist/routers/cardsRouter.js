import { Router } from "express";
import { createCard } from "../controllers/cardController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import cardSchemaValidator from "../middlewares/cardSchemaValidator.js";
var cardsRouter = Router();
cardsRouter.post("/createcard", validateSchema(cardSchemaValidator), createCard);
export default cardsRouter;
