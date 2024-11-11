import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { RoomOccupationRadioButton, RoomStateRadioButton } from "./RoomRadioButtons";
import { Button } from "../UIElements/Button";
import { searchRoom } from "./RoomInformation";
import Modal from "../UIElements/Modal";

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
            <NavigationBar />
            <CenteredLabel>Get Room information</CenteredLabel>
            <form id="roomInformationForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/room">
                <Input
                    id="roomType"
                    label="Room type"
                    type={InputType.Text}
                    placeholder="Enter room type"
                />
                <RoomStateRadioButton />
                <RoomOccupationRadioButton />
                <Input
                    id="reservationId"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservation Id"
                />

                <Button
                    className="fieldLabel"
                    backgroundColor="white"
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
            {showRoomSearchErrorMessage && (
                <Modal title="Failed to retrieve room" onClose={() => { setShowRoomSearchErrorMessage(false) }}>
                    Failed to retrieve room.
                </Modal>
            )}
            {showRoomNotFoundErrorMessage && (
                <Modal title="Room Not Found" onClose={() => { setRoomNotFoundErrorMessage(false) }}>
                    Failed to find room with the specified features.
                </Modal>
            )}
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

