import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { Button } from "../UIElements/Button";
import { createRoom, removeRoom } from "./Rooms";
import { Modal } from "../UIElements/Modal";

export function RoomScreen(props: {
    userCredentials: UserCredentials,
}) {
    const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);
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
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Create Room"></CenteredLabel>
            <form id="roomCreateForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/create-room/">
                <Input id="roomType" className="field" type="text" name="roomType"
                    placeholder="Enter room type" errorMessageId="roomTypeErrorMessage">
                    Room type
                </Input>
                <Input id="roomNumber" className="field" type="number" name="roomNumber"
                    placeholder="Enter room number" errorMessageId="roomNumberErrorMessage">
                    Room number
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => createRoom(event,
                        props.userCredentials.token,
                        setShowConnectionErrorMessage,
                        setShowRoomCreationSuccessMessage,
                        setShowRoomCreationErrorMessage)}>
                    Create Room
                </Button>
            </form>
            <Modal title="Failed to connect to server" show={showConnectionErrorMessage} onClose={() => { setShowConnectionErrorMessage(false) }}>
                <h5>Unfortunately, we failed to reach our server.</h5>
            </Modal>
            <Modal title="Room Creation Succeeded" show={showRoomCreationSuccessMessage} onClose={() => { setShowRoomCreationSuccessMessage(false) }}>
                <h5>Room was created successfully.</h5>
            </Modal>
            <Modal title="Room Creation Failed" show={showRoomCreationErrorMessage} onClose={() => { setShowRoomCreationErrorMessage(false) }}>
                <h5>Failed to create room.</h5>
            </Modal>

            <CenteredLabel labelName="Remove Room"></CenteredLabel>
            <form id="roomRemovalForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/remove-room/">
                <Input id="roomNumberToRemove" className="field" type="number" name="roomNumberToRemove"
                    placeholder="Enter room number" errorMessageId="roomNumberToRemoveErrorMessage">
                    Room number
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => removeRoom(event,
                        props.userCredentials.token,
                        setShowConnectionErrorMessage,
                        setShowRoomRemovalSuccessMessage,
                        setShowRoomRemovalErrorMessage)}>
                    Remove Room
                </Button>
            </form>
            <Modal title="Room Removal Succeeded" show={showRoomRemovalSuccessMessage} onClose={() => { setShowRoomRemovalSuccessMessage(false) }}>
                <h5>Room was removed successfully.</h5>
            </Modal>
            <Modal title="Room Removal Failed" show={showRoomRemovalErrorMessage} onClose={() => { setShowRoomRemovalErrorMessage(false) }}>
                <h5>Failed to remove room.</h5>
            </Modal>
        </>
    )
}