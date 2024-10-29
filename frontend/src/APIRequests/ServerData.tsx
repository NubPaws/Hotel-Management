interface UserCredentials {
    token: string
    username: string,
    role: string,
    department: string
}

interface Room {
    "roomId": number,
    "type": string,
    "state": string,
    "occupied": boolean,
    "reservation": number,
}