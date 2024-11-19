import { FC, useState } from "react";
import { ScreenProps } from "../Utils/Props";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import RoomStateRadioButton from "./Elements/RoomRadioButtons";
import RoomOccupationRadioButton from "./Elements/RoomOccupationRadioButtons";
import RoomEntry from "./Elements/RoomEntry";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import { usePopupError } from "../Utils/Contexts/PopupErrorContext";
import { Room } from "../APIRequests/ServerData";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import IconButton from "../UIElements/Buttons/IconButton";

import "./RoomsScreen.css";
import plusIcon from "../assets/plus-icon.svg";
import { useNavigate } from "react-router-dom";
import { usePopupInfo } from "../Utils/Contexts/PopupInfoContext";

const RoomsScreen: FC<ScreenProps> = ({
	userCredentials,
}) => {
	useUserRedirect(userCredentials);
    
    const navigate = useNavigate();
    
    const [roomType, setRoomType] = useState("");
    const [roomState, setRoomState] = useState("");
    const [occupancy, setOccupancy] = useState("");
    const [reservationId, setReservationId] = useState("");
    
    const [rooms, setRooms] = useState<Room[]>([]);
    
	const [showModal] = useModalError();
	const [showErrorPopup] = usePopupError();
    const [showInfoPopup] = usePopupInfo()
	
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const url = buildQueryUrl(roomType, roomState, occupancy, reservationId);
        
        try {
            const res = await makeRequest(url, "GET", "text", "", userCredentials.token);
            handleResponse(res);
        } catch (error) {
            if (error instanceof FetchError) {
                showErrorPopup("Error connecting to the server");
            }
            if (error instanceof RequestError) {
				showModal("General Error Occurred", error.message);
            }
        }
    }
    
    const handleResponse = async (res: Response) => {
        if (res.status === 400) {
            showModal("Failed to query", "Failed to query the room, make sure your input is valid and try again.");
            return;
        }
        if (!res.ok) {
            showModal("Weird error occured", "Unknown error occured");
            return;
        }
        
        const fetchedRooms = await res.json() as Room[];
        setRooms(fetchedRooms);
        if (fetchedRooms.length === 0) {
            showErrorPopup("No rooms match your search criteria.");
        }
    }
    
    const removeRoom = async (roomId: number) => {
        const url = `api/Rooms/remove-room/${roomId}`;
        
        try {
            const res = await makeRequest(url, "POST", "text", "", userCredentials.token);
            if (res.ok) {
                showInfoPopup(`Successfully removed room ${roomId}.`);
                
                setRooms((oldRooms) => oldRooms.filter((value) => value.roomId !== roomId));
            } else {
                showModal("Failed", `Failed removing room ${roomId}. ${await res.json()}`);
            }
        } catch (error: any) {
            if (error instanceof FetchError) {
                showErrorPopup("Error connecting to the server");
            }
            if (error instanceof RequestError) {
				showModal("General Error Occurred", error.message);
            }
        }
    }
    
    return <>
        <NavigationBar />
        <CenteredLabel>Rooms Management</CenteredLabel>
        <IconButton
            className="rooms-add-btns"
            iconUrl={plusIcon}
            onClick={() => navigate("/rooms/add")}
        >
            Add
        </IconButton>
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
                {rooms.map((room, index) => (
                    <RoomEntry
                        key={index}
                        roomId={room.roomId}
                        type={room.type}
                        state={room.state}
                        occupied={room.occupied}
                        reservation={room.reservation}
                        removeRoom={removeRoom}
                    />
                ))}
            </ul>
        )}
    </>;
};

const buildQueryUrl = (roomType?: string, roomState?: string, occupancy?: string, reservationId?: string) => {
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
}

export default RoomsScreen;
