import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response)=>{
    res.status(200);
    res.send("Main page<br>Another line to test");
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});