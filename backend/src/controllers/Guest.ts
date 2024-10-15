import { NextFunction, Request, Response, Router } from "express";
import { AuthedRequest, dataValidate, verifyUser } from "./Validator.js";
import { isEmailString } from "../utils/Email.js";
import GuestModel, { InvalidGuestCredentialsError } from "../models/Guest.js";
import { StatusCode } from "../utils/StatusCode.js";
import { Department, InvalidUserCredentialsError, UnauthorizedUserError, UserRole } from "../models/User.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Guests
 *   description: Endpoints for managing hotel guests.
 */

/**
 * @swagger
 * /api/Guests/create:
 *   post:
 *     summary: Create a new guest
 *     tags: [Guests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identification:
 *                 type: string
 *                 description: Guest's ID for identification (unique)
 *                 example: "ID123456789"
 *               fullName:
 *                 type: string
 *                 description: The full name of the guest
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Guest's email
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 description: Guest's phone number
 *                 example: "+972 50 123 4567"
 *               title:
 *                 type: string
 *                 description: Title of the guest (e.g., Mr., Mrs.)
 *                 example: "Mr."
 *     responses:
 *       201:
 *         description: Guest created successfully
 *       400:
 *         description: Invalid input or missing required fields
 *       409:
 *         description: Guest already exists
 */
router.post("/create", verifyUser, async (req: Request, res: Response, next: NextFunction) => {
	const { user }= req as AuthedRequest;
	if (user.role !== UserRole.Admin && user.department !== Department.FrontDesk) {
		throw new UnauthorizedUserError();
	}
	
	const { identification, fullName, email, phone, title = "" } = req.body;
	
	// Validate required fields: identification and fullName must be present
	const validation = dataValidate({ identification, fullName });
	if (validation.status) {
		return validation.respond(res);
	}
	
	// Ensure that at least phone or email is provided
	if (!email && !phone) {
		return next(new InvalidGuestCredentialsError("Either email or phone must be provided."));
	}
	
	try {
		// Create the guest using the GuestModel
		const guest = await GuestModel.create(identification, fullName, email, phone, title);
		
		res.status(StatusCode.Created).json(guest);
	} catch (err: any) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Guests/update:
 *   post:
 *     summary: Update guest information
 *     tags: [Guests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestId:
 *                 type: number
 *                 description: The ID of the guest to update
 *                 example: 12345
 *               fullName:
 *                 type: string
 *                 description: Updated full name of the guest
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Updated email of the guest
 *                 example: "johndoe@example.com"
 *               phone:
 *                 type: string
 *                 description: Updated phone number of the guest
 *                 example: "+1-800-555-1234"
 *     responses:
 *       200:
 *         description: Guest updated successfully
 *       400:
 *         description: Invalid input or missing required fields
 *       404:
 *         description: Guest not found
 */
router.post("/update", verifyUser, async (req: Request, res: Response, next: NextFunction) => {
	const { user }= req as AuthedRequest;
	if (user.role !== UserRole.Admin && user.department !== Department.FrontDesk) {
		throw new UnauthorizedUserError();
	}
	
	const { guestId, fullName, email, phone } = req.body;
	
	// Validate that guestId is present
	const validation = dataValidate({ guestId });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const guest = await GuestModel.getById(guestId);
		
		// Update the guest's information if fields are provided
		if (fullName) {
			await GuestModel.setName(guestId, fullName);
		}
		if (email) {
			await GuestModel.setEmail(guestId, email);
		}
		if (phone) {
			await GuestModel.setPhone(guestId, phone);
		}
		
		const updatedGuest = await GuestModel.getById(guestId);
		
		res.status(StatusCode.Ok).json(updatedGuest);
	} catch (err: any) {
		next(err);
	}
});

export const GuestsRouter = router;
