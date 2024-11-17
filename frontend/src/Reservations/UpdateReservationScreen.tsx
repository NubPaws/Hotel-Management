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

interface UpdateData {
    reservationId: number,
    comment: string,
    email: string,
    phone: string,
    startDate: Date,
    startTime: string,
    endTime: string,
    roomType: string,
    prices: number[],
    room: number
}


const UpdateReservationScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [reservationId, setReservationId] = useState(-1);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [room, setRoom] = useState(-1);
    const [roomType, setRoomType] = useState("");
    const [startDate, setStartDate] = useState(new Date(0));
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [prices, setPrices] = useState<number[]>([]);
    const [comment, setComment] = useState("");

    const [updateReservationMessage, setUpdateReservationMessage] = useState<ModalController | undefined>(undefined);

    const navigate = useNavigate();
    useEffect(() => {
        checkAdminOrFrontDesk(userCredentials.role, userCredentials.department, navigate);
    }, [userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const updateReservationData = buildUpdateData();

        try {
            const res = await makeRequest("api/Reservations/update", "POST", "json", updateReservationData, userCredentials.token);
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setUpdateReservationMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }

    const buildUpdateData = (): Partial<UpdateData> => {
        const updateData: Partial<UpdateData> = {
            email: email || undefined,
            phone: phone || undefined,
            room: room > 0 ? room : undefined,
            roomType: roomType || undefined,
            startDate: startDate.getTime() !== new Date(0).getTime() ? startDate : undefined,
            startTime: startTime || undefined,
            endTime: endTime || undefined,
            prices: prices.length > 0 ? prices : undefined,
            comment: comment || undefined,
        };
        
        // Remove undefined properties.
        return Object.fromEntries(
            Object.entries(updateData).filter(([__reactRouterVersion, value]) => value !== undefined)
        ) as Partial<UpdateData>;
    };

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 200:
                setUpdateReservationMessage({
                    title: "Success!",
                    message: "Successfully updated reservation!",
                });
                break;
            case 400:
                setUpdateReservationMessage({
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
            <NavigationBar />
            <CenteredLabel>Update Reservation</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="reservationId"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservationId Id"
                    onChange={(e) => setReservationId(Number(e.target.value))}
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
                    id="room"
                    label="Room number"
                    type={InputType.Number}
                    placeholder="Enter room number"
                    onChange={(e) => setRoom(Number(e.target.value))}
                    isRequired={false}
                />
                <Input
                    id="roomType"
                    label="Room type"
                    type={InputType.Text}
                    placeholder="Enter room type"
                    onChange={(e) => setRoomType(e.target.value)}
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
                    id="startTime"
                    label="Start time"
                    type={InputType.Time}
                    placeholder="Enter start time"
                    onChange={(e) => setStartTime(e.target.value)}
                    isRequired={false}
                />
                <Input
                    id="endTime"
                    label="End time"
                    type={InputType.Time}
                    placeholder="Enter end time"
                    onChange={(e) => setEndTime(e.target.value)}
                    isRequired={false}
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
                    isRequired={false}
                />
                <Input
                    id="updateReservationButton"
                    type={InputType.Submit}
                    value="Update reservation"
                />
            </FormContainer>

            {updateReservationMessage && (
                <Modal title={updateReservationMessage.title} onClose={() => setUpdateReservationMessage(undefined)}>
                    {updateReservationMessage.message}
                </Modal>
            )}
        </>
    )
}

export default UpdateReservationScreen;