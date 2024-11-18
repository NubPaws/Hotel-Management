import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Button from "../UIElements/Buttons/Button";
import { createRoom, removeRoom } from "./Rooms";
import Modal from "../UIElements/Modal";
import { UserCredentials } from "../APIRequests/ServerData";

export function RoomScreen(props: {
    userCredentials: UserCredentials,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [showRoomCreationSuccessMessage, setShowRoomCreationSuccessMessage] = useState(false);
    const [showRoomCreationErrorMessage, setShowRoomCreationErrorMessage] = useState(false);
    const [showRoomRemovalSuccessMessage, setShowRoomRemovalSuccessMessage] = useState(false);
    const [showRoomRemovalErrorMessage, setShowRoomRemovalErrorMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.role !== "Admin") {
            navigate("/login");
        }
        if (props.userCredentials.department !== "FrontDesk") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return (
        <>
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
                        props.userCredentials.token,
                        props.setShowConnectionErrorMessage,
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
                        props.userCredentials.token,
                        props.setShowConnectionErrorMessage,
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