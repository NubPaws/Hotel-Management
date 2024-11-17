import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Modal, { ModalController } from "../UIElements/Modal";
import { Room, UserCredentials } from "../APIRequests/ServerData";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import RoomStateRadioButton from "./Elements/RoomRadioButtons";
import RoomOccupationRadioButton from "./Elements/RoomOccupationRadioButtons";

export function RoomInformationScreen(props: {
    userCredentials: UserCredentials,
}) {
    const [roomState, setRoomState] = useState("");
    const [occupancy, setOccupancy] = useState("");
    
    const [queryMessage, setQueryMessage] = useState<ModalController | undefined>(undefined);
    
    const [showRoomSearchErrorMessage, setShowRoomSearchErrorMessage] = useState(false);
    const [showRoomNotFoundErrorMessage, setRoomNotFoundErrorMessage] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    
    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        // searchRoom(props.userCredentials.token, setShowRoomSearchErrorMessage, setRoomNotFoundErrorMessage, setRooms);
    }
    
    return (
        <>
            <NavigationBar />
            <CenteredLabel>Room Search</CenteredLabel>
            <FormContainer onSubmit={handleSubmit}>
                <Input
                    id="room-type"
                    label="Room type"
                    type={InputType.Text}
                    placeholder="Enter room type"
                />
                
                <RoomStateRadioButton value={roomState} setValue={setRoomState} />
                
                <RoomOccupationRadioButton value={occupancy} setValue={setOccupancy} />
                
                <Input
                    id="reservation-id"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservation Id"
                />
                
                <Input
                    id="query-rooms"
                    type={InputType.Submit}
                    value="Search"
                />
            </FormContainer>
            
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

