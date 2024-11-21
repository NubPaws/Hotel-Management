import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { Reservation } from "../APIRequests/ServerData";
import ReservationEntry from "./Elements/ReservationEntry";
import IconButton from "../UIElements/Buttons/IconButton";

import plus from "../assets/plus-icon.svg";
import "./ReservationsScreen.css";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import DateInput from "../UIElements/Forms/DateInput";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";

const ReservationsScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials
}) => {
    const [guestIdentification, setGuestIdentification] = useState("");
    const [room, setRoom] = useState(0);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [guestName, setGuestName] = useState("");
    const [reservations, setReservations] = useState<Reservation[]>();
    
    useUserRedirect(userCredentials);
    const navigate = useNavigate();
    
    const [showModal] = useModalError();
    const [showErrorPopup] = usePopup();
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        const url = buildURL(guestIdentification, room, startDate, endDate, email, phone, guestName);
        
        makeRequest(url, "GET", "text", undefined, userCredentials.token)
            .then(res => {
                handleResponse(res);
            })
            .catch(error => {
                if (error instanceof FetchError) {
                    showModal("Connection error occured", error.message);
                }
                if (error instanceof RequestError) {
                    showModal("General Error Occurred",error.message);
                }
            });
    }

    const handleResponse = async (res: Response) => {
        if (!res.ok) {
            showModal("Failed!", await res.text());
            return;
        }
        
        const receivedReservation = await res.json();
        if (receivedReservation.length === 0) {
            showErrorPopup("Could not find reservation with the specified parameters");
            return;
        }
        setReservations(
            receivedReservation.map((r: any) => ({
                    ...r,
                    reservationMade: new Date(r.reservationMade),
                    startDate: new Date(r.startDate),
                    endDate: new Date(r.endDate),
                })
            )
        );
    };

    return <>
        <CenteredLabel>Reservations</CenteredLabel>
        <div className="reservation-management-wrapper">
            <IconButton
                iconUrl={plus}
                className="reservation-add-btn"
                borderWidth="2px"
                borderRadius="5px"
                fontSize="14pt"
                onClick={() => navigate("/reservations/create")}
            >
                New
            </IconButton>
        </div>
        <FormContainer onSubmit={(e) => handleSubmit(e)} maxWidth="600px">
            <MenuGridLayout>
                <Input
                    id="search-reserve-guest-name"
                    label="Guest Name"
                    value={guestName}
                    type={InputType.Text}
                    placeholder="Enter guest name"
                    onChange={(e) => setGuestName(e.target.value)}
                />
                <Input
                    id="search-reserve-room"
                    label="Room number"
                    value={`${room}`}
                    type={InputType.Number}
                    placeholder="Enter room number"
                    onChange={(e) => setRoom(Math.max(Number(e.target.value), 0))}
                />
                <DateInput
                    id="search-reserve-startDate"
                    value={startDate}
                    label="Checked in"
                    onChange={(date) => setStartDate(new Date(date))}
                />
                <DateInput
                    id="search-reserve-end-date"
                    value={endDate}
                    label="Checked out"
                    onChange={(date) => setEndDate(new Date(date))}
                />
                <Input
                    id="search-reserve-email"
                    label="Email"
                    value={email}
                    type={InputType.Email}
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    id="search-reserve-phone"
                    label="Phone number"
                    value={phone}
                    type={InputType.Tel}
                    placeholder="Enter phone"
                    onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                    id="reserve-screen-guest-id"
                    label="Guest Identification"
                    value={guestIdentification}
                    type={InputType.Number}
                    placeholder="Enter guest id"
                    onChange={(e) => setGuestIdentification(e.target.value)}
                />
                <Input
                    id="searchReservationButton"
                    className="search-reservation-input-btn"
                    type={InputType.Submit}
                    value="Search"
                />
            </MenuGridLayout>
        </FormContainer>
        {reservations && (
            <div className="reservation-entry-list-container">
            <ul>
                {reservations.map((reservation) => (
                    <ReservationEntry
                        key={reservation.reservationId}
                        reservation={reservation}
                    />
                ))}
            
            </ul>
            </div>
        )}
    </>;
}

const buildURL = (
    guestIdentification?: string,
    room?: number,
    startDate?: Date,
    endDate?: Date,
    email?: string,
    phone?: string,
    guestName?: string
) => {
    let url = "api/Reservations/query?";
    if (guestIdentification) {
        url += `guestIdentification=${guestIdentification}&`;
    }
    if (room !== -1) {
        url += `room=${room}&`;
    }
    if (startDate && startDate.getTime() !== (new Date(0)).getTime()) {
        url += `startDate=${startDate}&`;
    }
    if (endDate && endDate.getTime() !== (new Date(0)).getTime()) {
        url += `endDate=${endDate}&`;
    }
    if (email) {
        url += `email=${email}&`;
    }
    if (phone) {
        url += `phone=${phone}&`;
    }
    if (guestName) {
        url += `guestName=${guestName}&`;
    }
    return url;
};

export default ReservationsScreen;
