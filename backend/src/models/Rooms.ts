import mongoose, { Schema } from "mongoose";

export class RoomNumberAlreadyExistsError extends Error {}
export class RoomTypeDoesNotExistError extends Error {}
export class RoomTypeAlreadyExistsError extends Error {}

export enum RoomState {
	Clean,
	Inspected,
	Dirty,
	OutOfOrder,
}

interface RoomType {
	code: string,
	description: string,
}

const RoomTypeModel = mongoose.model<RoomType>("RoomTypeModel",
	new Schema<RoomType>({
		code: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		}
	})
);

interface Room {
	id: number,
	typeRef: RoomType,
	state: RoomState,
	occupied: boolean,
	reservation: string | null
}

const RoomModel = mongoose.model<Room>(
	"RoomModel",
	new Schema<Room>({
		id: {
			type: Number,
			required: true,
		},
		typeRef: {
			type: Schema.ObjectId,
			ref: "RoomTypeModel",
			required: true,
		},
		state: {
			type: Number,
			enum: Object.values(RoomState),
			default: RoomState.Clean,
		},
		occupied: {
			type: Boolean,
			default: false
		},
		reservation: {
			type: Schema.ObjectId,
			default: null,
			ref: "ReservationModel",
		},
	}, {id: false})
);

async function createType(code: string, description: string) {
	if (await RoomTypeModel.exists({code: code}))
		throw new RoomTypeAlreadyExistsError();
	
	await RoomTypeModel.create({ code, description });
}

async function createRoom(num: number, typeCode: string) {
	if (await RoomModel.exists({id: num}))
		throw new RoomNumberAlreadyExistsError();
	
	const typeObj = await RoomTypeModel.exists({code: typeCode});
	if (!typeObj)
		throw new RoomTypeDoesNotExistError();
	
	await RoomModel.create({
		id: num,
		typeRef: typeObj._id
	});
}

async function removeRoom(num: number) {
	if (!(await RoomModel.findById(num))) {
		return;
	}
	await RoomModel.deleteOne({id: num});
}

export default {
	createType,
	createRoom,
	removeRoom,
};
