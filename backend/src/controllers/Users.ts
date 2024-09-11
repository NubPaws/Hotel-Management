import { Request, Response, Router } from "express";
import UserModel, { UserPayload, UserRole } from "../models/Users.js";

const router = Router();

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
 *       - User
 */
router.get("/initUsers", async (req: Request, res: Response) => {
	const created = await UserModel.initUsersModel();
	if (created) {
		res.send("Successfully initialized user model.");
	} else {
		res.send("Failed initializeding user model.");
	}
})

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
 *       - User
 */
router.get("/:username", async (req: Request, res: Response) => {
	if (!req.headers.authorization) {
		res.status(403).send("Token required");
		return;
	}
	
	const token = req.headers.authorization.split(" ")[1] as string;
	const payload = UserModel.getJwtPayload(token);
	if (!payload) {
		return res.status(403).send("Invalid token.");
	}
	
	const requestingUser = await UserModel.getUser(payload.user);
	if (!requestingUser) {
		return res.status(401).send("Requesting user token is invalid.");
	}
	
	if (req.params.username === requestingUser.user || requestingUser.role == UserRole.Admin) {
		const user = await UserModel.getUser(req.params.username);
		res.json(user);
	} else {
		res.status(401).send("Requesting user is unauthorized.");
	}
	
});

export const UsersRouter = router;
