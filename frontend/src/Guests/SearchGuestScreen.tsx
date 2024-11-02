import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { Button } from "../UIElements/Button";
import { searchGuest } from "./SearchGuest";
import { Modal } from "../UIElements/Modal";

export function SearchGuestScreen(props: {
    userCredentials: UserCredentials,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}) {
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
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Search Guest Information"></CenteredLabel>
            <form id="guestSearchForm" className="fieldsContainer" action="http://localhost:8000/api/Guests/search">
                <Input id="guestId" className="field" type="text" name="guestId"
                    placeholder="Enter guest Id" errorMessageId="guestIdErrorMessage">
                    Guest Identification
                </Input>
                <Input id="guestName" className="field" type="text" name="guestName"
                    placeholder="Enter guest name" errorMessageId="guestNameErrorMessage">
                    Guest Name
                </Input>
                <Input id="guestEmail" className="field" type="email" name="guestEmail"
                    placeholder="Enter guest email" errorMessageId="guestEmailErrorMessage">
                    Guest Email
                </Input>
                <Input id="guestPhone" className="field" type="text" name="guestPhone"
                    placeholder="Enter guest phone" errorMessageId="guestPhoneErrorMessage">
                    Guest Phone
                </Input>
                <Input id="reservationId" className="field" type="number" name="reservationId"
                    placeholder="Enter reservation Id" errorMessageId="reservationIdErrorMessage">
                    Reservation Id
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
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
            <Modal title="Failed to retrieve guest" show={showGuestSearchErrorMessage} onClose={() => { setShowGuestSearchErrorMessage(false) }}>
                <h5>Error when trying to search for guest.</h5>
            </Modal>
            <Modal title="Guest Not Found" show={showGuestNotFoundErrorMessage} onClose={() => { setGuestNotFoundErrorMessage(false) }}>
                <h5>Failed to find guest with the specified features.</h5>
            </Modal>
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