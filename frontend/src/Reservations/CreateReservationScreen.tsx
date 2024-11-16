import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import { DynamicList } from "../UIElements/DynamicList";
import Modal, { ModalController } from "../UIElements/Modal";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { checkAdminOrFrontDesk } from "../Navigation/Navigation";

const CreateReservationScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [guest, setGuest] = useState(-1);
    const [guestName, setGuestName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [roomNumber, setRoomNumber] = useState(-1);
    const [roomType, setRoomType] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [nightCount, setNightCount] = useState(-1);
    const [prices, setPrices] = useState<number[]>([]);
    const [comment, setComment] = useState("");

    const [createReservationMessage, setCreateReservationMessage] = useState<ModalController | undefined>(undefined);
    const navigate = useNavigate();
    useEffect(() => {
        checkAdminOrFrontDesk(userCredentials.role, userCredentials.department, navigate);
    }, [userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const createReservationData = {
            guest,
            guestName,
            email,
            phone,
            roomNumber,
            roomType,
            startDate,
            startTime,
            endTime,
            nightCount,
            prices,
            comment
        };

        try {
            const res = await makeRequest("api/Reservations/create", "POST", "json", createReservationData, userCredentials.token);
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
            <NavigationBar></NavigationBar>
            <CenteredLabel>Create Reservation</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="guestId"
                    label="Guest Id"
                    type={InputType.Number}
                    placeholder="Enter guest Id"
                    onChange={(e) => setGuest(Number(e.target.value))}
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
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    id="guestPhone"
                    label="Guest phone"
                    type={InputType.Text}
                    placeholder="Enter guest phone"
                    onChange={(e) => setPhone(e.target.value)}
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
            {createReservationMessage && (
                <Modal title={createReservationMessage.title} onClose={() => setCreateReservationMessage(undefined)}>
                    {createReservationMessage.message}
                </Modal>
            )}
        </>
    )
}

export default CreateReservationScreen;