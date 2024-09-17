import jwt from 'jsonwebtoken';
import Environment from '../utils/Environment.js';
import Logger from '../utils/Logger.js';
import mongoose, { Schema } from 'mongoose';

export class InvalidUserCredentialsError extends Error {}
export class UserDoesNotExistError extends Error {}
export class CreatorDoesNotExistError extends Error {}
export class CreatorIsNotAdminError extends Error {}
export class JwtTokenIsNotValidError extends Error {}
export class FailedToSignJwtTokenError extends Error {}

export interface UserPayload {
	user: string;
}

export enum UserRole {
	Admin,
	User,
}

interface User extends Document {
	user: string,
	pass: string,
	role: UserRole,
}

const UserSchema = new Schema<User>({
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
		enum: Object.values(UserRole).filter(value => typeof value === "number"),
		default: UserRole.User,
	}
});

// Creating the user model.
const UserModel = mongoose.model<User>("UserModel", UserSchema);

async function isAdminUserExists() {
	return await UserModel.exists({role: UserRole.Admin }).exec() !== null;
}

/**
 * Creates default user called admin with username and password being admin.
 * This mustn't be kept in production and must be changed when deploying the
 * user on other machines.
 */
async function initUsersModel(): Promise<boolean> {
	try {
		if (await isAdminUserExists()) {
			Logger.info("Admin user exists.");
			Logger.info("Skipping creation of default admin user.");
			return true;
		}
		
		Logger.warn("Admin user doesn't exists.")
		Logger.info("Starting creation of default admin user.");
		await UserModel.create({
			user: "admin",
			pass: "admin",
			role: UserRole.Admin,
		});
		
		if (await isAdminUserExists()) {
			Logger.info("Default admin user created");
			return true;
		}
	} catch (err) {
		Logger.error("Failed to create default admin user.");
		Logger.error("Note there are no admin users in the system.");
		Logger.error("Something has gone terribly wrong!");
		Logger.error(`${err}`);
	}
	return false;
}

/**
 * @param username The username to load as the payload.
 * @returns The jwt token of the payload.
 * @throws FailedToSignJwtTokenError if the signing of the jwt token failed.
 */
function getJwtToken(username: string): string {
	try {
		return jwt.sign({user: username}, Environment.jwtSecret);
	} catch (err) {
		Logger.error(`${err}`);
		throw new FailedToSignJwtTokenError();
	}
}

/**
 * @param token The jwt token to get the payload from.
 * @returns The payload stored in the jwt token.
 * @throws JwtTokenIsNotValidError if the token is not valid.
 */
function getJwtPayload(token: string): UserPayload {
	try {
		const decoded = jwt.verify(token, Environment.jwtSecret);
		if (typeof decoded === "string") {
			return { user: decoded };
		}
		return decoded as UserPayload;
	} catch (err) {
		Logger.error(`Failed to validate jwt token ${token}`);
		throw new JwtTokenIsNotValidError();
	}
}

/**
 * @param username
 * @param password
 * @returns The token of the user if he does exist in the database with that password.
 * @throws InvalidUserCredentialsError if the username doesn't exist or the password
 * doesn't match.
 */
async function authenticate(username: string, password: string) {
	const users = await UserModel.find({user: username}).exec();
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
	const user = await UserModel.findOne({user: username});
	if (!user) {
		return false;
	}
	
	return user.role === UserRole.Admin;
}

/**
 * @returns The JWT Token that was created if a user has been created.
 * @throws JwtTokenIsNotValidError
 * @throws CreatorDoesNotExistError
 * @throws CreatorIsNotAdminError
 */
async function createUser(username: string, password: string, role: UserRole, creatorToken: string): Promise<string> {
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
		role: role,
	});
	
	return token;
}

/**
 * Given a jwt token, checks whether or not the user is part of the system.
 * @param jwtToken
 * @returns true whether the username exists, false otherwise.
 */
async function isUser(jwtToken: string) {
	const payload = getJwtPayload(jwtToken);
	if (!payload) {
		throw new JwtTokenIsNotValidError();
	}
	
	return UserModel.exists({user: payload.user}).exec();
}

/**
 * Returns a user based on their username.
 * @param username the username to fetch.
 * @returns User object.
 * @throws UserDoesNotExistsError if the username isn't in the database.
 */
async function getUser(username: string): Promise<User> {
	const user = await UserModel.findOne({user: username}).exec();
	if (!user) {
		Logger.warn(`User ${username} doesn't exists in the system.`);
		throw new UserDoesNotExistError();
	}
	return user as User;
}

/**
 * Change a user's password.
 * @param username
 * @param newPassword
 * @throws UserDoesNotExistError
 */
async function changePassword(username: string, newPassword: string) {
	const user = await UserModel.findOne({ user: username });
	
	if (!user) {
		throw new UserDoesNotExistError();
	}
	
	user.pass = newPassword;
	
	await user.save();
}

/**
 * Change the user's role.
 * @param username
 * @param newRole
 * @throws UserDoesNotExistError
 */
async function changeRole(username: string, newRole: UserRole) {
	const user = await UserModel.findOne({ user: username });
	
	if (!user) {
		throw new UserDoesNotExistError();
	}
	
	user.role = newRole;
	
	await user.save();
}

export default {
	initUsersModel,
	getJwtPayload,
	authenticate,
	createUser,
	isAdmin,
	isUser,
	getUser,
	changePassword,
	changeRole,
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         reservationId:
 *           type: integer
 *           description: The auto-incrementing ID of the reservation.
 *           example: 1
 *         reservationMade:
 *           type: string
 *           format: date-time
 *           description: The date and time the reservation was made.
 *           example: "2024-09-17T12:34:56Z"
 *         startDate:
 *           type: string
 *           format: date
 *           description: The start date of the reservation.
 *           example: "2024-09-20"
 *         startTime:
 *           type: string
 *           description: The start time in HH:mm 24-hour format.
 *           example: "14:00"
 *         nightCount:
 *           type: integer
 *           description: The number of nights for the reservation.
 *           example: 3
 *         endTime:
 *           type: string
 *           description: The end time in HH:mm 24-hour format.
 *           example: "11:00"
 *         prices:
 *           type: array
 *           items:
 *             type: number
 *           description: An array of prices for each night of the reservation.
 *           example: [100.00, 120.00, 110.00]
 *         room:
 *           type: integer
 *           description: The ID of the room associated with the reservation, or null if none.
 *           example: 101
 *         state:
 *           type: string
 *           enum: [Pending, Active, Cancelled, Passed]
 *           description: The current state of the reservation.
 *           example: "Pending"
 *         extras:
 *           type: array
 *           items:
 *             type: integer
 *           description: An array of extra IDs associated with the reservation.
 *           example: [1, 2]
 *         guest:
 *           type: integer
 *           description: The ID of the guest associated with the reservation.
 *           example: 1
 *         email:
 *           type: string
 *           description: The email of the guest.
 *           example: "guest@example.com"
 *         phone:
 *           type: string
 *           description: The phone number of the guest.
 *           example: "+123456789"
 *
 *     Extra:
 *       type: object
 *       properties:
 *         extraId:
 *           type: integer
 *           description: The auto-incrementing ID of the extra.
 *           example: 1
 *         item:
 *           type: string
 *           description: The name of the extra item.
 *           example: "Breakfast"
 *         description:
 *           type: string
 *           description: A description of the extra item.
 *           example: "Continental breakfast included."
 *         reservationId:
 *           type: integer
 *           description: The ID of the reservation this extra belongs to.
 *           example: 1
 */
