import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Button from "../UIElements/Buttons/Button";
import { searchGuest } from "./SearchGuest";
import Modal from "../UIElements/Modal";
import { AuthenticatedUserProps } from "../Utils/Props";

export function SearchGuestScreen(props: AuthenticatedUserProps) {
    const [showGuestSearchErrorMessage, setShowGuestSearchErrorMessage] = useState(false);
    const [showGuestNotFoundErrorMessage, setGuestNotFoundErrorMessage] = useState(false);
    const [guests, setGuests] = useState<Guest[]>([]);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return (
        <>
            <CenteredLabel>Search Guest Information</CenteredLabel>
            <form id="guestSearchForm" className="fieldsContainer" action="http://localhost:8000/api/Guests/search">
                <Input
                    id="guestId"
                    label="Guest Identification"
                    type={InputType.Text}
                    placeholder="Enter guest Id"
                />
                <Input
                    id="guestName"
                    label="Guest Name"
                    type={InputType.Text}
                    placeholder="Enter guest name"
                />
                <Input
                    id="guestEmail"
                    label="Guest Email"
                    type={InputType.Email}
                    placeholder="Enter guest email"
                />
                <Input
                    id="guestPhone"
                    label="Guest Phone"
                    type={InputType.Tel}
                    placeholder="Enter guest phone"
                />
                <Input
                    id="reservationId"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservation Id"
                />
                <Button
                    className="fieldLabel"
                    backgroundColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => searchGuest(event,
                        props.userCredentials.token,
                        setShowGuestSearchErrorMessage,
                        setGuestNotFoundErrorMessage,
                        setGuests
                    )}>
                    Search Guest
                </Button>
            </form>
            {showGuestSearchErrorMessage && (
                <Modal title="Failed to retrieve guest" onClose={() => { setShowGuestSearchErrorMessage(false) }}>
                    Error when trying to search for guest.
                </Modal>
            )}
            {showGuestNotFoundErrorMessage && (
                <Modal title="Guest Not Found" onClose={() => { setGuestNotFoundErrorMessage(false) }}>
                    Failed to find guest with the specified features.
                </Modal>
            )}
            {guests.length > 0 && (
                <ul>
                    {guests.map((guest) => (
                        <GuestEntry
                            key={guest.guestId}
                            guestId={guest.guestId}
                            identification={guest.identification}
                            fullName={guest.fullName}
                            title={guest.title}
                            email={guest.email ? guest.email : "not provided"}
                            phone={guest.phone ? guest.phone : "not provided"}
                            reservations={guest.reservations}>
                        </GuestEntry>
                    ))}
                </ul>
            )}
        </>
    )
}

function GuestEntry(guest: Guest) {
    return (
        <div className="fieldsContainer">
            <p>Guest Id: {guest.guestId}</p>
            <p>Guest Identification: {guest.identification}</p>
            <p>Guest Full name: {guest.fullName}</p>
            <p>Guest Title: {guest.title}</p>
            <p>Guest email: {guest.email}</p>
            <p>Guest phone: {guest.phone}</p>
            {guest.reservations.length === 0 && (
                <p>Guest has no reservations</p>
            )}
           {guest.reservations.length > 0 && (
                <div>
                    <p>Reservations:</p>
                    <ul>
                        {guest.reservations.map((reservation, index) => (
                            <li key={index}>Reservation ID: {reservation}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}