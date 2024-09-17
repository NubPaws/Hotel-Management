import mongoose, { Schema } from "mongoose";
import CounterModel from "./Counter.js";

export interface Extra extends Document {
	extraId: number
	item: string,
	description: string,
	reservationId: number,
}

const ExtraSchema = new Schema<Extra>({
	extraId: {
		type: Number,
		required: true,
		unique: true,
		index: true,
	},
	item: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
		default: "",
	},
	reservationId: {
		type: Number,
		ref: "ReservationModel",
		required: true,
		index: true,
	},
}, { _id: false } );

const ExtraModel = mongoose.model<Extra>("ExtraModel", ExtraSchema);

ExtraSchema.pre("save", async function (next) {
	const doc = this;
	if (doc.isNew) {
		const counter = await CounterModel.increment("extraId");
		doc.extraId = counter;
	}
	next();
});

export default {
	
};
