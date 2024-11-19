import { FC, FormEvent, useEffect, useState } from "react";
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
    
    const [ showModal ] = useModalError();
    const [ showPopup ] = usePopupError();
    
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    // Get the room state.
    useEffect(() => {
        const fetchRoomState = async () => {
            
        };
        
        fetchRoomState();
    }, [userCredentials.token]);
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (roomNumber <= 0) {
            
        }
    };
    
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
            
            <Input
                id="update-room-btn"
                type={InputType.Submit}
                value="Update"
            />
        </FormContainer>
    </>;
}

export default UpdateRoomScreen;
