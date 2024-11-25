import IconButton from "../UIElements/Buttons/IconButton";
import { ScreenProps } from '../Utils/Props';
import CenteredLabel from "../UIElements/CenteredLabel";
import { useNavigate } from "react-router-dom";
import plusIcon from "../assets/plus-icon.svg"
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import { useState } from "react";
import { Guest } from "../APIRequests/ServerData";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";
import GuestEntry from "./Elements/GuestEntry";

import "./GuestsScreen.css"

const GuestsScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const [email, setEmail] = useState("");
    const [id, setId] = useState("");
    const [reservationId, setReservationId] = useState(0);
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");

    const [guests, setGuests] = useState<Guest[]>([]);

    const [showModal] = useModalError();
    const [showErrorPopup, _] = usePopup();

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const url = buildQueryUrl(email, id, reservationId, phone, fullName);
        try {
            const res = await makeRequest(url, "GET", "text", "", userCredentials.token);
            handleResponse(res);
        } catch (error) {
            if (error instanceof FetchError) {
                showErrorPopup("Error connecting to the server");
            }
            if (error instanceof RequestError) {
				showModal("General Error Occurred", error.message);
            }
        }
    }

    const handleResponse = async (res: Response) => {
        if (res.status === 400) {
            showModal("Failed to query", "Failed to query the room, make sure your input is valid and try again.");
            return;
        }
        if (!res.ok) {
            showModal("Weird error occurred", "Unknown error occurred");
            return;
        }

        const fetchedGuests = await res.json() as Guest[];
        setGuests(fetchedGuests);
        if (fetchedGuests.length === 0) {
            showErrorPopup("No guests match your search criteria.");
        }
    }

    return <>
        <CenteredLabel>Guests Management</CenteredLabel>
        <div className="guests-extra-btns">
            <IconButton
                className="guest-add-btn"
                iconUrl={plusIcon}
                onClick={() => navigate("/guests/add")}
            >
                Add guest
            </IconButton>
        </div>
        <FormContainer maxWidth="600px" onSubmit={(e) => handleSubmit(e)}>
            <Input
                id="guest-id"
                label="Identification"
                type={InputType.Text}
                placeholder="Enter guest identification"
                value={`${id}`}
                onChange={(e) => setId(e.target.value)}
            />
            <Input
                id="guest-name"
                label="Name"
                type={InputType.Text}
                placeholder="Enter guest name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <Input
                id="guest-email"
                label="Email"
                type={InputType.Email}
                placeholder="Enter guest email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                id="guest-phone"
                label="Phone"
                type={InputType.Tel}
                placeholder="Enter guest phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Input
                id="reservation-id"
                label="Reservation Id"
                type={InputType.Number}
                placeholder="Enter reservation Id"
                value={`${reservationId}`}
                onChange={(e) => setReservationId(Number(e.target.value))}
            />
            <Input
                id="search-guest"
                type={InputType.Submit}
                value="Search"
            />
        </FormContainer>
        {guests.length > 0 && (
                <ul className="guest-entry-list-wrapper">
                    {guests.map((guest) => (
                        <GuestEntry
                            key={guest.guestId}
                            guestId={guest.guestId}
                            identification={guest.identification}
                            fullName={guest.fullName}
                            title={guest.title}
                            email={guest.email}
                            phone={guest.phone}
                            reservations={guest.reservations}>
                        </GuestEntry>
                    ))}
                </ul>
            )}
    </>;
}

const buildQueryUrl = (email?: string, id?: string, reservationId?: number, phone?: string, fullName?: string) => {
    let url = "api/Guests/search?";
    if (email) {
        url += `email=${email}&`;
    }
    if (id) {
        url += `id=${id}&`;
    }
    if (reservationId) {
        url += `reservationId=${reservationId}&`;
    }
    if (phone) {
        url += `phone=${phone}&`;
    }
    if (fullName) {
        url += `fullName=${fullName}&`;
    }

    // Remove trailing `&` or `?`.
    return url.slice(0, -1);
};

export default GuestsScreen;