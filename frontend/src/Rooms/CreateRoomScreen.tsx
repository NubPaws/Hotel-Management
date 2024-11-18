import React, { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Button from "../UIElements/Buttons/Button";
import Modal, { ModalController } from "../UIElements/Modal";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { RoomType } from "../APIRequests/ServerData";
import PopupMessage from "../UIElements/PopupMessage";
import FormContainer from "../UIElements/Forms/FormContainer";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";

const CreateRoomScreen: React.FC<ScreenProps> = ({
    userCredentials,
    // setShowConnectionErrorMessage
}) => {
    // Loading for the room types.
    const [loading, setLoading] = useState(true);
    // Room types holders.
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    
    const [roomType, setRoomType] = useState("");
    const [roomNumber, setRoomNumber] = useState(0);
    
    const [createRoomMessage, setCreateRoomMessage] = useState<ModalController | undefined>(undefined);
    const [fetchFailedMessage, setFetchFailedMessage] = useState(false);
    
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    // Fetch room types.
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const res = await makeRequest("api/Rooms/types", "GET", "text", "", userCredentials.token);
                
                const data: RoomType[] = await res.json();
                setRoomTypes(data);
            } catch (error) {
                if (error instanceof FetchError) {
                    setFetchFailedMessage(true);
                }
                if (error instanceof RequestError) {
                    setCreateRoomMessage({
                        title: "Failed to fetch room types.",
                        message: "Invalid error occurred, contact makers.",
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchRoomTypes();
    }, [userCredentials.token]);
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
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
                options={roomTypes.map((value) => value.code)}
                placeholder="Enter room type"
                label="Room Type"
                setValue={(value) => setRoomType(value)}
            />
            <Input
                id="room-number-input"
                label="Room number"
                type={InputType.Number}
                placeholder="Enter room number"
            />
            <Input
                id="new-room-btn"
                type={InputType.Submit}
                value="Submit"
            />
        </FormContainer>
            
        <CenteredLabel>Remove Room</CenteredLabel>
        <form id="roomRemovalForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/remove-room/">
            <Input
                id="roomNumberToRemove"
                label="Room number"
                type={InputType.Number}
                placeholder="Enter room number"
            />
            <Button
                className="fieldLabel"
                backgroundColor="white"
                textColor="black"
                borderWidth="1px"
                // onClick={(event) => removeRoom(event,
                //     userCredentials.token,
                //     setShowConnectionErrorMessage,
                //     setShowRoomRemovalSuccessMessage,
                //     setShowRoomRemovalErrorMessage)}
                    >
                Remove Room
            </Button>
        </form>
        
        {fetchFailedMessage && <PopupMessage type="Error">Failed to fetch room types from server.</PopupMessage>}
        {createRoomMessage &&
            <Modal title={createRoomMessage.title} onClose={() => setCreateRoomMessage(undefined)}>
                {createRoomMessage.message}
            </Modal>
        }
    </>;
};

export default CreateRoomScreen;
