import mongoose, { Schema } from "mongoose";
import Logger from "../utils/Logger.js";
import { addDaysToDate, getTodaysDate, isTime24String, numFromTime24, Time24 } from "../utils/Clock.js";
import CounterModel from "./Counter.js";
import RoomModel from "./Room.js";
import { isEmailString } from "../utils/Email.js";

export class ReservationNotFoundError extends Error {}
export class RoomIsAlreadyOccupiedAtThatTimeError extends Error {}
export class ReservationCreationError extends Error {}
export class ReservationDoesNotExistError extends Error {}
export class ReservationFetchingError extends Error {}
export class ReservationUpdateError extends Error {}

export enum ReservationState {
	Pending = "Pending",
	Active = "Active",
	Cancelled = "Cancelled",
	Passed = "Passed",
}

export interface Reservation extends Document {
	reservationId: number,
	reservationMade: Date,
	startDate: Date,
	startTime: Time24,
	nightCount: number,
	endTime: Time24,
	prices: number[],
	room: number | null,
	state: ReservationState,
	extras: number[],
	
	guest: number | null,
	email: string,
	phone: string,
}

const ReservationSchema = new Schema<Reservation>({
	reservationId: {
		type: Number,
		required: true,
		unique: true,
		index: true,
	},
	reservationMade: {
		type: Date,
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	startTime: {
		type: String,
		required: true,
		validate: {
			validator: (value: string) => isTime24String(value),
			message: "Invalid time format. Make sure it HH:mm (24 time format).",
		},
	},
	nightCount: {
		type: Number,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
		validate: {
			validator: (value: string) => isTime24String(value),
			message: "Invalid time format. Make sure it HH:mm (24 time format).",
		},
	},
	prices: [{
		type: Number,
		required: true,
	}],
	room: {
		type: Number,
		ref: "RoomModel",
		default: null,
	},
	state: {
		type: String,
		enum: Object.values(ReservationState),
		default: ReservationState.Pending,
	},
	extras: [{
		type: Number,
		ref: "ExtraModel",
	}],
	
	guest: {
		type: Number,
		ref: "GuestModel",
		required: true,
		index: true,
	},
	email: {
		type: String,
		required: true,
		validate: {
			validator: (value: string) => isEmailString(value),
			message: "Email format is invalid.",
		},
	},
	phone: {
		type: String,
		required: true,
	},
}, { _id: false });

const ReservationModel = mongoose.model<Reservation>("ReservationModel", ReservationSchema);

ReservationSchema.pre("save", async function (next) {
	const doc = this;
	if (doc.isNew) {
		const counter = await CounterModel.increment("reservationId");
		doc.reservationId = counter;
	}
	next();
});

/**
 * Create a new reservation in the reservation system. This function also
 * does validation checks to make sure that the information passed is
 * valid. Therefore, no validation checks are needed to be done outside
 * of this function.
 * 
 * @param guest guest id.
 * @param startDate dd/MM/YYYY date.
 * @param startTime string of format HH:mm, to know more read Time24.
 * @param nightCount number of nights from startDate.
 * @param endTime On the last day, the time to checkout, like startTime.
 * to know more read Time24.
 * @param prices array of numbers, each number correspond with the price
 * of each night.
 * @param email string representing the email of the guest, read more at Email.
 * @param phone string representing the phone number of the guest.
 * @returns The newly created reservation.
 * @throws ReservationCreationError
 */
async function create(
	guest: number,
	startDate: Date,
	startTime: Time24,
	nightCount: number,
	endTime: Time24,
	prices: number[],
	email: string,
	phone: string
) {
	const today = getTodaysDate();
	
	/* Validate all the fields, let's gooo!!! */
	
	if (startDate < today) {
		throw new ReservationCreationError("startDate field must be today or later.");
	}
	
	if (nightCount < 0) {
		throw new ReservationCreationError("nightCount must be greater than 0.");
	}
	
	if (nightCount == 0 && numFromTime24(startTime) > numFromTime24(endTime)) {
		throw new ReservationCreationError(
			"startTime and/or endTime for same day check in must be one after the other."
		);
	}
	
	if (prices.length !== nightCount) {
		throw new ReservationCreationError(" Prices array length must match nightCount");
	}
	
	if (!prices.every((price) => price >= 0)) {
		throw new ReservationCreationError("prices must all be non-negative.");
	}
	
	/* Make sure that the start date is properly validated. */
	startDate.setHours(0, 0, 0, 0);
	
	try {
		const reservation = await ReservationModel.create({
			guest,
			reservationMade: getTodaysDate(),
			startDate,
			startTime,
			nightCount,
			endTime,
			prices,
			email,
			phone,
			extras: [],
		});
		
		return reservation;
	} catch (err: any) {
		Logger.error(`${err.message}`);
		throw new ReservationCreationError(`${err.message}`);
	}
}

/* ---------------------- Getters ---------------------- */

/**
 * Return all reservations made by a guest since startDate onwards.
 * 
 * @param guestId Guest id who created the reservation.
 * @param startDate Minimum start date of the reservation. If undefined then defaults
 * to the last 3 months.
 * @returns An array of reservations made by the guest since the start Date.
 */
async function getByGuestId(guestId: number, startDate?: Date) {
	// Set default startDate to 3 month ago if not provided.
	if (!startDate) {
		const today = getTodaysDate();
		startDate = addDaysToDate(today, -90);
	}
	
	try {
		const reservations = await ReservationModel.find({
			guest: guestId,
			startDate: { $gte: startDate },
		});
		
		return reservations;
	} catch (err: any) {
		throw new ReservationFetchingError(err.message);
	}
}

/**
 * Return rooms by room, sorted from newest to latest. The number of rooms
 * is at most `limit` in numbers.
 * 
 * @param room The room to get the reservation from.
 * @param limit The number of results to return.
 * @returns An array of reservations for the specified room.
 */
async function getByRoom(room: number, limit: number = 1) {
	try {
		const reservations = await ReservationModel.find({ room })
			.sort({ reservationMade: -1 })
			.limit(limit)
			.exec();
		
		return reservations;
	} catch (err: any) {
		throw new ReservationFetchingError(err.message);
	}
}

/**
 * Return all reservations made within the range of the dates given.
 * 
 * @param fromDate The start date to get the reservations from.
 * @param toDate The end date to get the reservations until.
 * @returns List of reservations made within the dates stated.
 */
async function getByDateRange(fromDate: Date, toDate: Date) {
	try {
		const reservations = await ReservationModel.find({
			startDate: {
				$gte: fromDate,
				$lte: toDate,
			}
		});
		
		return reservations;
	} catch (err) {
		throw new ReservationFetchingError(`Couldn't fetch reservations ${fromDate} - ${toDate}`);
	}
}

/* ---------------------- Setters ---------------------- */

/**
 * Set the room of a reservation or null if no room is allocated for
 * that reservation.
 * 
 * @param reservationId The reservation to update.
 * @param roomNumber The room to update to the reservation.
 */
async function setRoom(reservationId: number, roomNumber: number | null) {
	if (!roomNumber) {
		const reservation = await RoomModel.getRoomReservation(roomNumber as number);
		if (!reservation) {
			throw new ReservationUpdateError("Occupied room");
		}
	}
	
	/* We can now update the reservation's room */
	
	try {
		
		const reservation = await ReservationModel.updateOne(
			{ reservationId },
			{ $set: { room: roomNumber } },
			{ new: true }
		);
		
	} catch (err) {
		throw new ReservationUpdateError("Invalid room");
	}
}

// 	const reservationExists = await ReservationModel.exists({guest, reservationMade});
// 	if (!reservationExists)
// 		throw new ReservationNotFoundError();
// 
// 	await ReservationModel.updateOne({
// 		guest,
// 		reservationMade,
// 	}, {
// 		$set: {room: room}
// 	})
// }

async function setEmail(guest: number, reservationMade: Date, email: string) {
	const reservationExists = await ReservationModel.exists({guest, reservationMade});
	if (!reservationExists)
		throw new ReservationNotFoundError();
	
	await ReservationModel.updateOne({
		guest,
		reservationMade,
	}, {
		$set: {email}
	});
}

async function setPhoneNumber(guest: number, reservationMade: Date, phone: string) {
	const reservationExists = await ReservationModel.exists({guest, reservationMade});
	if (!reservationExists)
		throw new ReservationNotFoundError();
	
	await ReservationModel.updateOne({
		guest,
		reservationMade,
	}, {
		$set: { phone }
	});
}



async function getAllReservations(guest: number) {
	return await ReservationModel.find({guest});
}

async function getById(reservationId: mongoose.Types.ObjectId) {
	const reservation = await ReservationModel.findById(reservationId);
	if (!reservation) {
		throw new ReservationDoesNotExistError();
	}
	
	return reservation;
}

async function getOneByCreationTime(guest: number, reservationMade: Date) {
	const reservation = await ReservationModel.findOne({guest, reservationMade});
	if (!reservation)
		throw new ReservationNotFoundError();
	
	return reservation;
}

async function getManyByGuest(guest: number, state?: ReservationState) {
	if (!state) {
		return await ReservationModel.find({ guest });
	}
	
	return await ReservationModel.find({ guest, state });
}

async function getReservation(guest: number, reservationMade: Date) {
	
}

async function getLastReservations(guest: number, count: number = 1) {
	await ReservationModel.find({guest}, {}, {
		sort: {"startDate": -1}, limit: count
	});
}

async function isValidReservation(reservationId: string): Promise<boolean> {
	if (!mongoose.Types.ObjectId.isValid(reservationId)) {
		return false;
	}
	
	try {
		const reservation = await ReservationModel.findById(reservationId);
		return reservation !== null;
	} catch (err) {
		Logger.error(`Error fetching reservation: ${err}`);
		return false;
	}
}

export default {
	create,
	setRoom,
	setEmail,
	setPhoneNumber,
	getAllReservations,
	getReservation,
	getLastReservations,
	isValidReservation,
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         guest:
 *           type: string
 *           description: The ID of the guest who made the reservation.
 *           example: "605c73c4f0a5e71b34567891"
 *         reservationMade:
 *           type: string
 *           format: date-time
 *           description: The date and time when the reservation was made.
 *           example: "2023-09-16T15:00:00.000Z"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date of the reservation.
 *           example: "2023-09-20T00:00:00.000Z"
 *         nightCount:
 *           type: integer
 *           description: The number of nights for the reservation.
 *           example: 3
 *         prices:
 *           type: array
 *           items:
 *             type: number
 *           description: The price for each night.
 *           example: [100, 100, 120]
 *         room:
 *           type: string
 *           description: The ID of the room assigned to the reservation.
 *           example: "605c73c4f0a5e71b34567891"
 *         state:
 *           type: string
 *           enum:
 *             - Pending
 *             - Active
 *             - Cancelled
 *             - Passed
 *           description: The state of the reservation.
 *           example: "Pending"
 *         email:
 *           type: string
 *           description: The email address associated with the reservation.
 *           example: "guest@example.com"
 *         phoneNumber:
 *           type: string
 *           description: The phone number associated with the reservation.
 *           example: "+123456789"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: The time the reservation ends on its last day.
 *           example: "2023-09-23T12:00:00.000Z"
 *         extras:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of IDs referencing extra services or items.
 *           example: ["605c73c4f0a5e71b34567891", "605c73c4f0a5e71b34567892"]
 *       required:
 *         - guest
 *         - reservationMade
 *         - startDate
 *         - startTime
 *         - nightCount
 *         - endTime
 *         - prices
 *         - email
 *         - phoneNumber
 * 
 *     Extra:
 *       type: object
 *       properties:
 *         item:
 *           type: string
 *           description: The name or type of the extra item.
 *           example: "Breakfast"
 *         description:
 *           type: string
 *           description: A detailed description of the extra item.
 *           example: "Includes a full English breakfast served in the dining room."
 *         reservation:
 *           type: string
 *           description: The ID of the reservation associated with this extra.
 *           example: "605c73c4f0a5e71b34567891"
 *       required:
 *         - item
 *         - reservation
 */
