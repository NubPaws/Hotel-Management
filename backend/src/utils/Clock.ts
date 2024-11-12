
export type Time24 = `${number}${number}:${number}${number}`;

const time24Regex = /^([01]\d|2[0-3]):([0-5]\d)/;

export function isTime24String(time: string): time is Time24 {
	return time24Regex.test(time);
}

export function numFromTime24(time: Time24): number {
	const hhmm = time.split(":");
	return parseInt(hhmm[0]) * 100 + parseInt(hhmm[1]);
}

/**
 * @param {Date} date - Current date.
 * @param {number} days - Number of days to add.
 * @returns New date with the days added to it.
 */
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

export function compareDate(d1: Date, d2: Date): number {
	const date1 = new Date(d1);
	const date2 = new Date(d2);
	
	date1.setHours(0, 0, 0, 0);
	date2.setHours(0, 0, 0, 0);
	
	return date1.getTime() - date2.getTime();
}

const padL = (num: number, len: number = 2, chr: string = "0") => `${num}`.padStart(len, chr);

/**
 * Converts a date to a string of our choosing.
 * 
 * @param {Date} d - Date to convert to a string.
 * @returns dd/MM/YYYY hh:mm:ss
 */
export function dateToString(d: Date): string {
	const day = padL(d.getDate());
	const month = padL(d.getMonth() + 1);
	const year = `${d.getFullYear()}`
	
	const seconds = padL(d.getSeconds());
	const minutes = padL(d.getMinutes());
	const hours = padL(d.getHours());
	
	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function dateToArray(date: Date): number[] {
	return [date.getDate(), date.getMonth() + 1, date.getFullYear()];
}

export function arrayToDate(date: number[]): Date {
	const day = new Date();
	
	day.setFullYear(date[2]);
	day.setMonth(date[1] - 1);
	day.setDate(date[0]);
	
	return day;
}

export function duplicateDate(d: Date | string) {
	const date = new Date(d);
	date.setHours(0, 0, 0, 0);
	return date;
}
