import { FC, FormEvent, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import useFetchRoomTypes from "./Hooks/useFetchRoomTypes";
import FormContainer from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";
import RoomTypeEntry from "./Elements/RoomTypeEntry";
import { usePopupInfo } from "../Utils/Contexts/PopupInfoContext";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import { makeRequest } from "../APIRequests/APIRequests";

import "./RoomTypesScreen.css"

const RoomTypesScreen: FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
    
    const { roomTypes, typesDescription, loading, update } = useFetchRoomTypes(userCredentials.token);
    
    const [roomType, setRoomType] = useState("");
    const [description, setDescription] = useState("");
    
    const [showModal] = useModalError();
    const [showInfoPopup] = usePopupInfo();
    
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        
        const url = `api/Rooms/create-type/${roomType}`;
        
        try {
            const res = await makeRequest(url, "POST", "json", {
                description: description,
            }, userCredentials.token);
            if (res.ok) {
                showInfoPopup(`Successfully created room type ${roomType}`);
                update();
            } else {
                showModal("Error occured", await res.json());
            }
        } catch (error: any) {
            showModal("Error occured", error.message);
        }
    }
    
    const removeEntry = async (entry: string) => {
        const url = `api/Rooms/remove-type/${entry}`;
        
        try {
            const res = await makeRequest(url, "POST", "json", {
                newType: "Example",
            }, userCredentials.token);
            if (res.ok) {
                showInfoPopup(`Successfully deleted room type ${entry}`);
                update();
            } else {
                showModal("Failed", `Failed to remove ${entry} room type ${await res.json()}`);
            }
        } catch (error: any) {
            showModal("Error occured", error.message);
        }
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
                value="Create"
            />
        </FormContainer>
        <div className="room-type-entries-container">
            {roomTypes && roomTypes.map((value, index) => (
                <RoomTypeEntry
                    key={index}
                    description={typesDescription[index]}
                    entry={value}
                    removeEntry={removeEntry}
                />
            ))}
        </div>
    </>
    );
};

export default RoomTypesScreen;
