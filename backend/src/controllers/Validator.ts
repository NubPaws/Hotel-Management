import { Response } from "express";

interface ValidationResponse {
	status: boolean,
	error: Map<string, string> | null,
	respond: (res: Response) => void;
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
 * that were passed in that object are valid, meaning they are not empty.
 * For the definition of empty see the function isEmpty.
 * If at least on of the items is empty then the function generates and
 * error object accourdingly that can be passed back to the cllient that made
 * the request.
 * @param {Object} items Needs to be an object containing key value pairs
 * where the key is the name of the field and the value is the value of said
 * field.
 * @param res The item to send the error over if an error did occur.
 * @returns True if an error was generates and false otherwise.
 */
export function dataValidate(items: Object) {
	const error = new Map<string, string>();
	for (const key in items) {
		if (isEmpty(items[key as keyof Object])) {
			error.set(key, `The ${key} field is required.`);
		}
	}
	if (Object.keys(error).length === 0) {
		return {status: false, error: null, respond: (res: Response) => {}};
	}
	return {
		status: true,
		error,
		respond: (res: Response) => {
			res.status(400).json(Object.fromEntries(error))
		}
	};
}
