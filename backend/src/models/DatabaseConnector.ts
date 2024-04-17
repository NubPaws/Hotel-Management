import mongoose from "mongoose";
import logger from "../utils/logger.js";
import environment from "../utils/environment.js";

/**
 * Connect to the database. The connection is done asynchronously.
 */
export function loadDatabase() {
	const host = environment.db.host;
	const port = environment.db.port;
	mongoose
		.connect(`mongodb://${host}:${port}/`)
		.then((res) => {
			logger.info("Connected to the Hotel's Database");
		})
		.catch((err) => {
			logger.error(`Database connection error occured - ${err}`);
		});
}
