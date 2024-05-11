import { NextFunction, Request, Response, Router } from "express";
import Users from "../models/Users.js";
import { dataValidate } from "./Validator.js";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
	// Take the information that should be passed from the app.
	const { username, password } = req.body;
	
	dataValidate({username, password}).respond(res);
	
	try {
		// Get the token.
		const token = await Users.authenticate(username, password);
		// Send the token to the user.
		res.send(token);
	} catch (err) {
		next(err);
	}
});

export const TokensRouter = router;
