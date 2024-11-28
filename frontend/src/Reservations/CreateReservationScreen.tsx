import { ScreenProps } from "../Utils/Props";
import { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import DynamicList from "../UIElements/DynamicList";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import DateInput from "../UIElements/Forms/DateInput";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import useFetchRoomTypes from "../Rooms/Hooks/useFetchRoomTypes";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import { useNavigate } from "react-router-dom";

const CreateReservationScreen: React.FC<ScreenProps> = ({
    userCredentials
}) => {
    const [guestIdentification, setGuestIdentification] = useState("");
    const [guestName, setGuestName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [roomType, setRoomType] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState("15:00");
    const [endTime, setEndTime] = useState("12:00");
    const [prices, setPrices] = useState<number[]>([]);
    const [comment, setComment] = useState("");
    
    const { roomTypes } = useFetchRoomTypes(userCredentials.token);
    const [showModal] = useModalError();
    
    const navigate = useNavigate();
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        const requestBody = {
            guest: guestIdentification,
            comment,
            startDate,
            startTime,
            nightCount: prices.length,
            endTime,
            prices,
            roomType,
            guestName,
            email,
            phone,
        };
        
        const url = "api/Reservations/create"
        
        makeRequest(url, "POST", "json", requestBody, userCredentials.token)
            .then((res) => {
                if (res.ok) {
                    showModal("Success!", "Successfully created reservation!");
                    navigate(-1);
                } else {
                    res.text().then((value) => showModal("Failed!", value));
                }
            })
            .catch((error) => {
                if (error instanceof FetchError) {
                    showModal("Failed to connect to server", error.message);
                }
                if (error instanceof RequestError) {
                    showModal("General Error Occurred", error.message);
                }
            });
    }
    
    return (
    <>
        <CenteredLabel>Create Reservation</CenteredLabel>
        <FormContainer onSubmit={(e) => handleSubmit(e)} maxWidth="600px">
            <MenuGridLayout>
                <Input
                    id="create-reserve-guest-identification"
                    label="Guest Identification"
                    value={guestIdentification}
                    type={InputType.Text}
                    placeholder="Enter guest identification"
                    onChange={(e) => setGuestIdentification(e.target.value)}
                    required
                />
                <Input
                    id="create-reserve-full-name"
                    label="Full Name"
                    value={guestName}
                    type={InputType.Text}
                    placeholder="Enter name"
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                />
                <Input
                    id="create-reserve-email"
                    label="Email address"
                    value={email}
                    type={InputType.Email}
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    id="create-reserve-phone-number"
                    label="Phone number"
                    value={phone}
                    type={InputType.Tel}
                    placeholder="Enter phone"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <SearchableDropdown
                    id="create-reserve-room-type-drop-down"
                    options={roomTypes}
                    label="Room type"
                    setValue={setRoomType}
                    required
                />
                <DateInput
                    id="create-reserve-start-date"
                    label="Start date"
                    value={startDate}
                    onChange={setStartDate}
                    required
                />
                <Input
                    id="create-reserve-start-time"
                    label="Start at"
                    type={InputType.Time}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
                <Input
                    id="create-reserve-end-time"
                    label="End at"
                    type={InputType.Time}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
            </MenuGridLayout>
            <Input
                id="create-reserve-comments"
                label="Comments"
                type={InputType.Text}
                value={comment}
                placeholder="Enter comments"
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
                id="create-reserve-submit-btn"
                type={InputType.Submit}
                value="Create"
            />
        </FormContainer>
    </>
    );
};

export default CreateReservationScreen;