import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { RoomOccupationRadioButton, RoomStateRadioButton } from "./RoomRadioButtons";
import { Button } from "../UIElements/Button";
import { searchRoom } from "./RoomInformation";
import { Modal } from "../UIElements/Modal";

export function RoomInformationScreen(props: {
    userCredentials: UserCredentials,
}) {
    const [showRoomSearchErrorMessage, setShowRoomSearchErrorMessage] = useState(false);
    const [showRoomNotFoundErrorMessage, setRoomNotFoundErrorMessage] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);

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
                        setShowRoomSearchErrorMessage,
                        setRoomNotFoundErrorMessage,
                        setRooms,)}>
                    Search room
                </Button>
            </form>
            <Modal title="Failed to retrieve room" show={showRoomSearchErrorMessage} onClose={() => { setShowRoomSearchErrorMessage(false) }}>
                <h5>Failed to retrieve room.</h5>
            </Modal>
            <Modal title="Room Not Found" show={showRoomNotFoundErrorMessage} onClose={() => { setRoomNotFoundErrorMessage(false) }}>
                <h5>Failed to find room with the specified features.</h5>
            </Modal>

            {rooms.length > 0 && (
                <ul>
                    {rooms.map((room) => (
                        <RoomEntry
                            key={room.roomId}
                            roomId={room.roomId}
                            type={room.type}
                            state={room.state}
                            occupied={room.occupied}
                            reservation={room.reservation}>
                        </RoomEntry>
                    ))}
                </ul>
            )}

        </>
    )
}


function RoomEntry(room: Room) {
    return (
        <div className="fieldsContainer">
            <p>Room Id: {room.roomId}</p>
            <p>Room Type: {room.type}</p>
            <p>Room State: {room.state}</p>
            <p>Room Occupation: {room.occupied ? "Occupied" : "Free"}</p>
            <p>Room Reservation Id: {room.reservation ? room.reservation : "No Reservation"}</p>
        </div>
    )
}

