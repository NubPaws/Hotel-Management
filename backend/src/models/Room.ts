import mongoose, { Schema } from "mongoose";
import Reservations, { ReservationNotFoundError } from "./Reservations.js";

export class RoomDoesNotExistError extends Error {
	constructor(num: number) {
		super(`Room #${num} does not exist.`)
	}
}
export class RoomNumberAlreadyExistsError extends Error {}
export class RoomTypeDoesNotExistError extends Error {
	constructor(rt: string) {
		super(`Room type ${rt} does not exist.`);
	}
}
export class RoomTypeAlreadyExistsError extends Error {}
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

interface Room extends Document {
	id: number,
	typeRef: mongoose.Types.ObjectId,
	state: RoomState,
	occupied: boolean,
	reservation: mongoose.Types.ObjectId | null,
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
	}, { _id: false })
);

/**
 * @param num The room number to get.
 * @returns Room
 * @throws RoomDoesNotExistError
 */
async function findRoomById(num: number) {
	const room = await RoomModel.findOne({ id: num });
	if (!room) {
		throw new RoomDoesNotExistError(num);
	}
	
	return room;
}

async function createType(code: string, description: string) {
	if (await RoomTypeModel.exists({ code })) {
		throw new RoomTypeAlreadyExistsError();
	}
	
	await RoomTypeModel.create({ code, description });
}

async function createRoom(num: number, code: string) {
	// This will throw an error if there isn't a room like that.
	// We'll just ignore the return value.
	await findRoomById(num);
	
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
	await findRoomById(num);
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
	
	// Update all rooms that have the old type to the new type.
	await RoomModel.updateMany(
		{ typeRef: roomType._id },
		{ $set: { typeRef: newRoomType._id } }
	);
	
	await RoomTypeModel.deleteOne({ code: typeCode });
}

async function changeRoomState(num: number, state: RoomState) {
	const room = await findRoomById(num);
	
	room.state = state;
	await room.save();
}

/**
 * @param num room number
 * @returns whether the room is occupied or not.
 * @throws RoomDoesNotExistError
 */
async function isRoomOccupied(num: number): Promise<boolean> {
	const room = await findRoomById(num);
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
async function setRoomOccupation(num: number, occupied: boolean, reservationId?: string) {
	// If occupied is false.
	if (!occupied) {
		const room = await RoomModel.findOneAndUpdate(
			{ id: num },
			{ $set: { occupied: false, reservation: null } },
			{ new: true }
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
	const isValidReservation = await Reservations.isValidReservation(reservationId);
	if (!isValidReservation) {
		throw new ReservationNotFoundError();
	}
	
	const room = await RoomModel.findOneAndUpdate(
		{ id: num },
		{ $set: {
			occupied: true,
			reservation: new mongoose.Types.ObjectId(reservationId),
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
async function getRoomReservation(num: number): Promise<mongoose.Types.ObjectId | null> {
	const room = await findRoomById(num);
	return room.reservation;
}

export default {
	findRoomById,
	createType,
	createRoom,
	removeRoom,
	removeType,
	changeRoomState,
	isRoomOccupied,
	setRoomOccupation,
	getRoomReservation,
};
