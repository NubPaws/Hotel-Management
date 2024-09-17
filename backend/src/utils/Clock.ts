
export type Time24 = `${number}${number}:${number}${number}`;

const time24Regex = /^([01]\d|2[0-3]):([0-5]\d)/;

export function isTime24String(time: string): time is Time24 {
	return time24Regex.test(time);
}

export function numFromTime24(time: Time24): number {
	const hhmm = time.split(":");
	return parseInt(hhmm[0]) * 100 + parseInt(hhmm[1]);
}

export function addDaysToDate(date: Date, days: number): Date {
	const added = new Date(date);
	added.setDate(added.getDate() + days);
	
	return added;
}

export function getTodaysDate(): Date {
	const date = new Date();
	date.setHours(15, 0, 0, 0);
	return date;
}
