import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { RoomOccupationRadioButton, RoomStateRadioButton } from "./RoomRadioButtons";
import { Button } from "../UIElements/Button";
import { searchRoom } from "./RoomInformtaion";
import { Modal } from "../UIElements/Modal";

export function RoomInformationScreen(props: {
    userCredentials: UserCredentials,
}) {
    const [showRoomSearchErrorMessage, setShowRoomSearchErrorMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Get Room information"></CenteredLabel>
            <form id="roomInformationForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/room">
                <Input id="roomType" className="field" type="text" name="roomType"
                    placeholder="Enter room type" errorMessageId="roomTypeErrorMessage">
                    Room type
                </Input>
                <RoomStateRadioButton></RoomStateRadioButton>
                <RoomOccupationRadioButton></RoomOccupationRadioButton>
                <Input id="reservationId" className="field" type="number" name="reservationId"
                    placeholder="Enter reservation Id" errorMessageId="reservationIdErrorMessage">
                    Reservation Id
                </Input>

                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => searchRoom(event,
                        props.userCredentials.token,
                        setShowRoomSearchErrorMessage)}>
                    Search room
                </Button>
            </form>
            <Modal title="Failed to retrieve room" show={showRoomSearchErrorMessage} onClose={() => { setShowRoomSearchErrorMessage(false) }}>
                <h5>Unfortunately, we failed to reach our server.</h5>
            </Modal>
        </>
    )
}