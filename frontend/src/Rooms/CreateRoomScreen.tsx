import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Button from "../UIElements/Buttons/Button";
import { createRoom, removeRoom } from "./Rooms";
import Modal from "../UIElements/Modal";
import useAuthenticationRedirect from "../Utils/useAuthenticationRedirect";
import useAdminRedirect from "../Utils/useAdminRedirect";
import { ScreenProps } from "../Utils/Props";
import useDepartmentRedirect from "../Utils/useDepartmentRedirect";

export const RoomScreen: React.FC<ScreenProps> = ({
    userCredentials,
    setShowConnectionErrorMessage
}) => {
    const [showRoomCreationSuccessMessage, setShowRoomCreationSuccessMessage] = useState(false);
    const [showRoomCreationErrorMessage, setShowRoomCreationErrorMessage] = useState(false);
    const [showRoomRemovalSuccessMessage, setShowRoomRemovalSuccessMessage] = useState(false);
    const [showRoomRemovalErrorMessage, setShowRoomRemovalErrorMessage] = useState(false);
    
    useAuthenticationRedirect(userCredentials.username);
    useAdminRedirect(userCredentials.role);
    useDepartmentRedirect(userCredentials.department, "FrontDesk");
    
    return (
        <>
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
                    onClick={(event) => createRoom(event,
                        userCredentials.token,
                        setShowConnectionErrorMessage,
                        setShowRoomCreationSuccessMessage,
                        setShowRoomCreationErrorMessage)}>
                    Create Room
                </Button>
            </form>
            {showRoomCreationSuccessMessage && (
                <Modal title="Room Creation Succeeded" onClose={() => { setShowRoomCreationSuccessMessage(false) }}>
                    Room was created successfully.
                </Modal>
            )}
            {showRoomCreationErrorMessage && (
                <Modal title="Room Creation Failed" onClose={() => { setShowRoomCreationErrorMessage(false) }}>
                    Failed to create room.
                </Modal>
            )}
            
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
                    onClick={(event) => removeRoom(event,
                        userCredentials.token,
                        setShowConnectionErrorMessage,
                        setShowRoomRemovalSuccessMessage,
                        setShowRoomRemovalErrorMessage)}>
                    Remove Room
                </Button>
            </form>
            {showRoomRemovalSuccessMessage && (
                <Modal title="Room Removal Succeeded" onClose={() => { setShowRoomRemovalSuccessMessage(false) }}>
                    Room was removed successfully.
                </Modal>
            )}
            {showRoomRemovalErrorMessage && (
                <Modal title="Room Removal Failed" onClose={() => { setShowRoomRemovalErrorMessage(false) }}>
                    Failed to remove room.
                </Modal>
            )}
            
            
        </>
    )
}