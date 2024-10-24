import mongoose from "mongoose";
import Environment from "./Environment.js";
import Logger from "./Logger.js";
import User from "../models/User.js";
import BackOffice from "../models/BackOffice.js";

/**
 * Connect to the database. The connection is done asynchronously.
 */
export function loadDatabase() {
	const { host, port } = Environment.db;
	
	mongoose
		.connect(`mongodb://${host}:${port}/`)
		.then((_) => {
			Logger.info("Connected to the Hotel's Database");
			User.initUsersModel();
			BackOffice.initBackOffice();
		})
		.catch((err) => {
			Logger.error(`Database connection error occured - ${err}`);
		});
}
