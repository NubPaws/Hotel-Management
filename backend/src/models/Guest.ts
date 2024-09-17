import mongoose, { Schema } from "mongoose";
import { Reservation } from "./Reservation.js";

export class GuestAlreadyExistsError extends Error {}
export class GuestDoesNotExistError extends Error {}

export interface Guest extends Document {
	id: number,
	fullName: string,
	email: string,
	phoneNumber: string,
	reservations: Reservation[],
}

const GuestModel = mongoose.model<Guest>(
	"GuestModel",
	new Schema<Guest>({
		id: {
			type: Number,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		reservations: [{
			type: Schema.Types.ObjectId,
			ref: "ReservationModel",
			required: true,
		}],
	}, {id: false})
);

async function create(id: number, fullName: string, email: string, phoneNumber: string) {
	if (await GuestModel.exists({id}))
		throw new GuestAlreadyExistsError();
	
	await GuestModel.create({
		id,
		fullName,
		email,
		phoneNumber,
		reservations: [],
	});
}

async function addReservation(id: number, reservationId: any) {
	if (!(await GuestModel.exists({id})))
		throw new GuestDoesNotExistError();
	
	await GuestModel.updateOne({id}, {
		$push: { reservations: reservationId }
	});
}

async function changeEmail(id: number, email: string) {
	if (!(await GuestModel.exists({id})))
		throw new GuestDoesNotExistError();
	
	await GuestModel.updateOne({id}, {
		$set: {email}
	});
}

async function changeName(id: number, fullName: string) {
	if (!(await GuestModel.exists({id})))
		throw new GuestDoesNotExistError();
	
	await GuestModel.updateOne({id}, {
		$set: {fullName}
	});
}

async function changePhoneNumber(id: number, phoneNumber: string) {
	if (!(await GuestModel.exists({id})))
		throw new GuestDoesNotExistError();
	
	await GuestModel.updateOne({id}, {
		$set: {phoneNumber}
	});
}

export default {
	create,
	addReservation,
	changeEmail,
	changeName,
	changePhoneNumber,
}
