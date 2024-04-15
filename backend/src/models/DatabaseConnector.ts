import mongoose, { ConnectOptions } from "mongoose";

export async function loadDatabase(ip: string, port: string) {
	await mongoose
		.connect(`mongodb://${ip}:${port}/hotel`, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		} as ConnectOptions)
		.then((res) => {
			console.log("[server]: Connected to the Hotel's Database");
		})
		.catch((err) => {
			console.log(`[server]: Database connection error occured - err`);
		});
}
