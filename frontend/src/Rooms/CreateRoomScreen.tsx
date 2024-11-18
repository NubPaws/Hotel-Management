import React, { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Button from "../UIElements/Buttons/Button";
import { ModalController } from "../UIElements/Modal";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/useUserRedirect";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { RoomType } from "../APIRequests/ServerData";
import PopupMessage from "../UIElements/PopupMessage";

const CreateRoomScreen: React.FC<ScreenProps> = ({
    userCredentials,
    setShowConnectionErrorMessage
}) => {
    // Loading for the room types.
    const [loading, setLoading] = useState(true);
    // Room types holders.
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    
    const [createRoomMessage, setCreateRoomMessage] = useState<ModalController | undefined>(undefined);
    const [fetchFailedMessage, setFetchFailedMessage] = useState(false);
    
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
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
                    
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchRoomTypes();
    }, [userCredentials.token]);
    
    return <>
        <NavigationBar />
        <CenteredLabel>Create Room</CenteredLabel>
        <form id="roomCreateForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/create-room/">
            <Input
                id="roomType"
                label="Room type"
                type={InputType.Text}
                placeholder="Enter room type"
            />
            <Input
                id="roomNumber"
                label="Room number"
                type={InputType.Number}
                placeholder="Enter room number"
            />
            <Button
                className="fieldLabel"
                backgroundColor="white"
                textColor="black"
                borderWidth="1px"
                // onClick={(event) => createRoom(event,
                //     userCredentials.token,
                //     setShowConnectionErrorMessage,
                //     setShowRoomCreationSuccessMessage,
                //     setShowRoomCreationErrorMessage)}
                >
                Create Room
            </Button>
        </form>
        
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
    </>;
};

export default CreateRoomScreen;
