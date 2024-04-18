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

const roomTypeSchema = new Schema<RoomType>({
	code: String,
	description: String,
});

const RoomTypeModel = mongoose.model<RoomType>("RoomTypeModel", roomTypeSchema);

interface Room {
	id: number,
	type: string,
	state: RoomState,
	occupied: boolean,
	reservation: string | null
}

const roomSchema = new Schema<Room>({
	id: {type: Number, required: true},
	type: Schema.ObjectId,
	state: {
		type: Number,
		enum: Object.values(RoomState),
		default: RoomState.Clean,
	},
	occupied: {type: Boolean, default: false},
	reservation: {type: Schema.ObjectId, default: null},
}, {id: false});

const RoomModel = mongoose.model<Room>("RoomModel", roomSchema);

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
		type: typeObj._id
	});
}

export const Rooms = {
	createType,
	createRoom,
};
