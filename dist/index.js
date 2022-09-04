import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/routes.js";
import errorHandler from "./middlewares/errorHandler.js";
dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);
var PORT = process.env.PORT;
app.listen(PORT, function () {
    return console.log("Server running on port " + process.env.PORT);
});
