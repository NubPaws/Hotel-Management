import { Router } from "express";
import UsersModel, { CreatorIsNotAdminError, Department, InvalidUserCredentialsError, UnauthorizedUserError, UserDoesNotExistError, UserRole } from "../models/User.js";
import { AuthedRequest, dataValidate, verifyUser } from "./Validator.js";

const router = Router();

/**
 * @swagger
 * /api/Users/login:
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
 *       200:
 *         type: string
 *         description: JWT token for the user to authenticate with in front of the api.
 *       404:
 *         description: User was not found.
 *     tags:
 *       - Users
 */
router.post("/login", async (req, res, next) => {
	// Take the information that should be passed from the app.
	const { username, password } = req.body;
	
	const validation = dataValidate({username, password});
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		// Get the token.
		const token = await UsersModel.authenticate(username, password);
		// Send the token to the user.
		res.send(token);
	} catch (err) {
		next(err);
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
 *                 department:
 *                   type: string
 *                   enum: [General, FrontDesk, HouseKeeping, Maintenance, Security, Conceirge]
 *       401:
 *         description: Unauthorized request. Occurs when the requesting user is not authorized to view the data.
 *       403:
 *         description: Forbidden. Occurs when the authorization token is missing or invalid.
 *       404:
 *         description: User not found.
 *     tags:
 *       - Users
 */
router.get("/:username", verifyUser, async (req, res, next) => {
	const requesting = (req as AuthedRequest).user;
	
	try {
		if (req.params.username === requesting.user || requesting.role == UserRole.Admin) {
			const user = await UsersModel.getUser(req.params.username);
			res.json(user);
		} else {
			throw new InvalidUserCredentialsError();
		}
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
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: username
 *               password:
 *                 type: string
 *                 example: password
 *               role:
 *                 type: string
 *                 enum: [Admin, User]
 *               department:
 *                   type: string
 *                   enum: [General, FrontDesk, HouseKeeping, Maintenance, Security, Conceirge]
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
 *       409:
 *         description: A user with that username already exists.
 */ 
router.post("/create", verifyUser, async (req, res, next) => {
	const { isAdmin } = req as AuthedRequest;
	if (!isAdmin) {
		return next(new UnauthorizedUserError());
	}
	
	const { username, password, role, department } = req.body;
	const validation = dataValidate({ username, password, role });
	
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const jwtToken = await UsersModel.createUser(
			username,
			password,
			role as UserRole,
			department as Department
		);
		
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
 *               old_password:
 *                 type: string
 *                 example: old_password
 *               new_password:
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
router.post("/change-password", verifyUser, async (req, res, next) => {
	const { username, oldPassword, newPassword } = req.body;
	
	const validation = dataValidate({ username, oldPassword, newPassword });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		// Validate old password.
		// This'll throw an error if the authentication fails
		await UsersModel.authenticate(username, oldPassword);
		
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
 *                 type: string
 *                 enum: [Admin, User]
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
router.post("/change-password", verifyUser, async (req, res, next) => {
	const { isAdmin } = req as AuthedRequest;
	if (!isAdmin) {
		return next(new CreatorIsNotAdminError());
	}
	
	const { username, newRole } = req.body;
	
	const validation = dataValidate({ username, newRole });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		// Change role.
		await UsersModel.changeRole(username, newRole);
		res.send("Success");
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Users/change-role:
 *   post:
 *     summary: Changes a user's role.
 *     description: This endpoint changes a user's role. For the role, Admin or User can be assigned.
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
 *                 type: string
 *                 enum: [Admin, User]
 *     responses:
 *       200:
 *         description: User's role changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Success
 *       400:
 *         description: Invalid body inserted or invalid requester.
 *       401:
 *         description: Unauthorized requester.
 *       403:
 *         description: Forbidden. Occurs when the authorization token is missing or invalid.
 *       404:
 *         description: User not found.
 */
router.post("/change-role", verifyUser, async (req, res, next) => {
	const { isAdmin } = req as AuthedRequest;
	if (!isAdmin) {
		return next(new CreatorIsNotAdminError());
	}
	
	const { username, newRole } = req.body;
	
	const validation = dataValidate({ username, newRole });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		await UsersModel.changeRole(username, newRole as UserRole);
		res.send("Success");
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Users/change-department:
 *   post:
 *     summary: Changes a user's department.
 *     description: This endpoint changes a user's department.
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
 *               - newDepartment
 *             properties:
 *               username:
 *                 type: string
 *                 example: username
 *               newDepartment:
 *                 type: string
 *                 enum: [General, FrontDesk, HouseKeeping, Maintenance, Security, Conceirge]
 *     responses:
 *       200:
 *         description: User's department changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Success
 *       400:
 *         description: Invalid body inserted or invalid requester.
 *       401:
 *         description: Unauthorized requester.
 *       403:
 *         description: Forbidden. Occurs when the authorization token is missing or invalid.
 *       404:
 *         description: User not found.
 */
router.post("/change-department", verifyUser, async (req, res, next) => {
	const { isAdmin } = req as AuthedRequest;
	if (!isAdmin) {
		return next(new CreatorIsNotAdminError());
	}
	
	const { username, newDepartment } = req.body;
	
	const validation = dataValidate({ username, newDepartment });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		await UsersModel.changeDepartment(username, newDepartment as Department);
		res.send("Success");
	} catch (err) {
		next(err);
	}
});

export const UsersRouter = router;
