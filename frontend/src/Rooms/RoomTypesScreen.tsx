import { FC, FormEvent, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import useFetchRoomTypes from "./Hooks/useFetchRoomTypes";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";

const RoomTypesScreen: FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    const { roomTypes, loading } = useFetchRoomTypes(userCredentials.token);
    
    const [roomType, setRoomType] = useState("");
    const [description, setDescription] = useState("");
    
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
    }
    
    if (loading) {
        return <p>Loading room types, please wait...</p>
    }
    
    return (
    <>
        <NavigationBar />
        <CenteredLabel>Room Types Management</CenteredLabel>
        <FormContainer onSubmit={handleSubmit}>
            <SearchableDropdown
                id="room-types-dropdown"
                options={roomTypes}
                setValue={setRoomType}
                label="Room type"
                required
            />
            <Input
                id="room-types-description"
                type={InputType.Text}
                value={description}
                placeholder="Enter room type description"
                label="Description"
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <Input
                id="room-types-submit-btn"
                type={InputType.Submit}
                value={roomTypes.includes(roomType) ? "Update" : "Create"}
            />
        </FormContainer>
        
        <form id="roomTypeCreateForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/create-type/">
            {/* <Input id="roomType" className="field" type="text" name="roomType"
                placeholder="Enter room type" errorMessageId="roomTypeErrorMessage">
                Room type
            </Input>
            <Input id="roomDescription" className="field" type="text" name="roomDescription"
                placeholder="Enter room description" errorMessageId="roomDescriptionErrorMessage">
                Room description
            </Input> */}
            {/* <Button
                className="fieldLabel"
                bgColor="white"
                textColor="black"
                borderWidth="1px"
                onClick={(event) => createRoomType(event,
                    props.userCredentials.token,
                    props.setShowConnectionErrorMessage,
                    setShowRoomTypeCreationSuccessMessage,
                    setShowRoomTypeCreationErrorMessage)}>
                Create Room Type
            </Button> */}
        </form>
        {/* <Modal title="Room Type Successfully created" show={showRoomTypeCreationSuccessMessage} onClose={() => { setShowRoomTypeCreationSuccessMessage(false) }}>
            <h5>Succeeded in creating room type</h5>
        </Modal>
        <Modal title="Room Type Creation Failed" show={showRoomTypeCreationErrorMessage} onClose={() => { setShowRoomTypeCreationErrorMessage(false) }}>
            <h5>Failed in creating room type</h5>
        </Modal> */}

        {/* <CenteredLabel labelName="Room Type Removal"></CenteredLabel> */}
        <form id="roomTypeRemovalForm" className="fieldsContainer" action="http://localhost:8000/api/Rooms/remove-type/">
            {/* <Input id="roomTypeToRemove" className="field" type="text" name="roomTypeToRemove"
                placeholder="Enter room type to remove" errorMessageId="roomTypeToRemoveErrorMessage">
                Room type to remove
            </Input>
            <Input id="roomNewType" className="field" type="text" name="roomNewType"
                placeholder="Enter room new type" errorMessageId="roomNewTypeErrorMessage">
                Room new Type
            </Input>
            <Button
                className="fieldLabel"
                bgColor="white"
                textColor="black"
                borderWidth="1px"
                onClick={(event) => removeRoomType(event,
                                                    props.userCredentials.token,
                                                    props.setShowConnectionErrorMessage,
                                                    setShowRoomTypeRemovalSuccessMessage,
                                                    setShowRoomTypeRemovalErrorMessage)}>
                Remove Room Type
            </Button> */}
        </form>
        {/* <Modal title="Room Type Successfully removed" show={showRoomTypeRemovalSuccessMessage} onClose={() => { setShowRoomTypeRemovalSuccessMessage(false) }}>
            <h5>Succeeded in removing room type</h5>
        </Modal>
        <Modal title="Room Type Removal Failed" show={showRoomTypeRemovalErrorsMessage} onClose={() => { setShowRoomTypeRemovalErrorMessage(false) }}>
            <h5>Failed in removing room type</h5>
        </Modal> */}
    </>
    );
};

export default RoomTypesScreen;
