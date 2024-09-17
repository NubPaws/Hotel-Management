import mongoose from "mongoose";
import Logger from "./Logger.js";
import Environment from "./Environment.js";

/**
 * Connect to the database. The connection is done asynchronously.
 */
export function loadDatabase() {
	const { host, port } = Environment.db;
	
	mongoose
		.connect(`mongodb://${host}:${port}/`)
		.then((_) => {
			Logger.info("Connected to the Hotel's Database");
		})
		.catch((err) => {
			Logger.error(`Database connection error occured - ${err}`);
		});
}
