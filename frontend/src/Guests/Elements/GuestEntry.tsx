import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Guest, Reservation } from "../../APIRequests/ServerData";
import IconButton from "../../UIElements/Buttons/IconButton";
import edit from "../../assets/edit.svg"
import Button from "../../UIElements/Buttons/Button";
import ReservationEntry from "../../Reservations/Elements/ReservationEntry";

import "./GuestEntry.css";

type GuestEntryProps = {
    guest: Guest;
    reservations: Reservation[];
};

const GuestEntry: React.FC<GuestEntryProps> = ({
    guest, reservations
}) => {
    const { guestId, identification, email, phone, fullName, title } = guest;
    const [showReservations, setShowReservations] = useState(false);
    
    const navigate = useNavigate();
    
    const state: Partial<Guest> = { email, guestId, phone, fullName };
    
    return <>
    <div className="guest-entry">
        <div className="guest-entry-info">
            <p className="guest-id">
                {identification}
            </p>
            <p className="guest-name">
                {title ? `(${title})` : ""} {fullName}
            </p>
            <p className="guest-email">
                <a href={`mailto:${email}`}>{email}</a>
            </p>
            <p className="guest-phone">
                {phone}
            </p>
        </div>
        <div className="guest-entry-controls">
            <IconButton
                className="guest-entry-button"
                iconUrl={edit}
                borderWidth="2px"
                borderRadius="5px"
                fontSize="10pt"
                onClick={() => navigate("/guests/update", { state })}
            />
            <Button
                borderRadius="5px"
                borderWidth="2px"
                textSize="14pt"
                onClick={() => setShowReservations(prev => !prev)}
            >
                {showReservations ? "Hide" : "Show"} Reservations
            </Button>
        </div>
    </div>
    <div className={`guest-entry-reservations ${showReservations ? "visible" : ""}`}>
        {reservations && reservations.length > 0
            ? reservations.map((value, index) => <ReservationEntry key={index} reservation={value} />)
            : <p className="guest-entry-no-reservation">No reservations</p>
        }
    </div>
    </>;
}

export default GuestEntry;