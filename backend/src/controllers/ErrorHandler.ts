import { NextFunction, Request, Response } from "express";
import { CreatorDoesNotExistError, CreatorIsNotAdminError, FailedToSignJwtTokenError, InvalidUserCredentialsError, JwtTokenIsNotValidError, UnauthorizedUserError, UserAlreadyExistsError, UserDoesNotExistError } from "../models/User.js";
import Logger from "../utils/Logger.js";
import { MissingReservationIdError, RoomDoesNotExistError, RoomNumberAlreadyExistsError, RoomTypeAlreadyExistsError, RoomTypeDoesNotExistError, RoomTypeIsNotEmptyError, InvalidRoomNumberError } from "../models/Room.js";
import { GuestAlreadyExistsError, GuestCreationError, GuestDoesNotExistError, GuestUpdateError } from "../models/Guest.js";

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
		message = "User does not exists"
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
	} else if (err instanceof UnauthorizedUserError) {
		statusCode = ErrorCode.Unauthorized;
		message = "User is not authrozied."
	} else {
		return next(err);
	}
	
	Logger.info(`Responding to user with: (${statusCode}) ${message}`);
	res.status(statusCode).send(message);
}

function rooms(err: any, _req: Request, res: Response, next: NextFunction) {
	let statusCode = ErrorCode.Ok;
	let message = "";
	
	if (err instanceof RoomDoesNotExistError) {
		statusCode = ErrorCode.BadRequest;
		message = err.message;
	} else if (err instanceof RoomNumberAlreadyExistsError) {
		statusCode = ErrorCode.BadRequest;
		message = err.message;
	} else if (err instanceof RoomTypeDoesNotExistError) {
		statusCode = ErrorCode.BadRequest;
		message = err.message;
	} else if (err instanceof RoomTypeAlreadyExistsError) {
		statusCode = ErrorCode.BadRequest;
		message = err.message;
	} else if (err instanceof MissingReservationIdError) {
		statusCode = ErrorCode.BadRequest;
		message = err.message;
	} else if (err instanceof RoomTypeIsNotEmptyError) {
		statusCode = ErrorCode.Unacceptable;
		message = err.message;
	} else if (err instanceof InvalidRoomNumberError) {
		statusCode = ErrorCode.NotFound;
		message = err.message;
	} else {
		return next(err);
	}
	
	Logger.info(`Responding to user with: (${statusCode}) ${message}`);
	res.status(statusCode).send(message);
}

function guests(err: any, _req: Request, res: Response, next: NextFunction) {
	let statusCode = ErrorCode.Ok;
	let message = "";
	
	if (err instanceof GuestAlreadyExistsError) {
		statusCode = ErrorCode.Conflict;
		message = "Guest already exists";
	} else if (err instanceof GuestDoesNotExistError) {
		statusCode = ErrorCode.Conflict;
		message = "Guest does not exists";
	} else if (err instanceof GuestCreationError) {
		statusCode = ErrorCode.BadRequest;
		message = "Failed to create guest with the information provided";
	} else if (err instanceof GuestUpdateError) {
		statusCode = ErrorCode.BadRequest;
		message = "Failed to update guest with the information provided";
	} else {
		return next(err);
	}
	
	Logger.info(`Responding to user with: (${statusCode}) ${message}`);
	res.status(statusCode).send(message);
}

export default {
	users,
	rooms,
	guests,
}
