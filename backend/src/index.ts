import cors from "cors";
import express, { Request, Response } from "express";
import SwaggerUI from 'swagger-ui-express';
import ErrorHandler from "./controllers/ErrorHandler.js";
import { UsersRouter } from "./controllers/User.js";
import { SwaggerSpecs, SwaggerUiOptions } from "./swagger.js";
import { loadDatabase } from "./utils/DatabaseConnector.js";
import Environment from "./utils/Environment.js";
import Logger from "./utils/Logger.js";
import { RoomsRouter } from "./controllers/Room.js";

const app = express();
const port = Environment.port;

// Connect to the database.
loadDatabase();

// Allow Cross Origin Resource Sharing (cors).
app.use(cors());

// Middleware to handle content-type: application/json.
app.use(express.json());
// Middleware to handle content-type: text/plain.
app.use(express.text({ type: "text/*" }));
// Middleware to handle anything that wasn't catched by the previous middlewares.
app.use((req, res, next) => {
    const contentType = req.headers["content-type"];
    
    if (contentType && contentType.startsWith("application/json")) {
        if (typeof req.body !== "object") {
            Logger.error("Invaild json body has been sent.");
            return res.status(400).json({ error: "Invalid JSON body" });
        }
    }
    
    if (contentType && contentType.startsWith("text/")) {
        if (typeof req.body !== "string") {
            Logger.error("Invaild text body has been sent.");
            return res.status(400).json({ error: "Invalid text body"});
        }
    }
    
    next();
});

// Load the routes.
app.use("/api/Users", UsersRouter);
app.use("/api/Rooms", RoomsRouter);

// Error handling middleware.
app.use(ErrorHandler.users);
app.use(ErrorHandler.rooms);

app.get('/', (_req: Request, res: Response) => {
    res.status(200);
    res.send("Main page<br>Another line to test");
});

// Serve SwaggerUI.
app.use(
    Environment.swaggerDir,
    SwaggerUI.serve,
    SwaggerUI.setup(SwaggerSpecs, SwaggerUiOptions)
);

app.listen(port, () => {
    Logger.info(`Server is running at http://localhost:${port}`);
    Logger.info(`API Docs served at http://localhost:${port}${Environment.swaggerDir}`)
});
