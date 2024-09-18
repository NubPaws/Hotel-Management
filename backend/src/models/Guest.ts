import mongoose, { Schema } from "mongoose";
import { Email, isEmailString } from "../utils/Email.js";
import Counter from "./Counter.js";

export class GuestAlreadyExistsError extends Error {}
export class GuestDoesNotExistError extends Error {}

export interface Guest extends Document {
	guestId: number,
	fullName: string,
	title: string,
	email: Email,
	phone: string,
	reservations: number[],
}

const GuestSchema = new Schema<Guest>({
	guestId: {
		type: Number,
		required: true,
		unique: true,
		index: true,
	},
	fullName: {
		type: String,
		required: true,
		index: true,
		validate: {
			validator: (fname: string) => fname.length > 0,
			message: "Name must not be an empty string.",
		},
	},
	title: {
		type: String,
		required: true,
		default: "",
	},
	email: {
		type: String,
		required: false,
		validate: {
			validator: (value: string) => isEmailString(value),
			message: "Email is not in a valid format.",
		},
	},
	phone: {
		type: String,
		required: false,
		index: true,
	},
	reservations: [{
		type: Number,
		ref: "ReservationModel",
	}],
}, { _id: false });

GuestSchema.pre("save", async function (next) {
	const doc = this;
	if (doc.isNew) {
		const counter = await Counter.increment("guestId");
		doc.guestId = counter;
	}
	next();
});

const GuestModel = mongoose.model<Guest>("GuestModel", GuestSchema);

async function create(id: number, fullName: string, email: string, phoneNumber: string) {
	if (await GuestModel.exists({guestId: id}))
		throw new GuestAlreadyExistsError();
	
	await GuestModel.create({
		guestId: id,
		fullName,
		email,
		phone: phoneNumber,
		reservations: [],
	});
}

async function addReservation(id: number, reservationId: any) {
	if (!(await GuestModel.exists({guestId: id})))
		throw new GuestDoesNotExistError();
	
	await GuestModel.updateOne({guestId: id}, {
		$push: { reservations: reservationId }
	});
}

async function changeEmail(id: number, email: string) {
	if (!(await GuestModel.exists({guestId: id})))
		throw new GuestDoesNotExistError();
	
	await GuestModel.updateOne({guestId: id}, {
		$set: {email}
	});
}

async function changeName(id: number, fullName: string) {
	if (!(await GuestModel.exists({guestId: id})))
		throw new GuestDoesNotExistError();
	
	await GuestModel.updateOne({guestId: id}, {
		$set: {fullName}
	});
}

async function changePhoneNumber(id: number, phoneNumber: string) {
	if (!(await GuestModel.exists({guestId: id})))
		throw new GuestDoesNotExistError();
	
	await GuestModel.updateOne({guestId: id}, {
		$set: {phone: phoneNumber}
	});
}

export default {
	create,
	addReservation,
	changeEmail,
	changeName,
	changePhoneNumber,
}
