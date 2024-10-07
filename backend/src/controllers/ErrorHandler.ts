import { NextFunction, Request, Response } from "express";
import { CreatorDoesNotExistError, CreatorIsNotAdminError, FailedToSignJwtTokenError, InvalidUserCredentialsError, JwtTokenIsNotValidError, UserAlreadyExistsError, UserDoesNotExistError } from "../models/User.js";
import Logger from "../utils/Logger.js";

export enum ErrorCode {
	Ok = 200,
	BadRequest = 400,
	Unauthorized = 401,
	NotFound = 404,
	Conflict = 409,
	Unacceptable = 406,
}

function users(err: any, _req: Request, res: Response, next: NextFunction) {
	let statusCode = ErrorCode.Ok;
	let message = "";
	
	if (err instanceof InvalidUserCredentialsError) {
		statusCode = ErrorCode.BadRequest;
		message = "Incorrect username and/or password";
	} else if (err instanceof UserDoesNotExistError) {
		statusCode = ErrorCode.BadRequest;
		message = ""
	} else if (err instanceof CreatorDoesNotExistError) {
		statusCode = ErrorCode.BadRequest;
		message = "Creator does not exists";
	} else if (err instanceof CreatorIsNotAdminError) {
		statusCode = ErrorCode.Unacceptable;
		message = "Creator is not an admin";
	} else if (err instanceof JwtTokenIsNotValidError) {
		statusCode = ErrorCode.Unauthorized;
		message = "Invalid token received";
	} else if (err instanceof FailedToSignJwtTokenError) {
		statusCode = ErrorCode.BadRequest;
		message = "Couldn't sign jwt token for user";
	} else if (err instanceof UserAlreadyExistsError) {
		statusCode = ErrorCode.Conflict;
		message = "User already exists, username must be unique"
	} else {
		next(err);
		return;
	}
	Logger.warn(`Responding to user with: (${statusCode}) ${message}`);
	res.status(statusCode).send(message);
}

export default {
	users,
}
