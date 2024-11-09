import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { FormContainer } from "../UIElements/FormContainer";
import { Input, InputType } from "../UIElements/Input";
import { DynamicList } from "../UIElements/DynamicList";
import { Modal } from "../UIElements/Modal";
import { ReactSetStateDispatch } from "../Utils/Types";
import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";

const CREATE_RESERVATION_URL = "http://localhost:8000/api/Reservations/create";

export function CreateReservationScreen(props: AuthenticatedUserProps) {
    const [guestId, setGuestId] = useState(-1);
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [roomNumber, setRoomNumber] = useState(-1);
    const [roomType, setRoomType] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [nightCount, setNightCount] = useState(-1);
    const [prices, setPrices] = useState<number[]>([]);
    const [comment, setComment] = useState("");

    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.role !== "Admin") {
            navigate("/login");
        }
        if (props.userCredentials.department !== "FrontDesk") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await createReservation(
            props.userCredentials.token,
            props.setShowConnectionErrorMessage,
            guestId,
            guestName,
            guestEmail,
            guestPhone,
            roomNumber,
            roomType,
            startDate,
            startTime,
            endTime,
            nightCount,
            prices,
            comment,
            setShowErrorMessage,
            setShowSuccessMessage,
        )
    }

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel>Create Reservation</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="guestId"
                    label="Guest Id"
                    type={InputType.Number}
                    placeholder="Enter guest Id"
                    onChange={(e) => setGuestId(Number(e.target.value))}
                />
                <Input
                    id="guestName"
                    label="Guest Name"
                    type={InputType.Text}
                    placeholder="Enter guest name"
                    onChange={(e) => setGuestName(e.target.value)}
                />
                <Input
                    id="guestEmail"
                    label="Guest email"
                    type={InputType.Email}
                    placeholder="Enter guest email"
                    onChange={(e) => setGuestEmail(e.target.value)}
                />
                <Input
                    id="guestPhone"
                    label="Guest phone"
                    type={InputType.Text}
                    placeholder="Enter guest phone"
                    onChange={(e) => setGuestPhone(e.target.value)}
                />
                <Input
                    id="roomNumber"
                    label="Room number"
                    type={InputType.Number}
                    placeholder="Enter room number"
                    onChange={(e) => setRoomNumber(Number(e.target.value))}
                />
                <Input
                    id="roomType"
                    label="Room type"
                    type={InputType.Text}
                    placeholder="Enter room type"
                    onChange={(e) => setRoomType(e.target.value)}
                />
                <Input
                    id="startDate"
                    label="Start date"
                    type={InputType.Date}
                    placeholder="Enter start date"
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                />
                <Input
                    id="startTime"
                    label="Start time"
                    type={InputType.Time}
                    placeholder="Enter start time"
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <Input
                    id="endTime"
                    label="End time"
                    type={InputType.Time}
                    placeholder="Enter end time"
                    onChange={(e) => setEndTime(e.target.value)}
                />
                <Input
                    id="nightCount"
                    label="Number of nights"
                    type={InputType.Number}
                    placeholder="Enter number of nights"
                    onChange={(e) => setNightCount(Number(e.target.value))}
                />
                <DynamicList
                    list={prices}
                    setList={setPrices}
                    listId="priceInputs"
                    itemId="price"
                    itemLabel="Night price"
                    itemPlaceHolder="Enter night price"
                    removeItemId="removePriceButton"
                    addItemId="addPriceButton"
                    addItemButtonValue="Add Price"
                />
                <Input
                    id="comment"
                    label="Comment"
                    type={InputType.Text}
                    placeholder="Enter comment"
                    onChange={(e) => setComment(e.target.value)}
                />
                <Input
                    id="createReservationButton"
                    type={InputType.Submit}
                    value="Create reservation"
                />
            </FormContainer>
            <Modal
                title="Reservation creation failed"
                show={showErrorMessage}
                onClose={() => setShowErrorMessage(false)}
            >
                <h1>Invalid reservation values</h1>
            </Modal>
            <Modal
                title="Reservation creation success"
                show={showSuccessMessage}
                onClose={() => setShowSuccessMessage(false)}
            >
                <h1>Successfully created new reservation</h1>
            </Modal>
        </>
    )
}


async function createReservation(
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    guestId: number,
    guestName: string,
    guestEmail: string,
    guestPhone: string,
    roomNumber: number,
    roomType: string,
    startDate: Date,
    startTime: string,
    endTime: string,
    nightCount: number,
    prices: number[],
    comment: string,
    setShowErrorMessage: ReactSetStateDispatch<boolean>,
    setShowSuccessMessage: ReactSetStateDispatch<boolean>,
) {
    if (!validateReservation(nightCount, prices)) {
        setShowErrorMessage(true);
        return;
    }

    let createReservationData = {
        "guest": guestId,
        "guestName": guestName,
        "room": roomNumber,
        "roomType": roomType,
        "startDate": startDate,
        "startTime": startTime,
        "endTime": endTime,
        "email": guestEmail,
        "phone": guestPhone,
        "nightCount": nightCount,
        "prices": prices,
        "comment": comment
    }

    let res = await authorizedPostRequestWithBody(
        token,
        JSON.stringify(createReservationData),
        CREATE_RESERVATION_URL,
        setShowConnectionErrorMessage
    );

    if (res === null) {
        return;
    }
    let status = res.status;
    if (status === 201) {
        setShowSuccessMessage(true);
    }
}

function validateReservation(
    nightCount: number,
    prices: number[],
) {
    if (nightCount === 0) {
        return false;
    }
    if (prices.length !== nightCount) {
        return false;
    }
    return true;
}