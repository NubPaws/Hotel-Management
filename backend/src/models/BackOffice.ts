import mongoose, { Document, Schema } from "mongoose";
import { addDaysToDate, arrayToDate, compareDate, dateToArray } from "../utils/Clock.js";
import Reservation, { ReservationState, ReservationState as ReserveState } from "./Reservation.js";
import Logger from "../utils/Logger.js";
import Room from "./Room.js";

export class BackOfficeHasNotBeenInitializedError extends Error {}

interface BackOffice extends Document {
	systemDate: number[];			// The date in a dd/MM/YYYY format
}

const BackOfficeSchema = new Schema<BackOffice>({
	systemDate: {
		type: [Number],
		validate: {
			validator: (v: number[]) => v.length === 3,
			message: "System Date must contain at least 3 numbers.",
		},
	}
});

const BackOfficeModel = mongoose.model<BackOffice>("BackOfficeModel", BackOfficeSchema);

/**
 * Initialize the system for the first time.
 */
async function initBackOffice(): Promise<boolean> {
	const backOffice = await BackOfficeModel.find();
	if (backOffice.length > 0) {
		Logger.info("Back office has been already initialized.");
		return true;
	}
	
	const today = new Date();
	try {
		await BackOfficeModel.create({
			systemDate: dateToArray(today),
		});
		
		Logger.info("Initialized backoffice.");
	} catch (error: any) {
		Logger.error(`Failed initializing backoffice: ${error.messag}`);
		return false;
	}
	return true;
}

async function updateReservations(date: Date): Promise<void> {
	const reservations = await Reservation.find({
		state: {
			$nin: [
				ReserveState.NoShow,
				ReserveState.Passed,
				ReserveState.Cancelled,
			]
		},
		startDate: { $lte: date },
		endDate: { $gte: date },
	});
	
	const promises = [];
	
	for (let i = 0; i < reservations.length; i++) {
		const reservation = reservations[i];
		const { startDate, endDate, state } = reservation;
		
		const startDateCmp = compareDate(startDate, date);
		const endDateCmp = compareDate(endDate, date);
		
		if (state === ReserveState.Pending && startDateCmp === 0) {
			reservation.state = ReserveState.Arriving;
		} else if (state === ReserveState.Arriving && startDateCmp < 0) {
			reservation.state = ReserveState.NoShow;
		} else if (state === ReserveState.Active && endDateCmp === 0) {
			reservation.state = ReserveState.Departing;
		} else if (state === ReserveState.Departing && endDateCmp < 0) {
			promises.push(Reservation.checkout(reservation.reservationId));
			continue;
		}
		
		promises.push(reservation.save());
	}
	
	await Promise.all(promises);
}

async function endOfDay(): Promise<BackOffice> {
	const backOffice = await BackOfficeModel.findOne();
	if (!backOffice) {
		throw new BackOfficeHasNotBeenInitializedError();
	}
	
	// Get the current system date and advance by 1 day.
	const currSysDate = arrayToDate(backOffice.systemDate);
	const date = addDaysToDate(currSysDate, 1);
	
	// Go over all reservations and update them.
	updateReservations(date);
	
	// Update the system date.
	backOffice.systemDate = dateToArray(date);
	
	// Save and return the information to the user.
	await backOffice.save();
	return backOffice;
}

/**
 * Fetch the current system date from the BackOffice schema.
 * @returns Promise<number[]> - The system date in [day, month, year] format.
 */
async function getSystemDate(): Promise<number[]> {
	const backOffice = await BackOfficeModel.findOne();
	if (!backOffice) {
		throw new BackOfficeHasNotBeenInitializedError();
	}
	return backOffice.systemDate;
}

export type Occupancy = {
	occupancy: number,
	arrivals: number,
	departures: number,
};

/**
 * Fetch the occupancy-related statistics.
 * @returns Promise<{ occupancy: number, arrivals: number, departures: number }>
 * - occupancy: Number of reservations in the "Active" state.
 * - arrivals: Number of reservations in the "Arriving" state.
 * - departures: Number of reservations in the "Departing" state.
 */
async function getOccupancy(): Promise<Occupancy> {
	const [roomCount, occupancy, arrivals, departures] = await Promise.all([
		Room.count({}),
		Reservation.count({ state: ReservationState.Active }),
		Reservation.count({ state: ReservationState.Arriving }),
		Reservation.count({ state: ReservationState.Departing }),
	]);
	return {
		occupancy: occupancy / (roomCount === 0 ? roomCount : 1),
		arrivals,
		departures,
	};
}

export default {
	initBackOffice,
	endOfDay,
	getSystemDate,
	getOccupancy,
}

/**
 * @swagger
 * components:
 *   schemas:
 *     BackOffice:
 *       type: object
 *       required:
 *         - systemDate
 *       properties:
 *         systemDate:
 *           type: array
 *           items:
 *             type: integer
 *           description:
 *             The system date stored as an array of numbers
 *             representing [day, month, year] in dd/MM/YYYY format.
 *           example: [24, 10, 2024]
 *       example:
 *         systemDate: [24, 10, 2024]
 */
