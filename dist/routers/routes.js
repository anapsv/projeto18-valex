import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
var router = Router();
router.use(cardsRouter);
export default router;
