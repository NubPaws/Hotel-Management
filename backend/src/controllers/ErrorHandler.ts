import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/StatusCode.js";
import Logger from "../utils/Logger.js";
import { CreatorDoesNotExistError, CreatorIsNotAdminError, FailedToSignJwtTokenError, InvalidUserCredentialsError, JwtTokenIsNotValidError, UnauthorizedUserError, UserAlreadyExistsError, UserDoesNotExistError } from "../models/User.js";
import { MissingReservationIdError, RoomDoesNotExistError, RoomNumberAlreadyExistsError, RoomTypeAlreadyExistsError, RoomTypeDoesNotExistError, RoomTypeIsNotEmptyError, InvalidRoomNumberError } from "../models/Room.js";
import { GuestAlreadyExistsError, GuestCreationError, GuestDoesNotExistError, GuestUpdateError, InvalidGuestCredentialsError } from "../models/Guest.js";

function users(err: any, _req: Request, res: Response, next: NextFunction) {
	let statusCode = StatusCode.Ok;
	let message = "";
	
	if (err instanceof InvalidUserCredentialsError) {
		statusCode = StatusCode.BadRequest;
		message = "Incorrect username and/or password";
	} else if (err instanceof UserDoesNotExistError) {
		statusCode = StatusCode.BadRequest;
		message = "User does not exists"
	} else if (err instanceof CreatorDoesNotExistError) {
		statusCode = StatusCode.BadRequest;
		message = "Creator does not exists";
	} else if (err instanceof CreatorIsNotAdminError) {
		statusCode = StatusCode.Unacceptable;
		message = "Creator is not an admin";
	} else if (err instanceof JwtTokenIsNotValidError) {
		statusCode = StatusCode.Unauthorized;
		message = "Invalid token received";
	} else if (err instanceof FailedToSignJwtTokenError) {
		statusCode = StatusCode.BadRequest;
		message = "Couldn't sign jwt token for user";
	} else if (err instanceof UserAlreadyExistsError) {
		statusCode = StatusCode.Conflict;
		message = "User already exists, username must be unique"
	} else if (err instanceof UnauthorizedUserError) {
		statusCode = StatusCode.Unauthorized;
		message = "User is not authrozied."
	} else {
		return next(err);
	}
	
	Logger.info(`Responding to user with: (${statusCode}) ${message}`);
	res.status(statusCode).send(message);
}

function rooms(err: any, _req: Request, res: Response, next: NextFunction) {
	let statusCode = StatusCode.Ok;
	let message = "";
	
	if (err instanceof RoomDoesNotExistError) {
		statusCode = StatusCode.BadRequest;
		message = err.message;
	} else if (err instanceof RoomNumberAlreadyExistsError) {
		statusCode = StatusCode.BadRequest;
		message = err.message;
	} else if (err instanceof RoomTypeDoesNotExistError) {
		statusCode = StatusCode.BadRequest;
		message = err.message;
	} else if (err instanceof RoomTypeAlreadyExistsError) {
		statusCode = StatusCode.BadRequest;
		message = err.message;
	} else if (err instanceof MissingReservationIdError) {
		statusCode = StatusCode.BadRequest;
		message = err.message;
	} else if (err instanceof RoomTypeIsNotEmptyError) {
		statusCode = StatusCode.Unacceptable;
		message = err.message;
	} else if (err instanceof InvalidRoomNumberError) {
		statusCode = StatusCode.NotFound;
		message = err.message;
	} else {
		return next(err);
	}
	
	Logger.info(`Responding to user with: (${statusCode}) ${message}`);
	res.status(statusCode).send(message);
}

function guests(err: any, _req: Request, res: Response, next: NextFunction) {
	let statusCode = StatusCode.Ok;
	let message = "";
	
	if (err instanceof GuestAlreadyExistsError) {
		statusCode = StatusCode.Conflict;
		message = "Guest already exists";
	} else if (err instanceof GuestDoesNotExistError) {
		statusCode = StatusCode.Conflict;
		message = "Guest does not exists";
	} else if (err instanceof GuestCreationError) {
		statusCode = StatusCode.BadRequest;
		message = "Failed to create guest with the information provided";
	} else if (err instanceof GuestUpdateError) {
		statusCode = StatusCode.BadRequest;
		message = "Failed to update guest with the information provided";
	} else if (err instanceof InvalidGuestCredentialsError) {
		statusCode = StatusCode.BadRequest;
		message = err.message;
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
