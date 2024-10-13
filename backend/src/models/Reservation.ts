import mongoose, { Document, Schema } from "mongoose";
import { addDaysToDate, getTodaysDate, isTime24String, numFromTime24, Time24 } from "../utils/Clock.js";
import { Email, isEmailString } from "../utils/Email.js";
import Logger from "../utils/Logger.js";
import Counter from "./Counter.js";
import Extra from "./Extra.js";
import Room from "./Room.js";

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
		index: true,
		immutable: true,
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
		validate: {
			validator: (value: number) => value >= 0,
			message: "nightCount must be 0 or greater.",
		},
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
		validate: {
			validator: (value: number[]) => value.every((price) => price >= 0),
			message: "Each price must be a non-negative number",
		},
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
});

const ReservationModel = mongoose.model<Reservation>("ReservationModel", ReservationSchema);

ReservationSchema.pre("save", async function (next) {
	const doc = this;
	if (doc.isNew) {
		const counter = await Counter.increment("reservationId");
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
	
	if (nightCount == 0 && numFromTime24(startTime) > numFromTime24(endTime)) {
		throw new ReservationCreationError(
			"startTime and/or endTime for same day check in must be one after the other."
		);
	}
	
	if (prices.length !== nightCount) {
		throw new ReservationCreationError(" Prices array length must match nightCount");
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
		
		return reservation as Reservation;
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
async function getByGuestId(guestId: number, startDate?: Date, limit: number = 10) {
	// Set default startDate to 3 month ago if not provided.
	if (!startDate) {
		const today = getTodaysDate();
		startDate = addDaysToDate(today, -90);
	}
	
	try {
		const reservations = await ReservationModel.find(
			{
				guest: guestId,
				startDate: { $gte: startDate },
			},
			{},
			{
				sort: { "startDate": -1 },
				limit
			}
		);
		
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

/**
 * Returns the reservation as a mongoose document. That way it can
 * be casted to Reservation or it can be used to run .save() on.
 * 
 * @param reservationId The reservation id to find.
 * @returns The reservation document.
 */
async function getById(reservationId: number) {
	const reservation = await ReservationModel.findOne({ reservationId });
	if (!reservation) {
		throw new ReservationDoesNotExistError();
	}
	
	return reservation;
}

/* ---------------------- Setters ---------------------- */

/**
 * Update a single field of a reservation.
 * 
 * @param reservationId The reservation ID to update.
 * @param field The field name to update.
 * @param value The new value for the field.
 * @returns The udpated reservation.
 * @throws ReservationUpdateError if the update fails.
 */
async function updateReservationField(
	reservationId: number,
	field: keyof Reservation,
	value: any
): Promise<Reservation> {
	try {
		const updateData = { [field]: value };
		const reservation = await ReservationModel.findOneAndUpdate(
			{ reservationId },
			{ $set: updateData },
			{ new: true }
		);
		
		if (!reservation) {
			throw new ReservationUpdateError(`Failed to update ${field}.`);
		}
		
		return reservation as Reservation;
	} catch (err: any) {
		throw new ReservationUpdateError(`Failed to update ${field}: ${err.message}`);
	}
}

async function setEmail(reservationId: number, email: Email) {
	return updateReservationField(reservationId, "email", email);
}

async function setPhone(reservationId: number, phone: string) {
	return updateReservationField(reservationId, "phone", phone);
}

async function setStartDate(reservationId: number, startDate: Date) {
	startDate.setHours(0, 0, 0, 0);
	const today = getTodaysDate();
	
	if (startDate < today) {
		throw new ReservationUpdateError("Invalid start date (must be today or later).");
	}
	
	return await updateReservationField(reservationId, "startDate", startDate);
}

/**
 * Change the start time of the reservation. Also checks that the time is
 * indeed valid.
 * 
 * @param reservationId The reservation ID to change.
 * @param startTime The new start time for the reservation.
 * @throws ReservationDoesNotExistError
 * @throws ReservationUpdateError
 */
async function setStartTime(reservationId: number, startTime: Time24) {
	const reservation = await getById(reservationId);
	
	const endTime = reservation.endTime;
	if (numFromTime24(startTime) >= numFromTime24(reservation.endTime)) {
		throw new ReservationUpdateError(
			`Start time ${startTime} must be earlier than end time ${endTime}.`
		);
	}
	
	reservation.startTime = startTime;
	await reservation.save();
}

/**
 * Add nights to the reservation with the relevant prices.
 * 
 * @param reservationId The reservation to add the nights to.
 * @param nightsToAdd The number of nights to add.
 * @param prices The prices for each of the nights.
 * @returns The reservation with the nights updated.
 * @throws ReservationUpdateError
 * @throws ReservationNotFoundError
 */
async function addNights(reservationId: number, nightsToAdd: number, prices: number[]) {
	if (nightsToAdd != prices.length) {
		throw new ReservationUpdateError("For each night there must be a price.");
	}
	
	const reservation = await getById(reservationId);
	
	reservation.nightCount += nightsToAdd;
	reservation.prices.push(...prices);
	
	await reservation.save();
	
	return reservation as Reservation;
}

/**
 * Removes nights from the end of the reservation and also removes
 * the prices.
 * 
 * @param reservationId The reservation to remove the nights from.
 * @param nightsToRemove The number of nights to remove.
 * @returns The reservation with the updated information.
 */
async function removeNights(reservationId: number, nightsToRemove: number) {
	const reservation = await getById(reservationId);
	
	if (reservation.nightCount < nightsToRemove) {
		throw new ReservationUpdateError("Trying to remove too many nights!!!");
	}
	
	if (
		reservation.nightCount == nightsToRemove &&
		numFromTime24(reservation.startTime) >= numFromTime24(reservation.endTime)
	) {
		throw new ReservationUpdateError("Start time and end time conflict.");
	}
	
	reservation.nightCount -= nightsToRemove;
	reservation.prices = reservation.prices.slice(0, -nightsToRemove);
	
	await reservation.save();
	
	return reservation as Reservation;
}

async function setEndTime(reservationId: number, endTime: Time24) {
	const reservation = await getById(reservationId);
	
	if (numFromTime24(reservation.startTime) <= numFromTime24(endTime)) {
		throw new ReservationUpdateError("End time must be after start time.");
	}
	
	reservation.endTime = endTime;
	
	await reservation.save();
	
	return reservation as Reservation;
}

/**
 * Set the price of the reservation at a specific night.
 * 
 * @param reservationId The reservation to update.
 * @param night The night night to update the reservation to.
 * @param price The price to update the night with.
 * @returns The updated reservation.
 * @throws ReservationNotFoundError if the reservation does not exist.
 * @throws ReservationUpdateError if the night index is out of bounds.
 */
async function setPrice(reservationId: number, night: number, price: number) {
	const reservation = await getById(reservationId);
	
	if (night < 0 || night >= reservation.nightCount) {
		throw new ReservationUpdateError("Night is outside of the valid range.");
	}
	
	reservation.prices[night] = price;
	await reservation.save();
	
	return reservation as Reservation;
}

/**
 * Set the room of a reservation or null if no room is allocated for
 * that reservation.
 * 
 * @param reservationId The reservation to update.
 * @param roomNumber The room to update to the reservation.
 * @returns The new reservations.
 * @throws ReservationUpdateError
 */
async function setRoom(reservationId: number, roomNumber: number | null) {
	if (!roomNumber) {
		roomNumber = roomNumber as number;
		if (!(await Room.isValidRoom(roomNumber))) {
			throw new ReservationUpdateError(`Room #${roomNumber} does not exist.`);
		}
		if (!(await Room.isRoomOccupied(roomNumber))) {
			throw new ReservationUpdateError(`Occupied room #${roomNumber}.`);
		}
	}
	
	/* We can now update the reservation's room */
	return updateReservationField(reservationId, "room", roomNumber);
}

async function setState(reservationId: number, state: ReservationState) {
	return updateReservationField(reservationId, "state", state);
}

/**
 * Create a new extra and adds it to the reservation.
 * 
 * @param reservationId The reservation to add the extra item to.
 * @param item The name of the extra item.
 * @param description A description of the extra item, can be as long as possible
 * or can be an empty string.
 */
async function addExtra(reservationId: number, item: string, description: string = "") {
	const reservation = await getById(reservationId);
	
	const extra = await Extra.create(item, description, reservationId);
	
	reservation.extras.push(extra.extraId);
	await reservation.save();
	return reservation as Reservation;
}

async function removeExtraById(reservationId: number, extraId: number) {
	const reservation = await getById(reservationId);
	
	if (reservation.extras.every((val: number) => val !== extraId)) {
		throw new ReservationUpdateError(`Extra ${extraId} does not exists in reservaiton`);
	}
	
	reservation.extras = reservation.extras.filter((val: number) => val === extraId);
	await reservation.save();
	return reservation as Reservation;
}

async function isValidReservation(reservationId: number): Promise<boolean> {
	try {
		
		return await ReservationModel.findOne({ reservationId }) !== null;
		
	} catch (err) {
		Logger.error(`Error fetching reservation: ${err}`);
		return false;
	}
}

export default {
	create,
	
	getByGuestId,
	getByRoom,
	getByDateRange,
	getById,
	
	updateReservationField,
	
	setEmail,
	setPhone,
	setStartDate,
	setStartTime,
	
	addNights,
	removeNights,
	
	setEndTime,
	setPrice,
	setRoom,
	setState,
	addExtra,
	
	removeExtraById,
	
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
 *           readOnly: true
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
 */
