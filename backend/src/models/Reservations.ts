import mongoose, { Schema } from "mongoose";
import logger from "../utils/logger.js";
import { addDaysToDate, getTodaysDate, isTime24String, numFromTime24, Time24 } from "../utils/clock.js";

export class ReservationNotFoundError extends Error {}
export class RoomIsAlreadyOccupiedAtThatTimeError extends Error {}
export class ReservationCreationError extends Error {
	constructor(fieldName: string) {
		super(`Field ${fieldName} is invalid.`);
	}
}

export enum ReservationState {
	Pending = "Pending",
	Active = "Active",
	Cancelled = "Cancelled",
	Passed = "Passed",
}

export interface Extra extends Document {
	item: string,
	description: string,
	reservation: mongoose.Types.ObjectId,
}

export interface Reservation extends Document {
	guest: mongoose.Types.ObjectId | number,
	reservationMade: Date,
	startDate: Date,
	startTime: Time24,
	nightCount: number,
	endTime: Time24,
	prices: number[],
	room: mongoose.Types.ObjectId | number | null,
	state: ReservationState,
	email: string,
	phoneNumber: string,
	extras: mongoose.Types.ObjectId[];
}

const ExtraModel = mongoose.model<Extra>(
	"ExtraModel",
	new Schema<Extra>({
		item: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			default: "",
		},
		reservation: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	})
);

const ReservationModel = mongoose.model<Reservation>(
	"ReservationModel",
	new Schema<Reservation>({
		guest: {
			type: Schema.Types.ObjectId,
			ref: "GuestModel",
			required: true,
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
			Type: String,
			required: true,
		},
		nightCount: {
			type: Number,
			required: true,
		},
		endTime: {
			type: String,
			required: true,
		},
		prices: [{
			type: Number,
			required: true,
		}],
		room: {
			type: Schema.Types.ObjectId,
			ref: "RoomModel",
			default: null,
		},
		state: {
			type: String,
			enum: Object.values(ReservationState),
			default: ReservationState.Pending,
		},
		email: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		extras: [{
			type: Schema.Types.ObjectId,
			ref: "ExtraModel",
		}],
	})
);

async function create(
	guest: number,
	startDate: Date,
	startTime: Time24,
	nightCount: number,
	endTime: Time24,
	prices: number[],
	email: string,
	phoneNumber: string
) {
	const today = getTodaysDate();
	
	/* Validate all the fields, let's gooo!!! */
	
	if (startDate < today) {
		throw new ReservationCreationError("startDate");
	}
	
	if (nightCount < 0) {
		throw new ReservationCreationError("nightCount");
	}
	
	if (!isTime24String(startTime)) {
		throw new ReservationCreationError("startTime");
	}
	
	if (!isTime24String(endTime)) {
		throw new ReservationCreationError("endTime");
	}
	
	if (nightCount == 0 && numFromTime24(startTime) > numFromTime24(endTime)) {
		throw new ReservationCreationError("startTime and/or endTime");
	}
	
	await ReservationModel.create({
		guest,
		reservationMade: getTodaysDate(),
		startDate,
		startTime,
		nightCount,
		endTime,
		prices,
		email,
		phoneNumber,
		extras: [],
	});
}

async function getRoomReservation(roomNumber: number) {
	const rooms = await ReservationModel.find({room: roomNumber});
	
	const date = new Date();
	for (let i = 0; i < rooms.length; i++) {
		const room = rooms[i];
		const startDate = room.startDate;
		const endDate = addDaysToDate(startDate, room.nightCount);
		
		if (startDate <= date && date <= endDate) {
			return room.room;
		}
	}
	
	return null;
}

async function setRoom(guest: number, reservationMade: Date, room: number) {
	if (getRoomReservation(room) !== null) {
		throw new RoomIsAlreadyOccupiedAtThatTimeError();
	}
	
	const reservationExists = await ReservationModel.exists({guest, reservationMade});
	if (!reservationExists)
		throw new ReservationNotFoundError();
	
	await ReservationModel.updateOne({
		guest,
		reservationMade,
	}, {
		$set: {room: room}
	})
}

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

async function setPhoneNumber(guest: number, reservationMade: Date, phoneNumber: string) {
	const reservationExists = await ReservationModel.exists({guest, reservationMade});
	if (!reservationExists)
		throw new ReservationNotFoundError();
	
	await ReservationModel.updateOne({
		guest,
		reservationMade,
	}, {
		$set: {phoneNumber}
	});
}

async function getAllReservations(guest: number) {
	return await ReservationModel.find({guest});
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
		logger.error(`Error fetching reservation: ${err}`);
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
