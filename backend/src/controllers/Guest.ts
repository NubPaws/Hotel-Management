import { Router } from "express";
import { AuthedRequest, dataValidate, verifyUser } from "./Validator.js";
import GuestModel, { InvalidGuestCredentialsError } from "../models/Guest.js";
import { StatusCode } from "../utils/StatusCode.js";
import { UnauthorizedUserError, UserRole } from "../models/User.js";

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
router.post("/create", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
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
router.post("/update", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		throw new UnauthorizedUserError();
	}
	
	const { guestId, fullName, email, phone } = req.body;
	
	// Validate that guestId is present
	const validation = dataValidate({ guestId });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		await GuestModel.getById(guestId);
		
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

/**
 * @swagger
 * /api/Guests/add-reservation:
 *   post:
 *     summary: Add a reservation to a guest
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
 *                 description: The guest's ID
 *               reservationId:
 *                 type: number
 *                 description: The reservation ID to be added
 *     responses:
 *       200:
 *         description: Reservation added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Guest not found
 */
router.post("/add-reservation", async (req, res, next) => {
	const { guestId, reservationId } = req.body;
	
	const validation = dataValidate({ guestId, reservationId });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const updatedGuest = await GuestModel.addReservation(guestId, reservationId);
		
		res.status(StatusCode.Ok).json({
			message: "Reservation added successfully",
			guest: updatedGuest
		});
	} catch (err: any) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Guests/search:
 *   get:
 *     summary: Search for guests by partial fields (email, id, reservationId, phone, name)
 *     tags: [Guests]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Partial email to search for
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Partial ID (identification) to search for
 *       - in: query
 *         name: reservationId
 *         schema:
 *           type: number
 *         description: Reservation ID to search for
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Partial phone number to search for
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial full name to search for
 *     responses:
 *       200:
 *         description: A list of matching guests
 *       400:
 *         description: Failed to perform the guest search
 */
router.get("/search", verifyUser, async (req, res, next) => {
	const { email, id, reservationId, phone, fullName } = req.query;
	
	try {
		const guests = await GuestModel.query(id, fullName, email, phone, reservationId);
		
		res.status(StatusCode.Ok).json(guests);
	} catch (err: any) {
		next(err);
	}
});  

export const GuestsRouter = router;
