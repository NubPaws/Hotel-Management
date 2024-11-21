import { useNavigate } from "react-router-dom";
import { Guest } from "../../APIRequests/ServerData";
import IconButton from "../../UIElements/Buttons/IconButton";
import edit from "../../assets/edit.svg"

import "./GuestEntry.css"
import { GuestUpdateState } from "../UpdateGuestState";

const GuestEntry: React.FC<Guest> = ({
    guestId,
    identification,
    fullName,
    title,
    email,
    phone,
    reservations,
}) => {
    const navigate = useNavigate();
    const state: GuestUpdateState = { email, guestId, phone, fullName };
    return <div className="guest-entry">
        <IconButton
            className="guest-entry-button"
            iconUrl={edit}
            borderWidth="2px"
            borderRadius="5px"
            fontSize="18pt"
            onClick={() => navigate("/guests/update-guest", { state })}
        />
        <div>{guestId}</div>
        <div>{identification}</div>
        <div>{fullName}</div>
        <div>{title}</div>
        <div>{email ? email : "No email provided"}</div>
        <div>{phone ? phone : "No phone provided"}</div>
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