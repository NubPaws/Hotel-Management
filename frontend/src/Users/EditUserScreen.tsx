import React, { useState } from "react";
import { ScreenProps } from "../Utils/Props";
import Input, { InputType } from "../UIElements/Forms/Input";
import IconButton from "../UIElements/Buttons/IconButton";

import searchIcon from "../assets/search-plus.svg";
import "./EditUserScreen.css";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import { makeRequest } from "../APIRequests/APIRequests";
import { UserCredentials } from "../APIRequests/ServerData";

const EditUserScreen: React.FC<ScreenProps> = ({
    userCredentials
}) => {
    const [username, setUsername] = useState("");
    const [showButtons, setShowButtons] = useState(false);
    
    const [showModal] = useModalError();
    
    useUserRedirect(userCredentials, ["Admin"]);
    
    const searchUser = async () => {
        try {
            const res = await makeRequest(`api/Users/${username}`, "GET", "text", "", userCredentials.token);
            if (!res.ok) {
                showModal("Invalid username", "Invalid username entered, try again.");
                return;
            }
            
            const user = await res.json() as UserCredentials;
            console.log(user);
        } catch (error: any) {
            showModal("Error occured making the query", error.message);
        }
    }
    
    return <div className="edit-user-container">
    <div className="edit-user-search">
        <Input
            id="edit-user-username"
            type={InputType.Text}
            label="Username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <IconButton
            iconUrl={searchIcon}
            fontSize="18pt"
            className="edit-user-search-user-btn"
            onClick={searchUser}
        />
    </div>
    <div className="edit-user-radio-buttons">
        
    </div>
    </div>;
}

export default EditUserScreen;
