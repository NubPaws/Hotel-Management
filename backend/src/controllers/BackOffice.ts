import { Router } from "express";
import { AuthedRequest, verifyUser } from "./Validator.js";
import { UnauthorizedUserError } from "../models/User.js";
import BackOffice from "../models/BackOffice.js";
import { StatusCode } from "../utils/StatusCode.js";
import Logger from "../utils/Logger.js";

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
 *       - bearerAuth: []
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
 *       500:
 *         description: Internal server error
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

/**
 * @swagger
 * /api/BackOffice/get-system-information:
 *   get:
 *     summary: Retrieve system information
 *     description:
 *       Fetches the current system date and occupancy details, including the number of active reservations,
 *       arrivals, and departures. This endpoint is accessible to all authenticated users.
 *     tags:
 *       - BackOffice
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 systemDate:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: The system date in [day, month, year] format.
 *                   example: [25, 11, 2024]
 *                 occupancy:
 *                   type: object
 *                   properties:
 *                     occupancy:
 *                       type: integer
 *                       description: Number of active reservations.
 *                       example: 25
 *                     arrivals:
 *                       type: integer
 *                       description: Number of reservations with the "Arriving" state.
 *                       example: 10
 *                     departures:
 *                       type: integer
 *                       description: Number of reservations with the "Departing" state.
 *                       example: 8
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       500:
 *         description: Internal server error
 */
router.get("/get-system-information", verifyUser, async (req, res, next) => {
	try {
		const [systemDate, occupancy] = await Promise.all([
			BackOffice.getSystemDate(),
			BackOffice.getOccupancy()
		]);
		
		res.status(StatusCode.Ok).json({
			systemDate,
			occupancy
		});
	} catch (error) {
		next(error);
	}
});

export const BackOfficeRouter = router;
