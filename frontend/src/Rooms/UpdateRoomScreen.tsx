import { FC } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input from "../UIElements/Forms/Input";
import Button from "../UIElements/Buttons/Button";
import { updateRoom } from "./RoomUpdate";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import useModal from "../Utils/Hooks/useModal";
import RoomStateRadioButton from "./Elements/RoomRadioButtons";
import RoomOccupationRadioButton from "./Elements/RoomOccupationRadioButtons";

const UpdateRoomScreen: FC<ScreenProps> = ({
    userCredentials,
    setShowConnectionErrorMessage,
}) => {
    const [modal, showModal] = useModal();
    
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    
    
    return <>
        <NavigationBar />
        <CenteredLabel>Update Room State</CenteredLabel>
        <form id="roomUpdateForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/update">
            <Input id="roomNumber" className="field" type="number" name="roomNumber"
                placeholder="Enter room number" errorMessageId="roomNumberErrorMessage">
                Room number
            </Input>
            <RoomStateRadioButton />
            <RoomOccupationRadioButton />

            <Input id="reservationId" className="field" type="number" name="reservationId"
                placeholder="Enter reservation Id" errorMessageId="reservationIdErrorMessage">
                Reservation Id
            </Input>

            <Button
                className="fieldLabel"
                backgroundColor="white"
                textColor="black"
                borderWidth="1px"
                onClick={(event) => updateRoom(event,
                    props.userCredentials.token,
                    props.setShowConnectionErrorMessage,
                    setShowRoomUpdateSuccessMessage,
                    setShowRoomUpdateErrorMessage,
                    setShowRoomNotFoundErrorMessage)}>
                Update Room
            </Button>
        </form>
        {modal}
    </>;
}

export default UpdateRoomScreen;
