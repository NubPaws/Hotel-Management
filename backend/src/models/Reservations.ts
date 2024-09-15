import mongoose, { Schema } from "mongoose";
import { Guest } from "./Guests.js";
import logger from "../utils/logger.js";

export class ReservationNotFoundError extends Error {}
export class RoomIsAlreadyOccupiedAtThatTimeError extends Error {}

export enum ReservationState {
	Pending = "Pending",
	Active = "Active",
	Cancelled = "Cancelled",
	Passed = "Passed",
}

export interface Reservation {
	guest: Guest,
	reservationMade: Date,
	startDate: Date,
	nightCount: number,
	prices: number[],
	room: mongoose.Types.ObjectId | number,
	state: ReservationState,
	email: string,
	phoneNumber: string,
}

const ReservationModel = mongoose.model<Reservation>(
	"ReservationModel",
	new Schema<Reservation>({
		guest: {
			type: Number,
			ref: "GuestModel",
			required: true,
		},
		reservationMade: {
			type: Date,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		nightCount: {
			type: Number,
			required: true,
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
			values: Object.values(ReservationState),
			default: ReservationState.Pending,
		},
		email: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		}
	})
);

function addDaysToDate(date: Date, days: number): Date {
	const added = new Date(date);
	added.setDate(added.getDate() + days);
	return added;
}

async function create(guest: number, startDate: Date, nightCount: number, prices: number[], email: string, phoneNumber: string) {
	await ReservationModel.create({
		guest,
		reservationMade: new Date(),
		startDate,
		nightCount,
		prices,
		email,
		phoneNumber,
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

async function getReservation(guest: number, reservationMade: Date) {
	const reservation = await ReservationModel.findOne({guest, reservationMade});
	if (!reservation)
		throw new ReservationNotFoundError();
	
	return reservation;
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
