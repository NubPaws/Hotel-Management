import express, { Request, Response } from "express";
import cors from "cors";
import { loadDatabase } from "./models/DatabaseConnector.js";
import environment from "./utils/environment.js";
import logger from "./utils/logger.js";
import { TokensRouter } from "./controllers/Tokens.js";
import SwaggerUI from 'swagger-ui-express';
import SwaggerSpecs from "./swagger.js";
import { UsersRouter } from "./controllers/Users.js";

const app = express();
const port = environment.port;

// Connect to the database.
loadDatabase();

// Allow Cross Origin Resource Sharing (cors).
app.use(cors());

// Middleware to handle loading data from the body of a request.
app.use((req, res, next) => {
    if (req.headers["content-type"] !== "application/json") {
        next();
        return;
    }
    try {
        req.body = JSON.parse(req.body);
    } catch (err) {
        req.body = {};
    }
    next();
});

// Load the routes.
app.use("/api/Tokens", TokensRouter);
app.use("/api/Users", UsersRouter);

app.get('/', (req: Request, res: Response)=>{
    res.status(200);
    res.send("Main page<br>Another line to test");
});

// Serve SwaggerUI.
app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(SwaggerSpecs));

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});
