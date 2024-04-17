import jwt from 'jsonwebtoken';
import environment from '../utils/environment.js';
import logger from '../utils/logger.js';
import mongoose, { Schema } from 'mongoose';

enum Role {
	Admin = "admin",
	User = "user",
}

const userSchema = new Schema({
	user: String,
	pass: String,
	role: String,
	token: String,
});

const User = mongoose.model("User", userSchema);

function jwtValidate(token: string): string | jwt.JwtPayload | null {
	try {
		return jwt.verify(token, environment.jwtSecret);
	} catch (err) {
		logger.error(`Failed to validate jwt token ${token}`);
		return null;
	}
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
	if (!creator || creator.role !== Role.Admin) {
		return null;
	}
	
	// The user is an admin.
	const token = jwt.sign({user: username, pass: password}, environment.jwtSecret);
	await User.create({
		user: username,
		pass: password,
		role: Role.User,
		token: token,
	});
	
	return token;
}

export const UserModel = {
	create,
	authenticate,
};
