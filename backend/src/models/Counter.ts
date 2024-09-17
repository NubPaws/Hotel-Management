import mongoose, { Document, Schema, trusted } from "mongoose";
import logger from "../utils/logger.js";

const DUPLICATE_ERROR_KEY_CODE = 1100;

interface Counter extends Document {
	name: string;
	value: number;
}

const CounterSchema = new Schema<Counter>({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	value: {
		type: Number,
		required: true,
		default: 0,
	}
});

const CounterModel = mongoose.model<Counter>("CounterModel", CounterSchema);

/**
 * Creates a new counter with the default value.
 * 
 * @param name The name of the counter to create, must be a unique counter.
 * @returns Promise with true if the creation was successful, false otherwise.
 */
async function create(name: string): Promise<boolean> {
	try {
		await CounterModel.create({ name });
	} catch (err: any) {
		if (err.code === DUPLICATE_ERROR_KEY_CODE) {
			logger.error("Duplicate key detected");
		}
		return false;
	}
	return true;
}

/**
 * Updates a counter by adding the incCount to it. If a counter with that name
 * does not yet exist in the database, creates a new counter with that name
 * and does then increments.
 * 
 * @param name The name of the counter to increment.
 * @param incCount The amount to increment by, default is 1.
 * @returns Promise with the new number if the increment was successful.
 */
async function increment(name: string, incCount: number = 1): Promise<number> {
	const counter = await CounterModel.findOneAndUpdate(
		{ name },
		{ $inc: { value: incCount } },
		{ new: true, upsert: true }
	);
	
	return counter.value;
}

async function decrement(name: string, decCount: number = 1): Promise<number> {
	return await increment(name, -decCount);
}

/**
 * Returns the current value of a counter.
 * 
 * @param name The name of the counter.
 * @returns Promise with the number of the current counter.
 * -1 if there is no counter.
 */
async function get(name: string): Promise<number> {
	const counter = await CounterModel.findOne({ name });
	if (!counter) {
		return -1;
	}
	
	return counter.value;
}

/**
 * Sets the value of a counter using the passed value. If the
 * counter does not exists with the given name, then creates a new
 * counter and gives it the value passed.
 * 
 * @param name Name of the counter.
 * @param val Value to set.
 */
async function set(name: string, val: number) {
	const counter = await CounterModel.findOneAndUpdate(
		{ name },
		{ $set: { value: val } },
		{ new: true, upsert: true }
	);
}

export default {
	create,
	increment,
	decrement,
	get,
	set,
}
