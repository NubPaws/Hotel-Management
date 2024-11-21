import { AuthenticatedUserProps } from "../Utils/Props";
import { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import DynamicList from "../UIElements/DynamicList";
import Modal, { ModalController } from "../UIElements/Modal";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import DateInput from "../UIElements/Forms/DateInput";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import useFetchRoomTypes from "../Rooms/Hooks/useFetchRoomTypes";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";

const CreateReservationScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [guest, setGuest] = useState<number | null>(null);
    const [guestName, setGuestName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [roomType, setRoomType] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [prices, setPrices] = useState<number[]>([]);
    const [comment, setComment] = useState("");
    
    const { roomTypes } = useFetchRoomTypes(userCredentials.token);
    
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
                roomType,
                startDate,
                startTime,
                endTime,
                nightCount: prices.length,
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
        if (prices.length === 0) {
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
        <FormContainer onSubmit={(e) => handleSubmit(e)} maxWidth="600px">
            <MenuGridLayout>
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
                <SearchableDropdown
                    id="create-reserve-room-type-drop-down"
                    options={roomTypes}
                    label="Room type"
                    setValue={setRoomType}
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
            </MenuGridLayout>
            <Input
                id="comment"
                label="Comment"
                type={InputType.Text}
                placeholder="Enter comment"
                onChange={(e) => setComment(e.target.value)}
            />
            <DynamicList
                id="room-night-list"
                list={prices}
                setList={setPrices}
                label="Night price"
                totalText="Number of nights"
                addButtonText="Add Night"
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