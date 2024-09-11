import { Request, Response, Router } from "express";
import UserModel, { UserPayload, UserRole } from "../models/Users.js";

const router = Router();

/**
 * @swagger
 * /api/Users/{username}:
 *   get:
 *     summary: Retrieve user information by username.
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
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer <JWT>"
 *         description: Bearer token for authorization.
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
 *     security:
 *       - bearerAuth: []
 */
router.get("/:username", async (req: Request, res: Response) => {
	if (!req.headers.authorization) {
		res.status(403).send("Token required");
		return;
	}
	
	const token = req.headers.authorization.split(" ")[1] as string;
	const payload = UserModel.getJwtPayload(token);
	if (!payload) {
		res.status(403).send("Invalid token.");
		return;
	}
	
	const requestingUser = await UserModel.getUser(payload.user);
	if (!requestingUser) {
		res.status(401).send("Requesting user token is invalid.");
		return;
	}
	
	if (req.params.username === requestingUser.user || requestingUser.role == UserRole.Admin) {
		const user = await UserModel.getUser(req.params.username);
		res.json(user);
	} else {
		res.status(401).send("Requesting user is unauthorized.");
	}
	
});

export const UsersRouter = router;
