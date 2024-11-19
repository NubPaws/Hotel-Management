import React, { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { RoomType } from "../APIRequests/ServerData";
import PopupMessage from "../UIElements/PopupMessage";
import FormContainer from "../UIElements/Forms/FormContainer";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";
import useModal from "../Utils/Hooks/useModal";

const CreateRoomScreen: React.FC<ScreenProps> = ({
    userCredentials,
    setShowConnectionErrorMessage
}) => {
    // Handlers for room types loading
    const [loading, setLoading] = useState(true);
    const [roomTypes, setRoomTypes] = useState<string[]>([]);
    
    const [roomType, setRoomType] = useState("");
    const [roomNumber, setRoomNumber] = useState(0);
    
    const [modal, showModal] = useModal();
    const [fetchFailedMessage, setFetchFailedMessage] = useState(false);
    
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    // Fetch room types.
    useEffect(() => {
        if (!userCredentials.token) {
            return;
        }
        
        const fetchRoomTypes = async () => {
            try {
                const res = await makeRequest("api/Rooms/types", "GET", "text", "", userCredentials.token);
                
                const data: RoomType[] = await res.json();
                setRoomTypes(data.map(val => val.code));
            } catch (error) {
                if (error instanceof FetchError) {
                    setFetchFailedMessage(true);
                }
                if (error instanceof RequestError) {
                    showModal("Failed to fetch room types.", "Invalid error occurred, contact makers.");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchRoomTypes();
    }, [userCredentials.token]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (roomNumber === 0 || roomTypes.includes(roomType)) {
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
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                showModal("Invalid request", "Request was invalid, re-validate fields.");
            }
        }
    }
    
    const handleResponse = (res: Response) => {
        if (res.ok) {
            showModal("Success", "Room created successfully");
        } else {
            showModal("Failed", "Failed to create room");
        }
    }
    
    if (loading) {
        return <p>Fetching rooms types, please wait...</p>
    }
    
    return <>
        <NavigationBar />
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
            
        {fetchFailedMessage && <PopupMessage type="Error">Failed to fetch room types from server.</PopupMessage>}
        {modal}
    </>;
};

export default CreateRoomScreen;
