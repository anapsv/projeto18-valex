import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/routes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => 
    console.log("Server running on port " + process.env.PORT)
);