import mongoose, { Document, Schema } from "mongoose";
import { addDaysToDate, arrayToDate, compareDate, dateToArray } from "../utils/Clock.js";
import Reservation, { ReservationState, ReservationState as ReserveState } from "./Reservation.js";

export class BackOfficeHasAlreadyBeenInitializedError extends Error {}
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
 * 
 * @throws BackOfficeHasAlreadyBeenInitializedError
 */
async function initBackOffice(): Promise<void> {
	const backOffice = await BackOfficeModel.find();
	if (backOffice.length > 0) {
		throw new BackOfficeHasAlreadyBeenInitializedError();
	}
	
	const today = new Date();
	
	await BackOfficeModel.create({
		systemDate: [ today.getDay(), today.getMonth() + 1, today.getFullYear() ],
	});
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

export default {
	initBackOffice,
	endOfDay,
}
