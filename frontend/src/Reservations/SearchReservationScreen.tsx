import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import Modal, { ModalController } from "../UIElements/Modal";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { checkLoggedIn } from "../Navigation/Navigation";
import { Reservation } from "../APIRequests/ServerData";

const SearchReservationScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [guestIdentification, setGuestIdentification] = useState("");
    const [room, setRoom] = useState(-1);
    const [startDate, setStartDate] = useState(new Date(0));
    const [endDate, setEndDate] = useState(new Date(0));
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [guestName, setGuestName] = useState("");
    const [searchReservationMessage, setSearchReservationMessage] = useState<ModalController | undefined>(undefined);
    const [reservations, setReservations] = useState<Reservation[]>();

    const navigate = useNavigate();
    useEffect(() => {
        checkLoggedIn(userCredentials.username, navigate);
    }, [userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            let url = buildURL(guestIdentification, room, startDate, endDate, email, phone, guestName);
            const res = await makeRequest(url, "GET", "text", undefined, userCredentials.token);
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setSearchReservationMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }

    const buildURL = (
        guestIdentification: string,
        room: number,
        startDate: Date,
        endDate: Date,
        email: string,
        phone: string,
        guestName: string
    ) => {
        let url = "api/Reservations/query?";
        if (guestIdentification) {
            url += "guestIdentification=" + guestIdentification + "&";
        }
        if (room !== -1) {
            url += "room=" + room + "&";
        }
        if (startDate && startDate.getTime() !== (new Date(0)).getTime()) {
            url += "startDate=" + startDate + "&";
        }
        if (endDate && endDate.getTime() !== (new Date(0)).getTime()) {
            url += "endDate=" + endDate + "&";
        }
        if (email) {
            url += "email=" + email + "&";
        }
        if (phone) {
            url += "phone=" + phone + "&";
        }
        if (guestName) {
            url += "guestName=" + guestName + "&";
        }
        return url;
    };

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 200:
                let receivedReservation = await res.json();
                if (receivedReservation.length === 0) {
                    setSearchReservationMessage({
                        title: "Reservation not found",
                        message: "Could not find reservation with the specified parameters",
                    });
                    setReservations(receivedReservation);
                    break;
                }
                const parsedReservations = receivedReservation.map((reservation: Reservation) => ({
                    ...reservation,
                    reservationMade: new Date(reservation.reservationMade),
                    startDate: new Date(reservation.startDate),
                    endDate: new Date(reservation.endDate)
                }));
                setReservations(parsedReservations);
                break;
            case 400:
                setSearchReservationMessage({
                    title: "Failed!",
                    message: await res.text(),
                });
                break;
            default:
                setShowConnectionErrorMessage(true);
                break;
        }
    };

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel>Search Reservation</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="guestIdentification"
                    label="Guest Identification number"
                    type={InputType.Text}
                    placeholder="Enter guest identification number"
                    onChange={(e) => setGuestIdentification(e.target.value)}
                    isRequired={false}
                />
                <Input
                    id="roomNumber"
                    label="Room number"
                    type={InputType.Number}
                    placeholder="Enter room number"
                    onChange={(e) => setRoom(Number(e.target.value))}
                    isRequired={false}
                />
                <Input
                    id="startDate"
                    label="Start date"
                    type={InputType.Date}
                    placeholder="Enter start date"
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    isRequired={false}
                />
                <Input
                    id="endDate"
                    label="End date"
                    type={InputType.Date}
                    placeholder="Enter end date"
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    isRequired={false}
                />
                <Input
                    id="guestEmail"
                    label="Guest email"
                    type={InputType.Email}
                    placeholder="Enter guest email"
                    onChange={(e) => setEmail(e.target.value)}
                    isRequired={false}
                />
                <Input
                    id="guestPhone"
                    label="Guest phone"
                    type={InputType.Text}
                    placeholder="Enter guest phone"
                    onChange={(e) => setPhone(e.target.value)}
                    isRequired={false}
                />
                <Input
                    id="guestName"
                    label="Guest Name"
                    type={InputType.Text}
                    placeholder="Enter guest name"
                    onChange={(e) => setGuestName(e.target.value)}
                    isRequired={false}
                />
                <Input
                    id="searchReservationButton"
                    type={InputType.Submit}
                    value="Search reservation"
                />
            </FormContainer>
            {searchReservationMessage && (
                <Modal title={searchReservationMessage.title} onClose={() => setSearchReservationMessage(undefined)}>
                    {searchReservationMessage.message}
                </Modal>
            )}
            {reservations && (
                <ul>
                    {reservations.map((reservation) => (
                        <ReservationEntry
                            key={reservation.reservationId}
                            reservationId={reservation.reservationId}
                            reservationMade={reservation.reservationMade}
                            comment={reservation.comment}
                            startDate={reservation.startDate}
                            startTime={reservation.startTime}
                            nightCount={reservation.nightCount}
                            endTime={reservation.endTime}
                            endDate={reservation.endDate}
                            prices={reservation.prices}
                            roomType={reservation.roomType}
                            room={reservation.room}
                            state={reservation.state}
                            extras={reservation.extras}
                            guest={reservation.guest}
                            guestName={reservation.guestName}
                            email={reservation.email}
                            phone={reservation.phone}>
                        </ReservationEntry>
                    ))}
                </ul>
            )}
        </>
    )
}

const ReservationEntry: React.FC<Reservation> = ({
    reservationId,
    reservationMade,
    comment,
    startDate,
    startTime,
    nightCount,
    endTime,
    endDate,
    prices,
    roomType,
    room,
    state,
    extras,
    guest,
    guestName,
    email,
    phone
}) => {
    return (
        <div className="fieldsContainer">
            <p>Reservation Id: {reservationId}</p>
            <p>Reservation made at: {reservationMade.toLocaleString()}</p>
            <p>Reservation start date: {startDate.toLocaleString()}</p>
            <p>Reservation end date: {endDate.toLocaleString()}</p>
            <p>Reservation start time: {startTime}</p>
            <p>Reservation end time: {endTime}</p>
            <p>Reservation number of nights: {nightCount}</p>
            <p>Reservation room type: {roomType}</p>
            <p>Reservation room number: {room}</p>
            <p>Reservation state: {state}</p>
            <p>Reservation guest name: {guestName}</p>
            <p>Reservation guest Id: {guest}</p>
            <p>Reservation guest email: {email}</p>
            <p>Reservation guest phone: {phone}</p>
            <p>Reservation comment: {comment}</p>
            {prices.length > 0 && (
                <div>
                    <p>Prices:</p>
                    <ul>
                        {prices.map((price, index) => (
                            <li key={index}>{price}</li>
                        ))}
                    </ul>
                </div>
            )}
            {extras.length > 0 && (
                <div>
                    <p>Extras:</p>
                    <ul>
                        {extras.map((extra, index) => (
                            <li key={index}>{extra}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SearchReservationScreen;