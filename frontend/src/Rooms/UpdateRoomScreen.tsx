import { FC, FormEvent, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import RoomStateRadioButton from "./Elements/RoomRadioButtons";
import RoomOccupationRadioButton from "./Elements/RoomOccupationRadioButtons";
import FormContainer from "../UIElements/Forms/FormContainer";
import { usePopupError } from "../Utils/Contexts/PopupErrorContext";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";

const UpdateRoomScreen: FC<ScreenProps> = ({
    userCredentials,
}) => {
    
    const [roomNumber, setRoomNumber] = useState(0);
    const [roomState, setRoomState] = useState("");
    const [occupation, setOccupation] = useState("");
    const [reservationId, setReservationId] = useState(0);
    
    const [ showModal ] = useModalError();
    const [ showPopup ] = usePopupError();
    
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
    }
    
    return <>
        <NavigationBar />
        <CenteredLabel>Update Room State</CenteredLabel>
        <FormContainer onSubmit={handleSubmit}>
            <Input
                id="roomNumber"
                type={InputType.Number}
                value={`${roomNumber}`}
                placeholder="Enter room number"
                onChange={(e) => setRoomNumber(e.target.value ? parseInt(e.target.value) : 0)}
            />
            <RoomStateRadioButton value={roomState} setValue={setRoomState} />
            <RoomOccupationRadioButton value={occupation} setValue={setOccupation} />
            
            <Input
                id="reservation-id"
                value={`${reservationId}`}
                type={InputType.Number}
                label="Reservation ID:"
                placeholder="Enter reservation Id"
                onChange={(e) => setReservationId(e.target.value ? parseInt(e.target.value) : 0)}
            />
            
            <Input
                id="update-room-btn"
                type={InputType.Submit}
                value="Update"
            />
        </FormContainer>
    </>;
}

export default UpdateRoomScreen;
