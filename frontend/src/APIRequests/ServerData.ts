
export type UserRole = "Admin" | "User" | "";
export type Department = "General" | "FrontDesk" | "HouseKeeping"
    | "Maintenance" | "FoodAndBeverage" | "Security" | "Concierge" | "";

export interface UserCredentials {
    token: string;
    username: string;
    role: UserRole;
    department: Department;
}

export interface Room {
    roomId: number,
    type: string,
    state: string,
    occupied: boolean,
    reservation: number,
}

export interface RoomType {
    code: string;
	description: string;
}

export interface Guest {
    guestId: number,
    identification: string,
    fullName: string,
    title: string,
    email: string,
    phone: string,
    reservations: number[]
}

export interface Task {
    taskId: number,
    timeCreated: Date
    room: number,
    description: string,
    urgency: number,
    department: string,
    creator: string,
    status: string,
    history: string[]
}

export interface Reservation {
    reservationId: number,
    reservationMade: string,
    comment: string,
    startDate: string,
    startTime: string,
    nightCount: number,
    endTime: string,
    endDate: string,
    prices: number[],
    roomType: string,
    room: number,
    state: string,
    extras: number[],
    guest: number,
    guestName: string,
    email: string,
    phone: string,
}