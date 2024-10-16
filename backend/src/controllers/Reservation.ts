import { Router } from "express";
import { AuthedRequest, verifyUser } from "./Validator.js";
import { UnauthorizedUserError } from "../models/User.js";
import { StatusCode } from "../utils/StatusCode.js";
import ReservationModel from "../models/Reservation.js";
import ExtraModel from "../models/Extra.js";

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
		guest, startDate, startTime, nightCount, endTime, prices, email, phone
	} = req.body;
	
	try {
		const reservation = await ReservationModel.create(
			guest,
			new Date(startDate),
			startTime,
			nightCount,
			endTime,
			prices,
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
 *               email:
 *                 type: string
 *                 description: Updated email of the guest
 *                 example: "guest@example.com"
 *               phone:
 *                 type: string
 *                 description: Updated phone number of the guest
 *                 example: "+1-555-555-5555"
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
		reservationId, email, phone, startDate, startTime, endTime, prices, room
	} = req.body;
	
	try {
		// Validate the reservation exists.
		await ReservationModel.getById(reservationId)
		
		const updatePromises = [];
		
		if (email) {
			updatePromises.push(ReservationModel.setEmail(reservationId, email));
		}
		if (phone) {
			updatePromises.push(ReservationModel.setPhone(reservationId, phone));
		}
		if (startDate) {
			updatePromises.push(ReservationModel.setStartDate(reservationId, new Date(startDate)));
		}
		if (startTime) {
			updatePromises.push(ReservationModel.setStartTime(reservationId, startTime));
		}
		if (endTime) {
			updatePromises.push(ReservationModel.setEndTime(reservationId, endTime));
		}
		if (prices && Array.isArray(prices)) {
			prices.forEach((price, night) => {
				updatePromises.push(ReservationModel.setPrice(reservationId, night, price));
			});
		}
		if (room) {
			updatePromises.push(ReservationModel.setRoom(reservationId, room));
		}
		
		await Promise.all(updatePromises);
		
		const updatedReservation = await ReservationModel.getById(reservationId);
		res.status(StatusCode.Ok).json(updatedReservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/add-nights:
 *   post:
 *     summary: Add nights to an existing reservation
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
 *               nights:
 *                 type: integer
 *                 description: How many nights to add
 *               prices:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Prices for each night of the stay
 *                 example: [100, 120, 150]
 *     responses:
 *       200:
 *         description: Night added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input
 */
router.post("/add-nights", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { reservationId, nights, prices } = req.body;
	
	if (!reservationId || !nights || !prices) {
		return res.status(StatusCode.BadRequest).json({
			message: "Reservation id, nights, and prices are required"
		});
	}
	
	try {
		const reservation = await ReservationModel.addNights(reservationId, nights, prices);
		res.status(StatusCode.Ok).json(reservation);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Reservations/remove-nights:
 *   post:
 *     summary: Remove the last night from a reservation
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
 *               nights:
 *                 type: integer
 *                 description: The amount of nights to remove from the end.
 *     responses:
 *       200:
 *         description: Night removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input
 */
router.post("/add-nights", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { reservationId, nights } = req.body;
	if (!reservationId || !nights) {
		return res.status(StatusCode.BadRequest).json({
			message: "Reservation id and nights are required"
		});
	}
	
	try {
		const reservation = await ReservationModel.removeNights(reservationId, nights);
		res.status(StatusCode.Ok).json(reservation);
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
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input
 */
router.post("/add-extra", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { reservationId, item, price, description } = req.body;
	
	if (!reservationId || !item || !price) {
		return res.status(StatusCode.BadRequest).json({
			message: "Reservation id, item, and price must be passed."
		});
	}
	
	try {
		const reservation = await ReservationModel.addExtra(reservationId, item, price, description);
		res.status(StatusCode.Ok).json(reservation);
	} catch (error) {
		next(error);
	}
});

export const ReservationsRouter = router;
