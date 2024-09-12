import { NextFunction, Request, Response, Router } from "express";
import UserModel, { InvalidUserCredentialsError, UserPayload, UserRole } from "../models/Users.js";
import { dataValidate } from "./Validator.js";

const router = Router();

function tokenRequired(res: Response) {
	return res.status(403).send("Token required");
}

/**
 * @swagger
 * /api/Users/initUsers:
 *   get:
 *     summary: Initializes the users database with the first admin.
 *     description:
 *       Creates a default admin. This api endpoint should be called once when the
 *       system is deployed and the admin's password should be changed.
 *       Calling this API endpoint more than once will not do anything.
 *     responses:
 *       200:
 *         description:
 *           This endpoint always returns a 200 error unless an internal server
 *           has occured.
 *     tags:
 *       - Users
 */
router.get("/initUsers", async (req: Request, res: Response) => {
	const created = await UserModel.initUsersModel();
	if (created) {
		res.send("Successfully initialized user model.");
	} else {
		res.send("Failed initializeding user model.");
	}
});

/**
 * @swagger
 * /api/Users/{username}:
 *   get:
 *     summary: Retrieve user information by username.
 *     security:
 *       - bearerAuth: []
 *     description:
 *       This endpoint retrieves user information based on the provided username.
 *       It requires a valid JWT token in the authorization header.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description:
 *           The username of the user to retrieve.
 *     responses:
 *       200:
 *         description: A successful response with user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                 pass:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [Admin, User]
 *       401:
 *         description: Unauthorized request. Occurs when the requesting user is not authorized to view the data.
 *       403:
 *         description: Forbidden. Occurs when the authorization token is missing or invalid.
 *       404:
 *         description: User not found.
 *     tags:
 *       - Users
 */
router.get("/:username", async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		return tokenRequired(res);
	}
	
	const token = req.headers.authorization.split(" ")[1] as string;
	try {
		const payload = UserModel.getJwtPayload(token) ;
		const requestingUser = await UserModel.getUser(payload.user);
		
		if (req.params.username === requestingUser.user || requestingUser.role == UserRole.Admin) {
			const user = await UserModel.getUser(req.params.username);
			res.json(user);
		}
		throw new InvalidUserCredentialsError();
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Users/create:
 *   post:
 *     summary: Creates a user and returns a JWT token.
 *     description: This endpoint allows you to create a new user by providing a username,
 *       password, and an authorization token. It returns a JWT token upon success.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: username
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: User created successfully and returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: jwtToken
 */ 
router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		return tokenRequired(res);
	}
	
	const token = req.headers.authorization.split(" ")[1] as string;
	
	const { username, password } = req.body;
	const validation = dataValidate({username, password});
	
	if (!validation.status) {
		return validation.respond(res);
	}
	
	try {
		const jwtToken = await UserModel.createUser(username, password, token);
		
		res.send(jwtToken);
	} catch (err) {
		next(err);
	}
});

export const UsersRouter = router;
