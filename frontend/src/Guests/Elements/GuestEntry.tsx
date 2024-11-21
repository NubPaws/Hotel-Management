import { Guest } from "../../APIRequests/ServerData";

import "./GuestEntry.css"

const GuestEntry: React.FC<Guest> = ({
    guestId,
    identification,
    fullName,
    title,
    email,
    phone,
    reservations,
}) => {
    return <div className="guest-entry">
        <div>{guestId}</div>
        <div>{identification}</div>
        <div>{fullName}</div>
        <div>{title}</div>
        <div>{email}</div>
        <div>{phone}</div>
        {reservations.length === 0 && (
            <p>Guest has no reservations</p>
        )}
        {reservations.length > 0 && (
            <div>
                <ul>
                    {reservations.map((reservation, index) => (
                        <li key={index}>Reservation Id: {reservation}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
}

export default GuestEntry;