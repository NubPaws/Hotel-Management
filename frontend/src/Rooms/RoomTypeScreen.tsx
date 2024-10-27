import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { Button } from "../UIElements/Button";
import { createRoomType } from "./RoomType";
import { Modal } from "../UIElements/Modal";

export function RoomTypeScreen(props: {
    userCredentials: UserCredentials,
}) {
    const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);
    const [showRoomTypeCreationSuccessMessage, setShowRoomTypeCreationSuccessMessage] = useState(false);
    const [showRoomTypeCreationErrorMessage, setShowRoomTypeCreationErrorMessage] = useState(false);

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
            <CenteredLabel labelName="Room Type Creation and Removal"></CenteredLabel>
            <form id="roomTypeCreateForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/create-type/">
                <Input id="roomType" className="field" type="text" name="roomType"
                    placeholder="Enter room type" errorMessageId="roomTypeErrorMessage">
                    Room Type
                </Input>
                <Input id="roomDescription" className="field" type="text" name="roomDescription"
                    placeholder="Enter room description" errorMessageId="roomDescriptionErrorMessage">
                    Room Description
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => createRoomType(event,
                                                       props.userCredentials.token,
                                                       setShowConnectionErrorMessage,
                                                       setShowRoomTypeCreationSuccessMessage,
                                                       setShowRoomTypeCreationErrorMessage)}>
                    Create Room
                </Button>
            </form>
            <Modal title="Failed to connect to server" show={showConnectionErrorMessage} onClose={() => { setShowConnectionErrorMessage(false) }}>
                <h5>Unfortunately, we failed to reach our server.</h5>
            </Modal>
            <Modal title="Room Type Successfully created" show={showRoomTypeCreationSuccessMessage} onClose={() => { setShowRoomTypeCreationSuccessMessage(false) }}>
                <h5>Succeeded in creating room type</h5>
            </Modal>
            <Modal title="Room Type Failed" show={showRoomTypeCreationErrorMessage} onClose={() => { setShowRoomTypeCreationErrorMessage(false) }}>
                <h5>Failed in creating room type</h5>
            </Modal>
        </>
    )
}