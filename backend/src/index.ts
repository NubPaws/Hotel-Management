import express, { Request, Response } from "express";
import { loadDatabase } from "./models/DatabaseConnector.js";
import environment from "./utils/environment.js";
import logger from "./utils/logger.js";

const app = express();
const port = environment.port;

// Connect to the database.
loadDatabase();

app.get('/', (req: Request, res: Response)=>{
    res.status(200);
    res.send("Main page<br>Another line to test");
});

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});
