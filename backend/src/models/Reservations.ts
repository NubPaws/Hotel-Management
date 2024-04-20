import mongoose, { Schema } from "mongoose";
import { Guest } from "./Guests.js";

export class ReservationNotFoundError extends Error {}
export class RoomIsAlreadyOccupiedAtThatTimeError extends Error {}

export interface Reservation {
	guest: Guest,
	reservationMade: Date,
	startDate: Date,
	dayCount: number,
	prices: number[],
	room: number,
	cancelled: boolean,
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
		dayCount: {
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
		cancelled: {
			type: Boolean,
			default: false,
		}
	})
);

function addDaysToDate(date: Date, days: number): Date {
	const added = new Date(date);
	added.setDate(added.getDate() + days);
	return added;
}

async function create(guest: number, startDate: Date, dayCount: number, prices: number[]) {
	await ReservationModel.create({
		guest,
		reservationMade: new Date(),
		startDate,
		dayCount,
		prices,
	});
}

async function getRoomReservation(roomNumber: number): Promise<number | null> {
	const rooms = await ReservationModel.find({room: roomNumber});
	
	const date = new Date();
	for (let i = 0; i < rooms.length; i++) {
		const room = rooms[i];
		const startDate = room.startDate;
		const endDate = addDaysToDate(startDate, room.dayCount);
		
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
	
	const reservation = await ReservationModel.findOne({guest, reservationMade});
	if (!reservation)
		throw new ReservationNotFoundError();
	
	await ReservationModel.updateOne({
		guest,
		reservationMade,
	}, {
		$set: {room: room}
	})
}

export default {
	create,
}
