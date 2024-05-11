import mongoose, { Schema } from "mongoose";
import { Guest } from "./Guests.js";

export class ReservationNotFoundError extends Error {}
export class RoomIsAlreadyOccupiedAtThatTimeError extends Error {}

export enum ReservationState {
	Pending,
	Active,
	Cancelled,
	Passed,
}

export interface Reservation {
	guest: Guest,
	reservationMade: Date,
	startDate: Date,
	nightCount: number,
	prices: number[],
	room: number,
	state: ReservationState,
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
			default: -1,
		},
		state: {
			type: Number,
			values: Object.values(ReservationState),
			default: ReservationState.Pending,
		}
	})
);

function addDaysToDate(date: Date, days: number): Date {
	const added = new Date(date);
	added.setDate(added.getDate() + days);
	return added;
}

async function create(guest: number, startDate: Date, nightCount: number, prices: number[]) {
	await ReservationModel.create({
		guest,
		reservationMade: new Date(),
		startDate,
		nightCount,
		prices,
	});
}

async function getRoomReservation(roomNumber: number): Promise<number | null> {
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

export default {
	create,
	setRoom,
	getAllReservations,
	getReservation,
	getLastReservations,
}
