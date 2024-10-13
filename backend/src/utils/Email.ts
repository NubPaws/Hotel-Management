
export type Email = `${string}@${string}.${string}`;

const emailRegex = /\S+@\S+\.\S+/;

export function isEmailString(email: string): email is Email {
	return emailRegex.test(email);
}
