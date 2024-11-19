import React, { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Modal, { ModalController } from "../UIElements/Modal";
import { Room } from "../APIRequests/ServerData";
import FormContainer from "../UIElements/Forms/FormContainer";
import RoomStateRadioButton from "./Elements/RoomRadioButtons";
import RoomOccupationRadioButton from "./Elements/RoomOccupationRadioButtons";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import { AuthenticatedUserProps } from "../Utils/Props";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import RoomEntry from "./Elements/RoomEntry";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";

const RoomInformationScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials,
    setShowConnectionErrorMessage,
}) => {
    useUserRedirect(userCredentials);
    
    const [roomType, setRoomType] = useState("");
    const [roomState, setRoomState] = useState("");
    const [occupancy, setOccupancy] = useState("");
    const [reservationId, setReservationId] = useState("");
    
    const [queryMessage, setQueryMessage] = useState<ModalController | undefined>(undefined);
    
    const [rooms, setRooms] = useState<Room[]>([]);
    
    const buildQueryUrl = (): string => {
        let url = "api/Rooms/room?";
        
        if (roomType) {
            url += `type=${roomType}&`;
        }
        if (roomState) {
            url += `state=${roomState.replace(" ", "")}&`;
        }
        if (occupancy) {
            const occ = occupancy.toLowerCase() === "occupied" ? "true" : "false";
            url += `occupied=${occ}&`;
        }
        if (reservationId) {
            url += `reservationId=${reservationId}&`;
        }
        
        // Remove trailing `&` or `?`.
        return url.slice(0, -1);
    };
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const url = buildQueryUrl();
        
        try {
            const res = await makeRequest(url, "GET", "text", "", userCredentials.token);
            handleResponse(res);
        } catch (error) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setQueryMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }
    
    const handleResponse = async (res: Response) => {
        if (res.status === 400) {
            setQueryMessage({
                title: "Failed to query",
                message: "Failed to query the room, make sure your input is valid and try again.",
            });
            return;
        }
        if (res.status !== 200) {
            setQueryMessage({
                title: "Weird error occured",
                message: "Unknown error occured",
            });
            return;
        }
        
        const fetchedRooms = await res.json() as Room[];
        setRooms(fetchedRooms);
        if (fetchedRooms.length === 0) {
            setQueryMessage({
                title: "No Rooms Found",
                message: "No rooms match your search criteria."
            });
        }
    }
    
    return <>
        <CenteredLabel>Room Search</CenteredLabel>
        <FormContainer onSubmit={handleSubmit} maxWidth="500px">
            <Input
                id="room-type"
                label="Room type"
                value={roomType}
                type={InputType.Text}
                placeholder="Enter room type"
                onChange={(e) => setRoomType(e.target.value)}
            />
            
            <MenuGridLayout>
                <RoomStateRadioButton value={roomState} setValue={setRoomState} />
                <RoomOccupationRadioButton value={occupancy} setValue={setOccupancy} />
            </MenuGridLayout>
            
            <Input
                id="reservation-id"
                label="Reservation Id"
                value={reservationId}
                type={InputType.Number}
                placeholder="Enter reservation Id"
                onChange={(e) => setReservationId(e.target.value)}
            />
            
            <Input
                id="query-rooms"
                type={InputType.Submit}
                value="Search"
            />
        </FormContainer>
        
        {rooms.length > 0 && (
            <ul style={{ marginTop: "8px"}}>
                {rooms.map((room) => (
                    <RoomEntry
                        roomId={room.roomId}
                        type={room.type}
                        state={room.state}
                        occupied={room.occupied}
                        reservation={room.reservation}
                    />
                ))}
            </ul>
        )}
        
        {queryMessage && (
            <Modal title={queryMessage.title} onClose={() => { setQueryMessage(undefined) }}>
                {queryMessage.message}
            </Modal>
        )}

    </>;
}

export default RoomInformationScreen;
