export interface UserCredentials {
    token: string
    username: string,
    role: string,
    department: string
}

export interface Room {
    "roomId": number,
    "type": string,
    "state": string,
    "occupied": boolean,
    "reservation": number,
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
    timeCreated: string
    room: number,
    description: string,
    urgency: number,
    department: string,
    creator: string,
    status: string,
    history: string[]
}