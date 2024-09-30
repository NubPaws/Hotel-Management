import mongoose, { Document, Schema } from "mongoose";
import ReservationModel, { ReservationNotFoundError } from "./Reservation.js";

export class RoomDoesNotExistError extends Error {
	constructor(num: number) {
		super(`Room #${num} does not exist.`);
	}
}
export class RoomNumberAlreadyExistsError extends Error {
	constructor(num: number) {
		super(`Room #${num} already exists.`);
	}
}
export class RoomTypeDoesNotExistError extends Error {
	constructor(rt: string) {
		super(`Room type ${rt} does not exist.`);
	}
}
export class RoomTypeAlreadyExistsError extends Error {
	constructor(rt: string) {
		super(`Room type ${rt} does not exist.`);
	}
}
export class MissingReservationIdError extends Error {
	constructor() {
		super("Must provide reservation id when trying to make a room occupied.");
	}
}

export enum RoomState {
	Clean = "Clean",
	Inspected = "Inspected",
	Dirty = "Dirty",
	OutOfOrder = "OutOfOrder",
}

interface RoomType extends Document {
	code: string,
	description: string,
}

const RoomTypeSchema = new Schema<RoomType>({
	code: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	description: {
		type: String,
		required: true,
	}
});

const RoomTypeModel = mongoose.model<RoomType>("RoomTypeModel", RoomTypeSchema);

interface Room extends Document {
	roomId: number,
	type: string,
	state: RoomState,
	occupied: boolean,
	reservation: number | null,
}

const RoomSchema = new Schema<Room>({
	roomId: {
		type: Number,
		required: true,
		unique: true,
		index: true,
	},
	type: {
		type: String,
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
		type: Number,
		default: null,
		ref: "ReservationModel",
	},
});

const RoomModel = mongoose.model<Room>("RoomModel", RoomSchema);

/**
 * @param num The room number to get.
 * @returns Room
 * @throws RoomDoesNotExistError
 */
async function getDocumentById(roomId: number) {
	const room = await RoomModel.findOne({ roomNum: roomId });
	if (!room) {
		throw new RoomDoesNotExistError(roomId);
	}
	
	return room;
}

async function isValidRoom(num: number): Promise<boolean> {
	try {
		await getDocumentById(num);
	} catch (err: any) {
		if (err instanceof RoomDoesNotExistError) {
			return false;
		}
	}
	return true;
}

async function createType(code: string, description: string) {
	if (await RoomTypeModel.exists({ code })) {
		throw new RoomTypeAlreadyExistsError(code);
	}
	
	await RoomTypeModel.create({ code, description });
}

async function createRoom(num: number, code: string) {
	// This will throw an error if there isn't a room like that.
	// We'll just ignore the return value.
	await getDocumentById(num);
	
	const roomType = await RoomTypeModel.findOne({ code });
	if (!roomType) {
		throw new RoomTypeDoesNotExistError(code);
	}
	
	await RoomModel.create({
		roomNum: num,
		type: code,
	});
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
	
	// Update all rooms that have the old type to the new type.
	await RoomModel.updateMany(
		{ typeRef: roomType._id },
		{ $set: { typeRef: newRoomType._id } }
	);
	
	await RoomTypeModel.deleteOne({ code: typeCode });
}

async function removeRoom(num: number) {
	await getDocumentById(num);
	await RoomModel.deleteOne({ roomNum: num });
}

async function changeRoomState(num: number, state: RoomState) {
	const room = await getDocumentById(num);
	
	room.state = state;
	await room.save();
}

/**
 * @param num room number
 * @returns whether the room is occupied or not.
 * @throws RoomDoesNotExistError
 */
async function isRoomOccupied(num: number): Promise<boolean> {
	const room = await getDocumentById(num);
	return room.occupied;
}

/**
 * @param num room number to set occupation to.
 * @param occupied true or false.
 * @param reservationId if occupied is true, then this needs to hold the value of the
 * reservation the the room currently has. Otherwise, this can stay undefined.
 * @throws RoomDoesNotExistError
 * @throws MissingReservationIdError
 */
async function setRoomOccupation(num: number, occupied: boolean, reservationId?: number) {
	// If occupied is false.
	if (!occupied) {
		const room = await RoomModel.findOneAndUpdate(
			{ roomNum: num },
			{ $set: { occupied: false, reservation: null } },
			{ new: true },
		);
		
		if (!room) {
			throw new RoomDoesNotExistError(num);
		}
		
		return;
	}
	
	if (!reservationId) {
		throw new Error("Must provide reservation id when trying to make a room occupied.");
	}
	
	// Otherwise, we have to make sure that the reservation is valid.
	const isValidReservation = await ReservationModel.isValidReservation(reservationId);
	if (!isValidReservation) {
		throw new ReservationNotFoundError();
	}
	
	const room = await RoomModel.findOneAndUpdate(
		{ roomNum: num },
		{ $set: {
			occupied: true,
			reservation: reservationId,
		} },
		{ new: true }
	);
	
	if (!room) {
		throw new RoomDoesNotExistError(num);
	}
}

/**
 * @param num Room number to get the reservation from.
 * @returns ObjectId of the reservation, or null if no active reservation.
 * @throws RoomDoesNotExistError
 */
async function getRoomReservation(num: number): Promise<number | null> {
	const room = await getDocumentById(num);
	return room.reservation;
}

export default {
	getDocumentById,
	isValidRoom,
	
	createType,
	createRoom,
	
	removeType,
	removeRoom,
	
	changeRoomState,
	isRoomOccupied,
	setRoomOccupation,
	getRoomReservation,
};
