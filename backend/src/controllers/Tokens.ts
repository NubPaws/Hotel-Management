import { NextFunction, Request, Response, Router } from "express";
import Users from "../models/Users.js";
import { dataValidate } from "./Validator.js";

const router = Router();

/**
 * @swagger
 * /api/Tokens/:
 *   post:
 *     summary: Post username and password for a jwt token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         type: string
 *         description: JWT token for the user to authenticate with in front of the api.
 *       '404':
 *         description: User was not found.
 */
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
