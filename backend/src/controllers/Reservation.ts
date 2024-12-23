import { Router } from "express";
import { AuthedRequest, dataValidate, verifyUser } from "./Validator.js";
import { UnauthorizedUserError } from "../models/User.js";
import { StatusCode } from "../utils/StatusCode.js";
import ReservationModel, { InvalidPricesArrayError, Reservation, ReservationState } from "../models/Reservation.js";
import Logger from "../utils/Logger.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Endpoints for managing reservations.
 */

/**
 * @swagger
 * /api/Reservations/create:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       403:
 *         description: Unauthorized, requires front desk or admin
 */
router.post("/create", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const {
		guest, comment, startDate, startTime, nightCount,
		endTime, prices, roomType, guestName, email, phone,
	} = req.body;
	
	const validation = dataValidate({
		guest, comment, startDate, startTime, nightCount,
		endTime, prices, roomType, guestName, email, phone
	});
	if (validation.status) {
		return validation.respond(res);
	}
	
	if (!Array.isArray(prices)) {
		return next(new InvalidPricesArrayError());
	}
	
	try {
		const reservation = await ReservationModel.create(
			guest,
			comment,
			new Date(startDate),
			startTime,
			nightCount,
			endTime,
			prices,
			roomType,
			guestName,
			email,
			phone
		);
		
		res.status(StatusCode.Created).json(reservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/update:
 *   post:
 *     summary: Update specific fields of an existing reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: ID of the reservation to update
 *               comment:
 *                 type: string
 *                 description: Updated comment for the reservation
 *                 example: "Late check-in requested."
 *               email:
 *                 type: string
 *                 description: Updated email of the guest
 *                 example: "guest@example.com"
 *               phone:
 *                 type: string
 *                 description: Updated phone number of the guest
 *                 example: "+972 50 555 5555"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Updated start date of the reservation
 *                 example: "2024-11-01T00:00:00.000Z"
 *               startTime:
 *                 type: string
 *                 description: Updated start time of the reservation (HH:mm)
 *                 example: "15:00"
 *               endTime:
 *                 type: string
 *                 description: Updated end time of the reservation (HH:mm)
 *                 example: "12:00"
 *               roomType:
 *                 type: string
 *                 description: Updated room type for the reservation
 *                 example: "Deluxe"
 *               prices:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Updated prices for each night of the stay
 *                 example: [100, 120, 150]
 *               room:
 *                 type: integer
 *                 description: Room ID assigned to the reservation
 *                 example: 101
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input or missing required fields
 *       403:
 *         description: Unauthorized, requires front desk or admin
 */
router.post("/update", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const {
		reservationId, comment, email, phone, startDate, startTime, endTime, roomType, prices, room
	} = req.body;
	
	const updates: Partial<Reservation> = {
		comment,
		email,
		phone,
		startDate: startDate ? new Date(startDate) : undefined,
		startTime,
		endTime,
		roomType,
		room,
	};
	
	try {
		await ReservationModel.update(reservationId, updates);
		
		// Update prices individually if provided.
		if (prices && Array.isArray(prices)) {
			prices.forEach((price, night) => {
				ReservationModel.setPrice(reservationId, night, price);
			});
		}
		
		const updatedReservation = await ReservationModel.getById(reservationId);
		res.status(StatusCode.Ok).json(updatedReservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/set-nights:
 *   post:
 *     summary: Set the number of nights for a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: The ID of the reservation to update
 *               nightCount:
 *                 type: integer
 *                 description: The new number of nights for the reservation
 *               prices:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Prices for each night
 *     responses:
 *       200:
 *         description: Number of nights updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 */
router.post("/set-nights", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { reservationId, nightCount, prices } = req.body;
	
	if (!reservationId || !nightCount || !prices || prices.length !== nightCount) {
		return res.status(StatusCode.BadRequest).json({
			message: "Reservation ID, nightCount, and matching prices array are required."
		});
	}
	
	try {
		const updatedReservation = await ReservationModel.setNightCount(reservationId, nightCount, prices);
		res.status(StatusCode.Ok).json(updatedReservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/add-extra:
 *   post:
 *     summary: Add an extra to a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: The reservation ID
 *               item:
 *                 type: string
 *                 description: The name of the extra (e.g., breakfast)
 *               price:
 *                 type: number
 *                 description: Price of the extra
 *               description:
 *                 type: string
 *                 description: Description of the extra
 *     responses:
 *       200:
 *         description: Extra added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Extra'
 *       400:
 *         description: Invalid input
 */
router.post("/add-extra", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk, isFoodBeverage } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk && !isFoodBeverage) {
		return next(new UnauthorizedUserError());
	}
	
	const { reservationId, item, price, description } = req.body;
	
	if (!reservationId || !item || !price) {
		return res.status(StatusCode.BadRequest).json({
			message: "Reservation id, item, and price must be passed."
		});
	}
	
	try {
		const extra = await ReservationModel.addExtra(reservationId, item, price, description);
		res.status(StatusCode.Ok).json(extra);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/remove-extra:
 *   post:
 *     summary: Remove an extra from a reservation and delete it
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: ID of the reservation to update
 *               extraId:
 *                 type: integer
 *                 description: ID of the extra to remove and delete
 *     responses:
 *       200:
 *         description: Extra removed and deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input or missing required fields
 *       403:
 *         description: Unauthorized, requires front desk or admin
 */
router.post("/remove-extra", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk, isFoodBeverage } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk && !isFoodBeverage) {
		return next(new UnauthorizedUserError());
	}
	
	const { reservationId, extraId } = req.body;
	
	const validate = dataValidate({ reservationId, extraId });
	if (validate.status) {
		return validate.respond(res);
	}
	
	try {
		const reservation = await ReservationModel.removeExtra(reservationId, extraId);
		
		res.status(StatusCode.Ok).json(reservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/cancel:
 *   post:
 *     summary: Cancel an existing reservation by setting its state to "Cancelled"
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: ID of the reservation to cancel
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *       400:
 *         description: Invalid input or missing required fields
 *       403:
 *         description: Unauthorized, requires admin or front desk
 *       404:
 *         description: Reservation not found
 */
router.post("/cancel", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { reservationId } = req.body;
	const validation = dataValidate({ reservationId });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const reservation = await ReservationModel.setState(reservationId, ReservationState.Cancelled);
		res.status(StatusCode.Ok).json(reservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/query:
 *   get:
 *     summary: Query reservations by guest identification, room, date range, email, phone, or guest name
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: guestIdentification
 *         schema:
 *           type: string
 *         description: Guest identification number
 *       - in: query
 *         name: room
 *         schema:
 *           type: integer
 *         description: Room number
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the reservation range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the reservation range
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Guest email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Guest phone number
 *       - in: query
 *         name: guestName
 *         schema:
 *           type: string
 *         description: Guest name
 *     responses:
 *       200:
 *         description: List of matching reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input or query parameters
 */
router.get("/query", verifyUser, async (req, res, next) => {
	const {
		guestIdentification, room, startDate, endDate, email, phone, guestName
	} = req.query;
	
	const validate = dataValidate({
		guestIdentification, room, startDate, endDate, email, phone, guestName
	});
	if (validate.status) {
		return validate.respond(res);
	}
	
	try {
		const reservations = await ReservationModel.query(
			guestIdentification ? String(guestIdentification) : undefined,
			room                ? Number(room)                : undefined,
			startDate           ? String(startDate)           : undefined,
			endDate             ? String(endDate)             : undefined,
			email               ? String(email)               : undefined,
			phone               ? String(phone)               : undefined,
			guestName           ? String(guestName)           : undefined
		);
		
		res.status(StatusCode.Ok).json(reservations);
	} catch (error) {
		next(error);
	}
	
});

/**
 * @swagger
 * /api/Reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The reservation ID
 *     responses:
 *       200:
 *         description: Reservation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       403:
 *         description: Unauthorized, requires front desk or admin
 *       404:
 *         description: Reservation not found
 */
router.get("/:id", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}

	const { id } = req.params;

	if (!id || isNaN(Number(id))) {
		return res.status(StatusCode.BadRequest).json({
			message: "Invalid reservation ID"
		});
	}

	try {
		const reservation = await ReservationModel.getById(Number(id));
		if (!reservation) {
			return res.status(StatusCode.NotFound).json({
				message: "Reservation not found"
			});
		}
		res.status(StatusCode.Ok).json(reservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/checkin:
 *   post:
 *     summary: Check in a guest by updating the reservation state to "Active"
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: ID of the reservation to check in
 *     responses:
 *       200:
 *         description: Reservation state updated to "Active"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input or missing required fields
 *       403:
 *         description: Unauthorized, requires front desk or admin
 *       404:
 *         description: Reservation not found
 */
router.post("/checkin", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}

	const { reservationId } = req.body;

	const validation = dataValidate({ reservationId });
	if (validation.status) {
		return validation.respond(res);
	}

	try {
		// Retrieve the reservation
		const reservation = await ReservationModel.getById(Number(reservationId));
		if (!reservation) {
			return res.status(StatusCode.NotFound).json({
				message: "Reservation not found"
			});
		}

		// Ensure the reservation is in a state that allows check-in
		if (reservation.state !== ReservationState.Arriving) {
			return res.status(StatusCode.BadRequest).json({
				message: `Cannot check in a reservation in state: ${reservation.state}`
			});
		}

		// Update the state to "Active"
		const updatedReservation = await ReservationModel.setState(reservationId, ReservationState.Active);

		res.status(StatusCode.Ok).json(updatedReservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/checkout:
 *   post:
 *     summary: Check out a guest by updating the reservation state to "Completed"
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: ID of the reservation to check out
 *     responses:
 *       200:
 *         description: Reservation state updated to "Completed"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input or missing required fields
 *       403:
 *         description: Unauthorized, requires front desk or admin
 *       404:
 *         description: Reservation not found
 */
router.post("/checkout", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { reservationId } = req.body;
	
	const validation = dataValidate({ reservationId });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		// Retrieve the reservation
		const reservation = await ReservationModel.getById(Number(reservationId));
		if (!reservation) {
			return res.status(StatusCode.NotFound).json({
				message: "Reservation not found"
			});
		}
		
		// Ensure the reservation is in a state that allows checkout
		if (reservation.state !== ReservationState.Active && reservation.state !== ReservationState.Departing) {
			return res.status(StatusCode.BadRequest).json({
				message: `Cannot check out a reservation in state: ${reservation.state}`
			});
		}
		
		// Update the state to "Completed"
		const updatedReservation = await ReservationModel.setState(reservationId, ReservationState.Passed);
		
		res.status(StatusCode.Ok).json(updatedReservation);
	} catch (error) {
		next(error);
	}
});

export const ReservationsRouter = router;
