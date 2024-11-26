import IconButton from "../UIElements/Buttons/IconButton";
import { ScreenProps } from '../Utils/Props';
import CenteredLabel from "../UIElements/CenteredLabel";
import { useNavigate } from "react-router-dom";
import plusIcon from "../assets/plus-icon.svg"
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import { useState } from "react";
import { Guest, Reservation } from "../APIRequests/ServerData";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";
import GuestEntry from "./Elements/GuestEntry";
import MenuGridLayout from "../UIElements/MenuGridLayout";

import "./GuestsScreen.css";

const GuestsScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const [email, setEmail] = useState("");
    const [id, setId] = useState("");
    const [reservationId, setReservationId] = useState<number | undefined>(undefined);
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");

    const [guests, setGuests] = useState<Guest[]>([]);
    const [guestsReservations, setGuestsReservations] = useState<Reservation[][]>([]);

    const [showModal] = useModalError();
    const [showErrorPopup, _] = usePopup();

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        const url = buildQueryUrl(email, id, reservationId, phone, fullName);
        makeRequest(url, "GET", "text", "", userCredentials.token)
            .then(handleResponse)
            .catch(error => {
                if (error instanceof FetchError) {
                    showErrorPopup("Error connecting to the server");
                }
                if (error instanceof RequestError) {
                    showModal("General Error Occurred", error.message);
                }
            });
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
        
        const fetchedReservations: Reservation[][] = [];
        
        for (const guest of fetchedGuests) {
            const url = `api/Reservations/query?guestIdentification=${guest.identification}`;
            const res = await makeRequest(url, "GET", "text", "", userCredentials.token);
            
            if (!res.ok) {
                fetchedReservations.push([]);
                continue;
            }
            
            const guestReservations = await res.json() as Reservation[];
            
            fetchedReservations.push(guestReservations.map(
                value => ({
                    ...value,
                    startDate: new Date(value.startDate),
                    endDate: new Date(value.endDate),
                    reservationMade: new Date(value.reservationMade),
                })
            ));
        }
        
        setGuestsReservations(fetchedReservations);
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
            <MenuGridLayout>
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
                value={reservationId ? `${reservationId}` : ""}
                onChange={(e) => setReservationId(e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
                id="search-guest-btn"
                className="guest-search-guest-btn"
                type={InputType.Submit}
                value="Search"
                label=" "
            />
            </MenuGridLayout>
        </FormContainer>
        {guests.length > 0 && guestsReservations.length === guests.length && (
            <div className="guest-entry-list-wrapper">
                {guests.map((guest, index) => (
                    <GuestEntry
                        key={index}
                        guest={guest}
                        reservations={guestsReservations[index] ? guestsReservations[index] : []}
                    />
                ))}
            </div>
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