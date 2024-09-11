import { Request, Response, Router } from "express";
import Users from "../models/Users.js";
import { dataValidate } from "./Validator.js";
import logger from "../utils/logger.js";

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
router.post("/", async (req: Request, res: Response) => {
	// Take the information that should be passed from the app.
	const { username, password } = req.body;
	
	const validation = dataValidate({username, password});
	if (validation.status) {
		validation.respond(res);
		return;
	}
	
	try {
		// Get the token.
		const token = await Users.authenticate(username, password);
		// Send the token to the user.
		res.send(token);
	} catch (err) {
		res.status(404).send("User was not found");
	}
});

export const TokensRouter = router;
