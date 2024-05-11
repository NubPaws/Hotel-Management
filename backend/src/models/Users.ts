import jwt from 'jsonwebtoken';
import environment from '../utils/environment.js';
import logger from '../utils/logger.js';
import mongoose, { Schema } from 'mongoose';

export class InvalidUserCredentialsError extends Error {}
export class UserDoesNotExistError extends Error {}
export class CreatorDoesNotExistError extends Error {}
export class CreatorIsNotAdminError extends Error {}
export class JwtTokenIsNotValidError extends Error {}

interface UserPayload {
	user: string,
}

export enum UserRole {
	Admin,
	User,
}

interface User {
	user: string,
	pass: string,
	role: UserRole,
}

// Creating the user model.
const UserModel = mongoose.model<User>(
	"UserModel",
	new Schema<User>({
		user: {
			type: String,
			required: true,
		},
		pass: {
			type: String,
			required: true,
		},
		role: {
			type: Number,
			enum: Object.values(UserRole),
			default: UserRole.User,
		},
	})
);

/**
 * @param username The username to load as the payload.
 * @returns The jwt token of the payload or undefined if an error occured.
 */
function getJwtToken(username: string): string | undefined {
	try {
		return jwt.sign({username}, environment.jwtSecret);
	} catch (err) {
		console.log(err);
	}
	return undefined;
}

/**
 * @param token The jwt token to get the payload from.
 * @returns The payload stored in the jwt token or null if an error occured.
 */
function getJwtPayload(token: string): UserPayload | null {
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

/**
 * @param username
 * @param password
 * @returns The token of the user if he does exist in the database with that password.
 * @throws InvalidUserCredentialsError if the username doesn't exist or the password
 * doesn't match.
 */
async function authenticate(username: string, password: string) {
	const users = await UserModel.find({username});
	if (users.length === 0) {
		throw new InvalidUserCredentialsError();
	}
	
	const user = users[0].toObject();
	if (user.pass !== password) {
		throw new InvalidUserCredentialsError();
	}
	
	return getJwtToken(username);
}

async function isAdmin(username: string): Promise<boolean> {
	const user = await UserModel.findOne({username});
	if (!user) {
		return false;
	}
	
	return user.role === UserRole.Admin;
}

/**
 * @returns The JWT Token that was created if a user has been created.
 * Returns null if there was an error in the user creation.
 */
async function createUser(username: string, password: string, creatorToken: string): Promise<string> {
	if (!getJwtPayload(creatorToken)) {
		throw new JwtTokenIsNotValidError();
	}
	
	const creator = await getJwtPayload(creatorToken);
	if (!creator) {
		throw new CreatorDoesNotExistError();
	}
	if (!(await isAdmin(creator.user))) {
		throw new CreatorIsNotAdminError();
	}
	
	// The user is an admin so they can create a new user.
	const payload: UserPayload = {
		user: username,
	};
	const token = getJwtToken(username) as string;
	await UserModel.create({
		user: username,
		pass: password,
		role: UserRole.User,
		token: token,
	});
	
	return token;
}

export default {
	getJwtPayload,
	authenticate,
	createUser,
	isAdmin,
};
