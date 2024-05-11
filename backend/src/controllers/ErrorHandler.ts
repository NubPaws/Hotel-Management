import { Request, Response } from "express";

enum RequestStatus {
	BadRequest = 400,
	Unauthorized = 401,
	NotFound = 404,
	Conflict = 409,
	Unacceptable = 406,
}
