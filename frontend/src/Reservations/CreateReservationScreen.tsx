import { AuthenticatedUserProps } from "../Utils/Props";
import { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import { DynamicList } from "../UIElements/DynamicList";
import Modal, { ModalController } from "../UIElements/Modal";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import DateInput from "../UIElements/Forms/DateInput";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";

const CreateReservationScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [guest, setGuest] = useState<number | null>(null);
    const [guestName, setGuestName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [room, setRoom] = useState<number | null>(null);
    const [roomType, setRoomType] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [nightCount, setNightCount] = useState<number>(0);
    const [prices, setPrices] = useState<number[]>([]);
    const [comment, setComment] = useState("");

    const [createReservationMessage, setCreateReservationMessage] = useState<ModalController | undefined>(undefined);
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        try {
            const res = await makeRequest("api/Reservations/create", "POST", "json", {
                guest,
                guestName,
                email,
                phone,
                room,
                roomType,
                startDate,
                startTime,
                endTime,
                nightCount,
                prices,
                comment
            }, userCredentials.token);
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setCreateReservationMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }

    const validateInputs = () => {
        const ERROR_TITLE = "Failed to process form";
        if (nightCount !== prices.length) {
            setCreateReservationMessage({
                title: ERROR_TITLE,
                message: "Nights and prices needs to match"
            });
            return false;
        }
        if (nightCount <= 0) {
            setCreateReservationMessage({
                title: ERROR_TITLE,
                message: "Nights must be positive"
            });
            return false;
        }
        return true;
    };

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 201:
                setCreateReservationMessage({
                    title: "Success!",
                    message: "Successfully created reservation!",
                });
                break;
            case 400:
                setCreateReservationMessage({
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
        <CenteredLabel>Create Reservation</CenteredLabel>
        <FormContainer onSubmit={(e) => handleSubmit(e)}>
            <Input
                id="guestId"
                label="Guest Id"
                value={guest ? `${guest}` : ""}
                type={InputType.Number}
                placeholder="Enter guest Id"
                onChange={(e) => setGuest(Math.max(Number(e.target.value), 0))}
            />
            <Input
                id="guestName"
                label="Guest Name"
                value={guestName}
                type={InputType.Text}
                placeholder="Enter guest name"
                onChange={(e) => setGuestName(e.target.value)}
            />
            <Input
                id="guestEmail"
                label="Guest email"
                value={email}
                type={InputType.Email}
                placeholder="Enter guest email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                id="guestPhone"
                label="Guest phone"
                value={phone}
                type={InputType.Text}
                placeholder="Enter guest phone"
                onChange={(e) => setPhone(e.target.value)}
            />
            <Input
                id="room"
                label="Room number"
                value={room ? `${room}` : ""}
                type={InputType.Number}
                placeholder="Enter room number"
                onChange={(e) => setRoom(Math.max(Number(e.target.value), 0))}
                required={false}
            />
            <Input
                id="roomType"
                label="Room type"
                value={roomType}
                type={InputType.Text}
                placeholder="Enter room type"
                onChange={(e) => setRoomType(e.target.value)}
            />
            <DateInput
                id="startDate"
                label="Start date"
                value={startDate}
                placeholder="Enter start date"
                onChange={(date) => { setStartDate(date) }}
            />
            <Input
                id="startTime"
                label="Start time"
                value={startTime}
                type={InputType.Time}
                placeholder="Enter start time"
                onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
                id="endTime"
                label="End time"
                value={endTime}
                type={InputType.Time}
                placeholder="Enter end time"
                onChange={(e) => setEndTime(e.target.value)}
            />
            <Input
                id="nightCount"
                label="Number of nights"
                value={`${nightCount}`}
                type={InputType.Number}
                placeholder="Enter number of nights"
                onChange={(e) => setNightCount(Math.max(Number(e.target.value), 0))}
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
        {createReservationMessage && (
            <Modal title={createReservationMessage.title} onClose={() => setCreateReservationMessage(undefined)}>
                {createReservationMessage.message}
            </Modal>
        )}
    </>
    );
};

export default CreateReservationScreen;