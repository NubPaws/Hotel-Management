import React, { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import FormContainer from "../UIElements/Forms/FormContainer";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import { usePopupError } from "../Utils/Contexts/PopupErrorContext";
import { usePopupInfo } from "../Utils/Contexts/PopupInfoContext";
import useFetchRoomTypes from "./Hooks/useFetchRoomTypes";

const CreateRoomScreen: React.FC<ScreenProps> = ({
    userCredentials
}) => {
    // Handlers for room types loading
    const { roomTypes, loading } = useFetchRoomTypes(userCredentials.token);
    
    const [roomType, setRoomType] = useState("");
    const [roomNumber, setRoomNumber] = useState(0);
    
    // const [modal, showModal] = useModal();
    const [showModal] = useModalError();
    const [showErrorPopup] = usePopupError();
    const [showInfoPopup] = usePopupInfo();
    
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (roomNumber === 0 || !roomTypes.includes(roomType)) {
            showModal("Invalid input", "Room number must be non-negative, room type must exist.");
        }
        
        try {
            const res = await makeRequest("api/Rooms/create-room", "POST", "json", {
                type: roomType,
                room: roomNumber,
            }, userCredentials.token);
            
            handleResponse(res);
        } catch (error) {
            if (error instanceof FetchError) {
                showModal("Failed to connect to server", "Connection with the server could not be made.");
            }
            if (error instanceof RequestError) {
                showModal("Invalid request", "Request was invalid, re-validate fields.");
            }
        }
    }
    
    const handleResponse = async (res: Response) => {
        if (res.ok) {
            showInfoPopup(`Room created successfully ${roomNumber}`);
        } else {
            showErrorPopup(`Failed to create room, mayhaps the room already exists`);
        }
    }
    
    if (loading) {
        return <p>Fetching rooms types, please wait...</p>
    }
    
    return <>
        <CenteredLabel>Create Room</CenteredLabel>
        <FormContainer onSubmit={handleSubmit}>
            <SearchableDropdown
                id="asd"
                options={roomTypes}
                placeholder="Enter room type"
                label="Room Type"
                setValue={(value) => setRoomType(value)}
            />
            <Input
                id="room-number-input"
                label="Room number"
                value={`${roomNumber}`}
                type={InputType.Number}
                placeholder="Enter room number"
                onChange={(e) => setRoomNumber(e.target.value ? parseInt(e.target.value) : 0)}
            />
            <Input
                id="new-room-btn"
                type={InputType.Submit}
                value="Create"
            />
        </FormContainer>
    </>;
};

export default CreateRoomScreen;
