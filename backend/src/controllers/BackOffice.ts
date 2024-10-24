import { Router } from "express";
import { AuthedRequest, verifyUser } from "./Validator.js";
import { UnauthorizedUserError } from "../models/User.js";
import BackOffice from "../models/BackOffice.js";
import { StatusCode } from "../utils/StatusCode.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: BackOffice
 *   description: Endpoints for managing the hotel as a whole. The back office.
 */

/**
 * @swagger
 * /api/BackOffice/end-of-day:
 *   post:
 *     summary: Run the End of Day procedure
 *     description:
 *       Executes the End of Day procedure to update reservation statuses
 *       and generate reports for previous days. Only accessible to users
 *       with Admin or Front Desk roles.
 *     tags:
 *       - BackOffice
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: End of day procedure succeeded
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "End of day procedure succeeded"
 *       401:
 *         description: Unauthorized. User does not have permission to run the End of Day procedure.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedUserError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalError'
 */
router.post("/end-of-day", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	try {
		await BackOffice.endOfDay();
		res.status(StatusCode.Ok).send("End of day procedure succeeded");
	} catch (error) {
		next(error);
	}
});

export const BackOfficeRouter = router;
