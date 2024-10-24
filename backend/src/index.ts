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
import { GuestsRouter } from "./controllers/Guest.js";
import { ReservationsRouter } from "./controllers/Reservation.js";
import { ExtrasRouter } from "./controllers/Extra.js";
import { TasksRouter } from "./controllers/Task.js";
import { CountersRouter } from "./controllers/Counter.js";
import { BackOfficeRouter } from "./controllers/BackOffice.js";

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

// Middleware to notify about routes accessed.
app.use((req, _res, next) => {
    const { method, url, params, query, body } = req;
    
    let logMessage = `${method} ${url}`;
    
    
    if (params && Object.keys(params).length > 0) {
        logMessage += `\nParams: ${JSON.stringify(params, null, 2)}`;
    }
    
    if (query && Object.keys(query).length > 0) {
        logMessage += `\nQuery: ${JSON.stringify(query, null, 2)}`;
    }
    
    if (body && Object.keys(body).length > 0) {
        logMessage += `\nBody: ${JSON.stringify(body, null, 2)}`;
    }
    
    Logger.log("request", logMessage);
    next();
});

// Load the routes.
app.use("/api/Users", UsersRouter);
app.use("/api/Rooms", RoomsRouter);
app.use("/api/Guests", GuestsRouter);
app.use("/api/Reservations", ReservationsRouter);
app.use("/api/Extras", ExtrasRouter);
app.use("/api/Tasks", TasksRouter);
app.use("/api/Counters", CountersRouter);
app.use("/api/BackOffice", BackOfficeRouter);

// Error handling middleware.
app.use(ErrorHandler.users);
app.use(ErrorHandler.rooms);
app.use(ErrorHandler.guests);
app.use(ErrorHandler.reservations);
app.use(ErrorHandler.extras);
app.use(ErrorHandler.tasks);
app.use(ErrorHandler.counters);
app.use(ErrorHandler.backOffice);

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
