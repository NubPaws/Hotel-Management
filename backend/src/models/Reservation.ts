import mongoose, { Document, Schema } from "mongoose";
import { addDaysToDate, getTodaysDate, isTime24String, numFromTime24, Time24 } from "../utils/Clock.js";
import { Email, isEmailString } from "../utils/Email.js";
import Logger from "../utils/Logger.js";
import Counter from "./Counter.js";
import Extra from "./Extra.js";
import Room from "./Room.js";
import Guest from "./Guest.js";

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
	email: Email,					// Email of the reservation.
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
		default: "",
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
	prices: {
		type: [Number],
		required: true,
		validate: {
			validator: (value: number[]) => value.every((price) => price >= 0),
			message: "Each price must be a non-negative number",
		},
	},
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

async function preSaveHook(reservation: Partial<Reservation>) {
	const { startDate, startTime, endTime, nightCount } = reservation;
	
	if (startDate && nightCount != null) {
		reservation.endDate = addDaysToDate(startDate, nightCount);
	}
	
	// Validation for start and end time.
	if (startTime && endTime) {
		const startNum = numFromTime24(startTime);
		const endNum = numFromTime24(endTime);
		
		const isSameDayReservation = nightCount === 0;
		
		// Same-day reservation (start and end time must be in sequence).
		// Requires start and end time validation.
		if (isSameDayReservation) {
			if (startNum >= endNum) {
				throw new ReservationUpdateError("For same-day reservations, start time must be before end time");
			}
		}
	}

	// Make sure the room is valid.
	if (reservation.room) {
		reservation.room = reservation.room as number;
		if (!(await Room.isValidRoom(reservation.room))) {
			throw new ReservationUpdateError(`Room #${reservation.room} does not exist.`);
		}
		if (!(await Room.isRoomOccupied(reservation.room))) {
			throw new ReservationUpdateError(`Occupied room #${reservation.room}.`);
		}
	}
}

ReservationSchema.pre("save", async function (next) {
	const reservation = this as Reservation;
	try {
		await preSaveHook(reservation);
		next();
	} catch (error: any) {
		next(error);
	}
});

ReservationSchema.pre("findOneAndUpdate", async function (next) {
	const reservation = this.getUpdate() as Partial<Reservation>;
	try {
		await preSaveHook(reservation);
		next();
	} catch (error: any) {
		next(error);
	}
});

const ReservationModel = mongoose.model<Reservation>("ReservationModel", ReservationSchema);

/**
 * Create a new reservation in the reservation system. This function also
 * performs validation checks to ensure the provided information is valid.
 * Therefore, no validation checks are needed outside of this function.
 * 
 * @param guestIdentification - The ID of the guest making the reservation.
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
	guestIdentification: string,
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
	startDate.setHours(0, 0, 0, 0);
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
	
	const guest = await Guest.getByIdentification(guestIdentification);
	
	/* Make sure that the start date is properly validated. */
	startDate.setHours(0, 0, 0, 0);
	
	try {
		const reservationId = await Counter.increment("reservationId");
		
		const endDate = addDaysToDate(startDate, nightCount);
		
		const reservation = await ReservationModel.create({
			reservationId,
			guest: guest.guestId,
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
			state: startDate.getTime() === today.getTime() ? ReservationState.Arriving : ReservationState.Pending,
			extras: [],
		});
		return reservation as Reservation;
	} catch (err: any) {
		Logger.error(`${err.message}`);
		throw new ReservationCreationError(`${err.message}`);
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

/**
 * Set the number of nights for a reservation and adjust prices accordingly.
 * 
 * @param reservationId The reservation to update.
 * @param nightCount The new number of nights for the reservation.
 * @param prices An array of prices matching the new number of nights.
 * @returns The updated reservation.
 * @throws ReservationUpdateError if the operation fails.
 */
async function setNightCount(reservationId: number, nightCount: number, prices: number[]): Promise<Reservation> {
	const reservation = await getById(reservationId);
	
	if (prices.length !== nightCount) {
		throw new ReservationUpdateError("Prices array length must match the new night count.");
	}
	
	reservation.nightCount = nightCount;
	reservation.prices = prices;
	
	reservation.endDate = addDaysToDate(reservation.startDate, nightCount);
	
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
	return extra;
}

/**
 * Removes an extra from a reservation and deletes the extra from the database.
 * 
 * @param reservationId - The ID of the reservation from which to remove the extra.
 * @param extraId - The ID of the extra to remove and delete.
 * @returns The updated reservation after the extra has been removed.
 * @throws ReservationUpdateError - If the reservation or extra does not exist or cannot be updated.
 */
async function removeExtra(reservationId: number, extraId: number) {
	const reservation = await getById(reservationId);
	
	if (reservation.extras.every((val: number) => val !== extraId)) {
		throw new ReservationUpdateError(`Extra ${extraId} does not exists in reservaiton`);
	}
	
	reservation.extras = reservation.extras.filter((val: number) => val !== extraId);
	await Promise.all([Extra.deleteById(extraId), reservation.save()])
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
	guestId?: string,
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
		const guest = await Guest.getByIdentification(guestId);
		filters.guest = { $eq: guest.guestId } //new RegExp(`${guest.guestId}`, "i");
	}
	
	if (room) {
		filters.$expr = {
			$regexMatch: {
				input: { $toString: "$room" },
				regex: new RegExp(`${room}`, "i"),
			},
		};
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

async function update(reservationId: number, updates: Partial<Reservation>) {
	const reservation = await ReservationModel.findOne({ reservationId });
	
	if (!reservation) {
		throw new ReservationDoesNotExistError(`Reservation with ID ${reservationId} does not exists`);
	}
	
	try {
		const updatedReservation = await ReservationModel.findOneAndUpdate(
			{ reservationId },
			{ $set: updates },
			{ new: true }
		);
		
		if (updates.room) {
			await Room.setRoomOccupation(reservation.room, false);
			await Room.setRoomOccupation(updates.room, true, reservationId);
		} else if (updates.room === null) {
			await Room.setRoomOccupation(reservation.room, false);
		}
		
		return updatedReservation;
	} catch (err: any) {
		throw new ReservationUpdateError(`Failed to update reservation: ${err.message}`);
	}
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
	
	getById,
	
	setPrice,
	setRoom,
	setState: (reservationId: number, state: ReservationState) => updateReservationField(reservationId, "state", state),
	setRoomType: (reservationId: number, roomType: string) => updateReservationField(reservationId, "roomType", roomType),
	
	setNightCount,
	
	addExtra,
	removeExtra,
	
	isValidReservation,
	
	query,
	find,
	count,
	update,
	
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
 *         - comment
 *         - startDate
 *         - startTime
 *         - nightCount
 *         - endTime
 *         - prices
 *         - roomType
 *         - guest
 *         - guestName
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
 *           description: Date and time when the reservation was created.
 *           example: "2024-11-20T10:00:00.000Z"
 *         comment:
 *           type: string
 *           description: Additional notes or comments about the reservation.
 *           example: "Late arrival expected."
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of the reservation in YYYY-MM-DD format.
 *           example: "2024-11-25"
 *         startTime:
 *           type: string
 *           description: Start time of the reservation in HH:mm (24-hour) format.
 *           example: "15:00"
 *         nightCount:
 *           type: integer
 *           description: Number of nights for the reservation.
 *           example: 3
 *         endTime:
 *           type: string
 *           description: End time of the reservation in HH:mm (24-hour) format.
 *           example: "12:00"
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the reservation in YYYY-MM-DD format.
 *           example: "2024-11-28"
 *         prices:
 *           type: array
 *           items:
 *             type: number
 *           description: List of nightly prices for the reservation.
 *           example: [120.5, 130.0, 125.0]
 *         roomType:
 *           type: string
 *           description: Type of room requested for the reservation.
 *           example: "Deluxe Suite"
 *         room:
 *           type: integer
 *           nullable: true
 *           description: Assigned room number, or null if not yet assigned.
 *           example: 101
 *         state:
 *           type: string
 *           enum:
 *             - Pending
 *             - Arriving
 *             - Active
 *             - Departing
 *             - Passed
 *             - NoShow
 *             - Cancelled
 *           description: Current status of the reservation.
 *           example: "Active"
 *         extras:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array of extra service IDs associated with the reservation.
 *           example: [101, 102]
 *         guest:
 *           type: integer
 *           description: ID of the guest making the reservation.
 *           example: 7890
 *         guestName:
 *           type: string
 *           description: Name of the guest making the reservation.
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the guest.
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           description: Phone number of the guest.
 *           example: "+1-555-123-4567"
 */
