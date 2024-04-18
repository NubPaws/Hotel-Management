import jwt, { JwtPayload } from 'jsonwebtoken';
import environment from '../utils/environment.js';
import logger from '../utils/logger.js';
import mongoose, { Schema } from 'mongoose';

export enum UserRole {
	Admin = "admin",
	User = "user",
}

interface UserPayload {
	user: string,
	pass: string,
}

// MongoDB user schema.
const userSchema = new Schema({
	user: String,
	pass: String,
	role: String,
	token: String,
});
// Creating the user model.
const User = mongoose.model("User", userSchema);

function jwtValidate(token: string): JwtPayload | null {
	try {
		const decoded = jwt.verify(token, environment.jwtSecret);
		if (typeof decoded !== "string") {
			return decoded as UserPayload;
		}
	} catch (err) {
		logger.error(`Failed to validate jwt token ${token}`);
	}
	return null;
}

async function authenticate(username: string, password: string): Promise<string | null> {
	const user = await User.findOne({ user: username, pass: password });
	if (!user) {
		return null;
	}
	return user.token as string;
}

/**
 * @returns The JWT Token that was created if a user has been created.
 * Returns null if there was an error in the user creation.
 */
async function create(username: string, password: string, creatorToken: string) {
	if (!jwtValidate(creatorToken)) {
		return null;
	}
	
	const creator = await User.findOne({ token: creatorToken });
	if (!creator || creator.role !== UserRole.Admin) {
		return null;
	}
	
	// The user is an admin so they can create a new user.
	const payload: UserPayload = {
		user: username,
		pass: password,
	};
	const token = jwt.sign(payload, environment.jwtSecret);
	await User.create({
		user: username,
		pass: password,
		role: UserRole.User,
		token: token,
	});
	
	return token;
}

export const UserModel = {
	create,
	authenticate,
};
