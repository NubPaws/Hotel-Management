import mongoose, { Schema } from "mongoose";
import { Guest } from "./Guests.js";

export interface Reservation {
	guest: Guest,
	startDate: Date,
	endDate: Date,
	prices: number[],
	
}

const ReservationModel = mongoose.model<Reservation>(
	"ReservationModel",
	new Schema<Reservation>({
		guest: {
			type: Schema.ObjectId,
			ref: "GuestModel",
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		prices: [{
			type: Number,
			required: true,
		}],
	})
);

export default {
	
}
