import mongoose, { Document, Schema } from "mongoose";
import Counter from "./Counter.js";
import Reservation, { ReservationDoesNotExistError } from "./Reservation.js";

export class ExtraDoesNotExistError extends Error {
	constructor(extraId: number) {
		super(`${extraId} does not exist.`);
	}
}
export class ExtraPriceInvalidError extends Error {
	constructor(price: number) {
		super(`Price ${price} is invalid.`);
	}
}

export interface Extra extends Document {
	extraId: number
	item: string,
	description: string,
	price: number,
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
	price: {
		type: Number,
		required: true,
		validate: {
			validator: (value: number) => value >= 0,
			message: "Price must be >= 0",
		},
	},
	reservationId: {
		type: Number,
		ref: "ReservationModel",
		required: true,
		index: true,
	},
});

const ExtraModel = mongoose.model<Extra>("ExtraModel", ExtraSchema);

/**
 * Create a new extra and associate it with a reservation.
 * 
 * @param item The name of the extra item.
 * @param description The description of the extra item.
 * @param reservationId The ID of the reservation this extra belongs to.
 * @returns The created extra document.
 * @throws ReservationDoesNotExistError
 */
async function create(item: string, description: string, price: number, reservationId: number) {
	if (!(await Reservation.isValidReservation(reservationId))) {
		throw new ReservationDoesNotExistError();
	}
	
	const extraId = await Counter.increment("extraId");
	
	const extra = await ExtraModel.create({
		extraId,
		item,
		description,
		price,
		reservationId,
	});
	
	return extra;
}

/**
 * Get an extra document by its ID.
 * 
 * @param extraId The ID of the extra to retrieve.
 * @returns The extra document.
 * @throws ExtraDoesNotExistError
 */
async function getDocumentById(extraId: number) {
	const extra = await ExtraModel.findOne({ extraId });
	if (!extra) {
		throw new ExtraDoesNotExistError(extraId);
	}
	
	return extra;
}

/**
 * Get an extra by its ID.
 * 
 * @param extraId The ID of the extra to retrieve.
 * @returns The extra document.
 * @throws ExtraDoesNotExistError
 */
async function getById(extraId: number) {
	return await getDocumentById(extraId) as Extra;
}

async function getByReservationId(reservationId: number) {
    const extras = await ExtraModel.find({ reservationId });
    return extras;
}

async function setPrice(extraId: number, price: number) {
	if (price < 0) {
		throw new ExtraPriceInvalidError(price);
	}
	
	const extra = await ExtraModel.findOneAndUpdate(
		{ extraId },
		{ $set: { price } },
		{ new: true }
	);
	
	if (!extra) {
		throw new ExtraDoesNotExistError(extraId);
	}
	
	return extra;
}

async function setName(extraId: number, item: string) {
	const extra = await ExtraModel.findOneAndUpdate(
		{ extraId },
		{ $set: { item } },
		{ new: true }
	);
	
	if (!extra) {
		throw new ExtraDoesNotExistError(extraId);
	}
	
	return extra;
}

async function setDescription(extraId: number, description: string) {
    const extra = await ExtraModel.findOneAndUpdate(
        { extraId },
        { $set: { description } },
        { new: true }
    );

    if (!extra) {
        throw new ExtraDoesNotExistError(extraId);
    }

    return extra;
}

async function deleteById(extraId: number) {
    const result = await ExtraModel.deleteOne({ extraId });
    if (result.deletedCount === 0) {
        return false;
    }
    return true;
}

export default {
	create,
	getDocumentById,
	getById,
	getByReservationId,
	setPrice,
	setName,
	setDescription,
	deleteById,
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Extra:
 *       type: object
 *       required:
 *         - extraId
 *         - item
 *         - description
 *         - price
 *         - reservationId
 *       properties:
 *         extraId:
 *           type: integer
 *           description: Unique identifier for the extra.
 *           example: 101
 *         item:
 *           type: string
 *           description: Name of the extra item (e.g., breakfast, spa service).
 *           example: "Breakfast"
 *         description:
 *           type: string
 *           description: Detailed description of the extra service or item.
 *           example: "Continental breakfast included."
 *           default: ""
 *         price:
 *           type: number
 *           description: Price for the extra service or item. Must be greater than or equal to 0.
 *           example: 25.50
 *         reservationId:
 *           type: integer
 *           description: The reservation ID that the extra is associated with.
 *           example: 12345
 */
