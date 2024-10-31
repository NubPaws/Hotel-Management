import mongoose, { Document, Schema } from "mongoose";
import { Email, isEmailString } from "../utils/Email.js";
import Counter from "./Counter.js";
import Logger from "../utils/Logger.js";

export class GuestAlreadyExistsError extends Error {}
export class GuestDoesNotExistError extends Error {}
export class GuestCreationError extends Error {}
export class GuestUpdateError extends Error {}
export class InvalidGuestCredentialsError extends Error {}
export class GuestSearchFailedError extends Error {}

export interface Guest extends Document {
	guestId: number,                     // System's ID for each guest.
	identification: string,              // Actual guest's ID used for identification.
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
	identification: {
		type: String,
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
			validator: (value: string) => isEmailString(value) || value === "",
			message: "Email is not in a valid format.",
		},
	},
	phone: {
		type: String,
		required: false,
	},
	reservations: [{
		type: Number,
		ref: "ReservationModel",
	}],
});

const GuestModel = mongoose.model<Guest>("GuestModel", GuestSchema);

/**
 * Create a new guest and adds them to the system.
 * 
 * @param identification Real life ID number (or string) used to identify the
 * guest as the person they claim they are.
 * @param fullName The full name of the guest.
 * @param email The email address of the guest, for more information on
 * how it should look you can look up the Email type.
 * @param phone The phone number of the guest.
 * @param title The title of guest if they have any.
 * @returns The newly created guest.
 * @throws GuestAlreadyExistsError
 */
async function create(
	identification: string,
	fullName: string,
	email: Email,
	phone: string,
	title: string = ""
) {
	if (await GuestModel.findOne({ identification }) !== null) {
		throw new GuestAlreadyExistsError();
	}
	
	try {
		const guestId = await Counter.increment("guestId");
		
		return await GuestModel.create({
			guestId,
			identification,
			fullName,
			title,
			email,
			phone,
			reservations: [],
		});
	} catch (err: any) {
		Logger.error(`Failed to create guest ${err.message}`);
		throw new GuestCreationError(err.message);
	}
}

/**
 * Returns the Guest mongoose document based on the ID.
 * 
 * @param guestId The ID of the guest to get.
 * @returns The guest with that ID as a document.
 * @throws GuestDoesNotExistError
 */
async function getById(guestId: number) {
	const guest = await GuestModel.findOne({ guestId });
	if (!guest) {
		throw new GuestDoesNotExistError();
	}
	
	return guest;
}

/**
 * Returns the Guest mongoose document based on the identification.
 * 
 * @param identification The identification of the guest to get.
 * @returns The guest with that ID as a document.
 * @throws GuestDoesNotExistError
 */
async function getByIdentification(identification: string) {
	const guest = await GuestModel.findOne({ identification });
	if (!guest) {
		throw new GuestDoesNotExistError();
	}
	
	return guest;
}

/**
 * Finds the guest who made the reservation and returns it.
 * 
 * @param reservationId The ID of the reservation that the guest made.
 * @returns The guest mongoose document that made the reservation.
 */
async function getByReservation(reservationId: number) {
	const guest = await GuestModel.findOne({ reservations: reservationId });
	
	if (!guest) {
		throw new GuestDoesNotExistError();
	}
	
	return guest;
}

/**
 * Add a reservation ID to the guest as to make it his own.
 * 
 * @param guestId The guest ID to add the reservation to.
 * @param reservationId The reservation ID to add to the guest.
 * @returns The guest document with the reservation added to them.
 * @throws GuestUpdateError if the update failed.
 */
async function addReservation(guestId: number, reservationId: number) {
	const existingGuest = await GuestModel.findOne({ reservations: reservationId });
	
	if (existingGuest) {
		throw new GuestUpdateError("Reservation is already taken");
	}
	
	const guest = await GuestModel.findOneAndUpdate(
		{ guestId },
		{ $push: { reservations: reservationId } },
		{ new: true }
	);
	
	if (!guest) {
		throw new GuestUpdateError(`Failed to find guest ${guestId}`);
	}
	return guest;
}

/**
 * Updated a guest with the field that is specified and value.
 * 
 * @param guestId The guest ID to update the field of.
 * @param field The name of the field to update.
 * @param value The value of the field to update.
 * @returns The guest document after updating the field.
 * @throws GuestUpdateError
 */
async function updateGuestField(guestId: number, field: keyof Guest, value: any) {
	try {
		const updateData = { [field]: value };
		const guest = await GuestModel.findOneAndUpdate(
			{ guestId },
			{ $set: updateData },
			{ new: true }
		);
		
		if (!guest) {
			throw new GuestUpdateError(`Failed to update ${field}.`);
		}
		
		return guest;
	} catch (err: any) {
		throw new GuestUpdateError(`Failed to update ${field}: ${err.message}`);
	}
}

async function setEmail(guestId: number, email: Email) {
	return await updateGuestField(guestId, "email", email);
}

async function setName(guestId: number, fullName: string) {
	return await updateGuestField(guestId, "fullName", fullName);
}

async function setPhone(guestId: number, phone: string) {
	return await updateGuestField(guestId, "phone", phone);
}

async function query(
	identification?: string | any,
	fullName?: string | any,
	email?: string | any,
	phone?: string | any,
	reservationId?: number | any
) {
	// Build the search criteria dynamically based on the
	// parameters that were passed.
	const criteria: any = {};
	
	function addCriteria(criteria: any, field: keyof any, value: string) {
		criteria[field] = {
			$regex: new RegExp(value, "i")
		};
	}
	
	if (identification) {
		addCriteria(criteria, "identification", identification as string);
	}
	if (fullName) {
		addCriteria(criteria, "fullName", fullName as string);
	}
	if (email) {
		addCriteria(criteria, "email", (email as string).replaceAll(".", "\\."));
	}
	if (phone) {
		addCriteria(criteria, "phone", phone as string);
	}
	if (reservationId) {
		criteria.reservations = Number(reservationId);
	}
	
	try {
		const guests = Object.keys(criteria).length === 0
			? await GuestModel.find({})
			: await GuestModel.find(criteria);
		
		return guests;
	} catch (err: any) {
		throw new GuestSearchFailedError(err.message);
	}
}

export default {
	create,
	getById,
	getByIdentification,
	getByReservation,
	addReservation,
	updateGuestField,
	setEmail,
	setName,
	setPhone,
	query,
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Guest:
 *       type: object
 *       properties:
 *         guestId:
 *           type: integer
 *           description: The system's unique ID for each guest.
 *           example: 123
 *         identification:
 *           type: string
 *           description: The real-life ID number or string used to identify the guest.
 *           example: "ID123456789"
 *         fullName:
 *           type: string
 *           description: The full name of the guest.
 *           example: "John Doe"
 *         title:
 *           type: string
 *           description: The title of the guest if they have any.
 *           example: "Mr."
 *         email:
 *           type: string
 *           description: The email address of the guest.
 *           example: "johndoe@example.com"
 *         phone:
 *           type: string
 *           description: The phone number of the guest.
 *           example: "+1-800-555-1234"
 *         reservations:
 *           type: array
 *           items:
 *             type: integer
 *           description: An array of reservation IDs associated with the guest.
 *           example: [101, 102, 103]
 */
