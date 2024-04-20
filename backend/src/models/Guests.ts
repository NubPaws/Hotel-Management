import mongoose, { Schema } from "mongoose";
import { Reservation } from "./Reservations.js";

export class GuestAlreadyExistsError extends Error {}
export class GuestDoesNotexistError extends Error {}

export interface Guest {
	id: number,
	fullName: string,
	email: string,
	reservations: Reservation[],
}

const GuestModel = mongoose.model<Guest>(
	"GuestModel",
	new Schema<Guest>({
		id: {
			type: Number,
			required: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		reservations: [{
			type: Schema.ObjectId,
			ref: "ReservationModel",
			required: true,
		}],
	}, {id: false})
);

async function create(id: number, fullName: string, email: string) {
	if (await GuestModel.exists({id}))
		throw new GuestAlreadyExistsError();
	
	await GuestModel.create({
		id,
		fullName,
		email,
		reservations: [],
	});
}

async function addReservation(id: number, reservationId: any) {
	if (!(await GuestModel.exists({id})))
		throw new GuestDoesNotexistError();
	
	await GuestModel.updateOne({id}, {
		$push: { reservations: reservationId }
	});
}

export default {
	create,
	addReservation,
}
