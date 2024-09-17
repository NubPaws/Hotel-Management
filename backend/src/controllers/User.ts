import { NextFunction, Request, Response, Router } from "express";
import UsersModel, { CreatorIsNotAdminError, InvalidUserCredentialsError, UserDoesNotExistError, UserRole } from "../models/User.js";
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
	const created = await UsersModel.initUsersModel();
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
		const payload = UsersModel.getJwtPayload(token);
		const requestingUser = await UsersModel.getUser(payload.user);
		
		if (req.params.username === requestingUser.user || requestingUser.role == UserRole.Admin) {
			const user = await UsersModel.getUser(req.params.username);
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
 *       <br/>
 *       For the role, 0 means admin and 1 means user.
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
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: username
 *               password:
 *                 type: string
 *                 example: password
 *               role:
 *                 type: number
 *                 enum:
 *                   - 0
 *                   - 1
 *     responses:
 *       200:
 *         description: User created successfully and returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: jwtToken
 *       400:
 *         description: Invalid body inserted or invalid requester.
 *       401:
 *         description: Unauthorized requester.
 */ 
router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		return tokenRequired(res);
	}
	const token = req.headers.authorization.split(" ")[1] as string;
	
	const { username, password, role } = req.body;
	const validation = dataValidate({ username, password, role });
	
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const jwtToken = await UsersModel.createUser(username, password, role as UserRole, token);
		
		res.send(jwtToken);
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Users/change-password:
 *   post:
 *     summary: Changes a user's password.
 *     description: This endpoint changes a user's password.
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
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               username:
 *                 type: string
 *                 example: username
 *               password:
 *                 type: string
 *                 example: old_password
 *               role:
 *                 type: string
 *                 example: new_password
 *     responses:
 *       200:
 *         description: User's password changed successfully and returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: jwtToken
 *       400:
 *         description: Invalid body inserted or invalid requester.
 *       401:
 *         description: Unauthorized requester.
 */
router.post("/change-password", async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		return tokenRequired(res);
	}
	
	const token = req.headers.authorization.split(" ")[1] as string;
	
	const { username, oldPassword, newPassword } = req.body;
	const validation = dataValidate({ username, oldPassword, newPassword });
	
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		// Validate old password.
		const auth = await UsersModel.authenticate(username, oldPassword);
		
		if (auth !== token) {
			throw new UserDoesNotExistError();
		}
		
		// Change password.
		await UsersModel.changePassword(username, newPassword);
		const newJwt = await UsersModel.authenticate(username, newPassword);
		res.send(newJwt);
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Users/change-role:
 *   post:
 *     summary: Changes a user's role.
 *     description: This endpoint changes a user's role.
 *       <br/>
 *       For the role, 0 means admin and 1 means user.
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
 *               - newRole
 *             properties:
 *               username:
 *                 type: string
 *                 example: username
 *               newRole:
 *                 type: number
 *                 example: 0
 *     responses:
 *       200:
 *         description: User's role changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: jwtToken
 *       400:
 *         description: Invalid body inserted or invalid requester.
 *       401:
 *         description: Unauthorized requester.
 */
router.post("/change-password", async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		return tokenRequired(res);
	}
	
	const token = req.headers.authorization.split(" ")[1] as string;
	
	const { username, newRole } = req.body;
	const validation = dataValidate({ username, newRole });
	
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const payload = await UsersModel.getJwtPayload(token);
		const isAdmin = await UsersModel.isAdmin(payload.user);
		if (!isAdmin) {
			throw new CreatorIsNotAdminError();
		}
		
		// Change role.
		await UsersModel.changeRole(username, newRole);
		res.send("Success");
	} catch (err) {
		next(err);
	}
});

export const UsersRouter = router;
