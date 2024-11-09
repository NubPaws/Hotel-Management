import mongoose, { Document, Schema } from "mongoose";
import { addDaysToDate, getTodaysDate, isTime24String, numFromTime24, Time24 } from "../utils/Clock.js";
import { Email, isEmailString } from "../utils/Email.js";
import Logger from "../utils/Logger.js";
import Counter from "./Counter.js";
import Extra from "./Extra.js";
import Room from "./Room.js";

export class ReservationDoesNotExistError extends Error {}
export class RoomIsAlreadyOccupiedAtThatTimeError extends Error {}
export class ReservationCreationError extends Error {}
export class ReservationFetchingError extends Error {}
export class ReservationUpdateError extends Error {}
export class InvalidPricesArrayError extends Error {}

export enum ReservationState {
	Pending = "Pending",
	Arriving = "Arriving",
	Active = "Active",
	Departing = "Departing",
	Passed = "Passed",
	NoShow = "NoShow",
	Cancelled = "Cancelled",
}

export interface Reservation extends Document {
	reservationId: number,			// Running counter of the reservations made.
	reservationMade: Date,			// The time the reservation was made.
	comment: string,				// Comment made on the reservation.
	startDate: Date,				// The date the reservation was made to start at.
	startTime: Time24,				// The time of day the reservation starts at.
	nightCount: number,				// Number of nights the reservation is for.
	endTime: Time24,				// Time the reservation should end on the last day.
	endDate: Date,					// The date the reservation ends.
	prices: number[],				// Prices for each night, should be the same length as nightCount.
	roomType: string,				// Type of the room requested in the reservation.
	room: number | null,			// Room number assigned to the reservation, null otherwise.
	state: ReservationState,		// The state of the reservation.
	extras: number[],				// References to Extra's ID. Anything added to the reservation.
	guest: number | null,			// The guest who booked the reservation.
	guestName: string,				// The name the guest used for the reservation.
	email: string,					// Email of the reservation.
	phone: string,					// Phone number of the reservation.
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
	comment: {
		type: String,
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
	endDate: {
		type: Date,
		required: true,
	},
	prices: [{
		type: [Number],
		required: true,
		validate: {
			validator: (value: number[]) => value.every((price) => price >= 0),
			message: "Each price must be a non-negative number",
		},
		default: [],
	}],
	roomType: {
		type: String,
		ref: "RoomTypeModel",
		required: true,
	},
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
	guestName: {
		type: String,
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

/**
 * Create a new reservation in the reservation system. This function also
 * performs validation checks to ensure the provided information is valid.
 * Therefore, no validation checks are needed outside of this function.
 * 
 * @param guest - The ID of the guest making the reservation.
 * @param comment - Additional notes or comments about the reservation.
 * @param startDate - The start date of the reservation (dd/MM/YYYY).
 * @param startTime - The time of day the reservation starts (HH:mm, 24-hour format).
 * @param nightCount - The number of nights for the reservation starting from the startDate.
 * @param endTime - The time of day the reservation ends on the last day (HH:mm, 24-hour format).
 * @param prices - An array of numbers where each corresponds to the price of a night.
 * @param roomType - The type of room requested for the reservation.
 * @param email - The email address of the guest.
 * @param phone - The phone number of the guest.
 * 
 * @returns The newly created reservation.
 * 
 * @throws ReservationCreationError - Throws an error if the reservation creation fails due to validation or database issues.
 */
async function create(
	guest: number,
	comment: string,
	startDate: Date,
	startTime: Time24,
	nightCount: number,
	endTime: Time24,
	prices: number[],
	roomType: string,
	guestName: string,
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
		const reservationId = await Counter.increment("reservationId");
		
		const endDate = addDaysToDate(startDate, nightCount);
		
		const reservation = await ReservationModel.create({
			reservationId,
			guest,
			reservationMade: getTodaysDate(),
			comment,
			startDate,
			startTime,
			nightCount,
			endTime,
			endDate,
			prices,
			roomType,
			guestName,
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

async function setComment(reservationId: number, comment: string) {
	return updateReservationField(reservationId, "comment", comment);
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

async function setRoomType(reservationId: number, roomType: string) {
	return updateReservationField(reservationId, "roomType", roomType);
}

/**
 * Create a new extra and adds it to the reservation.
 * 
 * @param reservationId The reservation to add the extra item to.
 * @param item The name of the extra item.
 * @param description A description of the extra item, can be as long as possible
 * or can be an empty string.
 */
async function addExtra(reservationId: number, item: string, price: number, description: string = "") {
	const reservation = await getById(reservationId);
	
	const extra = await Extra.create(item, description, price, reservationId);
	
	reservation.extras.push(extra.extraId);
	await reservation.save();
	return reservation as Reservation;
}

/**
 * Removes an extra from a reservation and deletes the extra from the database.
 * 
 * @param {number} reservationId - The ID of the reservation from which to remove the extra.
 * @param {number} extraId - The ID of the extra to remove and delete.
 * @returns {Reservation} - The updated reservation after the extra has been removed.
 * @throws {ReservationUpdateError} - If the reservation or extra does not exist or cannot be updated.
 */
async function removeExtra(reservationId: number, extraId: number) {
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

async function query(
	guestId?: number,
	room?: number,
	startDate?: string,
	endDate?: string,
	email?: string,
	phone?: string,
	guestName?: string
) {
	const filters: any = {};
	
	// Add filters based on query parameters provided
	if (guestId) {
		filters.guest = new RegExp(`${guestId}`, "i");
	}
	if (room) {
		filters.room = new RegExp(`${room}`, "i");
	}
	
	if (startDate && endDate) {
		filters.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
	} else if (startDate) {
		filters.startDate = { $gte: new Date(startDate) };
	} else if (endDate) {
		filters.startDate = { $lte: new Date(endDate) };
	}
	
	if (email) {
		filters.email = new RegExp(email.replaceAll(".", "\\."), "i");
	}
	if (phone) {
		filters.phone = new RegExp(phone.replaceAll("+", "\\+"), "i");
	}
	if (guestName) {
		filters.guestName = new RegExp(guestName, "i");
	}
	
	const reservations = await ReservationModel.find(filters);
	return reservations;
}

async function find(filter: mongoose.RootFilterQuery<Reservation>) {
	return ReservationModel.find(filter);
}

async function count(filter: mongoose.RootFilterQuery<Reservation>) {
	return ReservationModel.countDocuments(filter);
}

/**
 * Checks out the reservation off the system.
 * @param reservationId The reservation to check out.
 */
async function checkout(reservationId: number) {
	// TODO: Write this function.
}

export default {
	create,
	
	getByGuestId,
	getByRoom,
	getByDateRange,
	getById,
	
	updateReservationField,
	
	setComment,
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
	setRoomType,
	
	addExtra,
	removeExtra,
	
	isValidReservation,
	
	query,
	find,
	count,
	
	checkout,
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - reservationId
 *         - reservationMade
 *         - startDate
 *         - startTime
 *         - nightCount
 *         - endTime
 *         - prices
 *         - guest
 *         - email
 *         - phone
 *       properties:
 *         reservationId:
 *           type: integer
 *           description: Unique identifier for the reservation.
 *           example: 12345
 *         reservationMade:
 *           type: string
 *           format: date-time
 *           description: Date and time when the reservation was made.
 *           example: "2024-10-16T10:30:00.000Z"
 *         comment:
 *           type: string
 *           description: Comment associated with the reservation.
 *           example: "Late check-in requested."
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date of the reservation.
 *           example: "2024-11-01T00:00:00.000Z"
 *         startTime:
 *           type: string
 *           description: Start time of the reservation in HH:mm format (24-hour).
 *           example: "15:00"
 *         nightCount:
 *           type: integer
 *           description: Number of nights for the reservation.
 *           example: 3
 *         endTime:
 *           type: string
 *           description: End time of the reservation in HH:mm format.
 *           example: "12:00"
 *         prices:
 *           type: array
 *           items:
 *             type: number
 *           description: Prices for each night of the stay.
 *           example: [100, 120, 150]
 *         guest:
 *           type: integer
 *           description: ID of the guest making the reservation.
 *           example: 7890
 *         email:
 *           type: string
 *           description: Email address of the guest.
 *           example: "guest@example.com"
 *         phone:
 *           type: string
 *           description: Phone number of the guest.
 *           example: "+972 50 123 4567"
 *         extras:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array of extra service IDs associated with the reservation.
 *           example: [101, 102, 103]
 *         room:
 *           type: integer
 *           description: Room ID assigned to the reservation.
 *           example: 101
 *         state:
 *           type: string
 *           enum: [Pending, Arriving, Active, Departing, Passed, NoShow, Cancelled]
 *           description: Current state of the reservation.
 *           example: "Active"
 */
