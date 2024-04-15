import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { loadDatabase } from "./models/DatabaseConnector.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Connect to the database.
const ipDatabase = process.env.MONGO_DB_IP || "localhost";
const portDatabase = process.env.MONGO_DB_PORT || "27017";
await loadDatabase(ipDatabase, portDatabase);

app.get('/', (req: Request, res: Response)=>{
    res.status(200);
    res.send("Main page<br>Another line to test");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});