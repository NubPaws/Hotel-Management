import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/StatusCode.js";
import UserModel, { Department, InvalidUserCredentialsError, User, UserRole } from "../models/User.js";

interface ValidationResponse {
	status: boolean,
	error: Map<string, string> | null,
	respond: (res: Response) => Response;
};

/**
 * A helper function to check whether or not something is valid and can be used.
 * @param {any} thing The item to check if it is empty, where empty means
 * that the item is either null or undefined.
 * @returns true if the thing is either null or undefined. false otherwise.
 */
export function isEmpty(thing: any): boolean {
	return thing == null
		|| (typeof thing === "string" && thing.trim().length === 0)
		|| (Object.keys(thing).length === 0);
}

/**
 * This function takes in an object and checks if all of the arguments
 * provided in that object are valid, meaning they are not empty. For the
 * definition of empty, see the `isEmpty` function. If any item is empty, 
 * the function generates an error object accordingly, which can be passed 
 * back to the client that made the request.
 * 
 * @param {Object} items - An object containing key-value pairs where the key is 
 * the name of the field and the value is the value of the field.
 * 
 * @returns {ValidationResponse} - Returns an object with a `status` indicating 
 * whether an error was found. If there is an error, an error map is returned, and 
 * a function to respond with the error is provided.
 */
export function dataValidate(items: Object): ValidationResponse {
	const error = new Map<string, string>();
	for (const key in items) {
		const item = items[key as keyof Object];
		if (isEmpty(item)) {
			error.set(key, `The ${key} field is required.`);
		}
	}
	if (Object.keys(error).length === 0) {
		return {
			status: false,
			error: null,
			respond: (res: Response) => { return res; }
		};
	}
	return {
		status: true,
		error,
		respond: (res: Response) => {
			return res.status(StatusCode.BadRequest).json(Object.fromEntries(error))
		}
	};
}

export interface AuthedRequest extends Request {
	user: User;
	isAdmin: boolean;
	isFrontDesk: boolean;
	isFoodBeverage: boolean;
}

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	
	const token = authHeader.split(" ")[1];
	const payload = UserModel.getJwtPayload(token);
	
	if (!payload) {
		throw new InvalidUserCredentialsError()
	}
	
	const user = await UserModel.getUser(payload.user);
	if (!user) {
		throw new InvalidUserCredentialsError()
	}
	
	const authedReq = req as AuthedRequest;
	authedReq.user = user;
	authedReq.isAdmin = user.role == UserRole.Admin;
	authedReq.isFrontDesk = user.department === Department.FrontDesk;
	authedReq.isFoodBeverage = user.department === Department.FoodAndBeverage;
	next();
}
