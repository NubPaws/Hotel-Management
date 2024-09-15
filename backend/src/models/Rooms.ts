import mongoose, { ObjectId, Schema } from "mongoose";
import Reservations, { ReservationNotFoundError } from "./Reservations.js";

export class RoomDoesNotExistError extends Error {}
export class RoomNumberAlreadyExistsError extends Error {}
export class RoomTypeDoesNotExistError extends Error {
	constructor(rt: string) {
		super(`Room type ${rt} does not exist.`);
	}
}
export class RoomTypeAlreadyExistsError extends Error {}

export enum RoomState {
	Clean = "Clean",
	Inspected = "Inspected",
	Dirty = "Dirty",
	OutOfOrder = "OutOfOrder",
}

interface RoomType {
	code: string,
	description: string,
}

const RoomTypeModel = mongoose.model<RoomType>(
	"RoomTypeModel",
	new Schema<RoomType>({
		code: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		}
	})
);

interface Room {
	id: number,
	typeRef: mongoose.Types.ObjectId,
	state: RoomState,
	occupied: boolean,
	reservation: mongoose.Types.ObjectId | null,
}

const RoomModel = mongoose.model<Room>(
	"RoomModel",
	new Schema<Room>({
		id: {
			type: Number,
			required: true,
			unique: true,
		},
		typeRef: {
			type: Schema.Types.ObjectId,
			ref: "RoomTypeModel",
			required: true,
		},
		state: {
			type: String,
			enum: Object.values(RoomState),
			default: RoomState.Clean,
		},
		occupied: {
			type: Boolean,
			default: false
		},
		reservation: {
			type: Schema.Types.ObjectId,
			default: null,
			ref: "ReservationModel",
		},
	}, {_id: false})
);

async function createType(code: string, description: string) {
	if (await RoomTypeModel.exists({ code }))
		throw new RoomTypeAlreadyExistsError();
	
	await RoomTypeModel.create({ code, description });
}

async function createRoom(num: number, code: string) {
	if (await RoomModel.exists({ id: num })) {
		throw new RoomNumberAlreadyExistsError();
	}
	
	const roomType = await RoomTypeModel.findOne({ code });
	if (!roomType) {
		throw new RoomTypeDoesNotExistError(code);
	}
	
	await RoomModel.create({
		id: num,
		typeRef: roomType._id,
	});
}

async function removeRoom(num: number) {
	const room = await RoomModel.findOne({ id: num });
	if (!room) {
		throw new RoomDoesNotExistError();
	}
	await RoomModel.deleteOne({ id: num });
}

/**
 * Removes the type from the database and sets all rooms of that type
 * to the new type that was given.
 * @param typeCode The type of the rooms to remove.
 * @param newTypeCode The type to set the rooms to.
 * @throws RoomTypeDoesNotExistError
 */
async function removeType(typeCode: string, newTypeCode: string) {
	const roomType = await RoomTypeModel.findOne({ code: typeCode });
	if (!roomType) {
		throw new RoomTypeDoesNotExistError(typeCode);
	}
	
	const newRoomType = await RoomTypeModel.findOne({ code: newTypeCode });
	if (!newRoomType) {
		throw new RoomTypeDoesNotExistError(newTypeCode);
	}
	
	const rooms = await RoomModel.find({ typeRef: roomType._id });
	
	// Update all rooms that have the old type to the new type.
	await RoomModel.updateMany(
		{ typeRef: roomType._id },
		{ $set: { typeRef: newRoomType._id } }
	);
	
	await RoomTypeModel.deleteOne({ code: typeCode });
}

async function changeRoomState(num: number, state: RoomState) {
	const room = await RoomModel.findOne({ id: num });
	if (!room) {
		throw new RoomDoesNotExistError();
	}
	
	room.state = state;
	await room.save();
}

async function isOccupied(num: number) {
	const room = await RoomModel.findOne({ id: num });
	if (!room) {
		throw new RoomDoesNotExistError();
	}
	return room.occupied;
}

async function setOccupied(num: number, occupied: boolean, reservationId?: string) {
	// If occupied is false.
	if (!occupied) {
		const room = await RoomModel.findOneAndUpdate(
			{ id: num },
			{ $set: { occupied: false, reservation: null } },
			{ new: true }
		);
		
		if (!room) {
			throw new RoomDoesNotExistError();
		}
		
		return;
	}
	
	if (!reservationId) {
		throw new Error("Must provide reservation id when trying to make a room occupied.");
	}
	
	// Otherwise, we have to make sure that the reservation is valid.
	const isValidReservation = await Reservations.isValidReservation(reservationId);
	if (!isValidReservation) {
		throw new ReservationNotFoundError();
	}
	
	const room = await RoomModel.findOneAndUpdate(
		{ id: num },
		{ $set: { occupied: true, reservation: new mongoose.Types.ObjectId(reservationId) } },
		{ new: true }
	);
	
	if (!room) {
		throw new RoomDoesNotExistError();
	}
}

async function getReservation(num: number) {
	const room = await RoomModel.findOne({ id: num });
	if (!room) {
		throw new RoomDoesNotExistError();
	}
	return room.reservation;
}

export default {
	createType,
	createRoom,
	removeRoom,
	removeType,
	changeRoomState,
	isOccupied,
	setOccupied,
	getReservation,
};
