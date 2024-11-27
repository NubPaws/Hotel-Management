import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema } from 'mongoose';
import Environment from '../utils/Environment.js';
import Logger from '../utils/Logger.js';

export class InvalidUserCredentialsError extends Error {}
export class UserDoesNotExistError extends Error {}
export class CreatorDoesNotExistError extends Error {}
export class CreatorIsNotAdminError extends Error {}
export class JwtTokenIsNotValidError extends Error {}
export class FailedToSignJwtTokenError extends Error {}
export class UserAlreadyExistsError extends Error {
	constructor(username: string) {
		super(`User ${username} already exists in the database.`)
	}
}
export class UnauthorizedUserError extends Error {}

export interface UserPayload {
	user: string;
}

export enum UserRole {
	Admin = "Admin",
	User = "User",
}

export enum Department {
	General = "General",
	FrontDesk = "FrontDesk",
	Housekeeping = "Housekeeping",
	Maintenance = "Maintenance",
	FoodAndBeverage = "FoodAndBeverage",
	Security = "Security",
	Concierge = "Concierge",
}

export interface User extends Document {
	user: string,
	pass: string,
	role: UserRole,
	department: Department,
}

const UserSchema = new Schema<User>({
	user: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	pass: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: Object.values(UserRole),
		default: UserRole.User,
	},
	department: {
		type: String,
		enum: Object.values(Department),
		default: Department.General,
	},
});

// Creating the user model.
const UserModel = mongoose.model<User>("UserModel", UserSchema);

async function isAdminUserExists() {
	return await UserModel.exists({ role: UserRole.Admin }) !== null;
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
			user: Environment.defaultAdminCreds.user,
			pass: Environment.defaultAdminCreds.pass,
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
	const users = await UserModel.find({user: username});
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
async function createUser(
	username: string,
	password: string,
	role: UserRole,
	department: Department
): Promise<string> {
	if (await UserModel.exists({ user: username }) !== null) {
		throw new UserAlreadyExistsError(username);
	}
	
	// The user is an admin so they can create a new user.
	const token = getJwtToken(username) as string;
	
	await UserModel.create({
		user: username,
		pass: password,
		role: role,
		department: department,
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
	
	return UserModel.exists({user: payload.user}) !== null;
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
 * Checks whether a user exists or not based on the username.
 * 
 * @param username The username to check if it exists.
 * @returns true if the user exists, false otherwise.
 */
async function doesUserExist(username: string): Promise<boolean> {
	return await UserModel.exists({ user: username }) !== null;
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

/**
 * Change the user's department.
 * @param username
 * @param newDepartment
 * @throws UserDoesNotExistError
 */
async function changeDepartment(username: string, newDepartment: Department) {
	const user = await UserModel.findOne({ user: username });
	
	if (!user) {
		throw new UserDoesNotExistError();
	}
	
	user.department = newDepartment;
	
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
	doesUserExist,
	changePassword,
	changeRole,
	changeDepartment,
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The unique username for the user.
 *           example: "john_doe"
 *         pass:
 *           type: string
 *           description: The user's password.
 *           example: "password123"
 *         role:
 *           type: string
 *           enum:
 *             - Admin
 *             - User
 *           description: The role assigned to the user.
 *           example: "User"
 *         department:
 *           type: string
 *           enum:
 *             - General
 *             - FrontDesk
 *             - Housekeeping
 *             - Maintenance
 *             - Security
 *             - Concierge
 *           description: The department the user works in.
 *           example: "FrontDesk"
 */
