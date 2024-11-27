import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenProps } from "../Utils/Props";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import usePopup from "../Utils/Contexts/PopupContext";
import Input, { InputType } from "../UIElements/Forms/Input";
import IconButton from "../UIElements/Buttons/IconButton";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import CenteredLabel from "../UIElements/CenteredLabel";
import { makeRequest } from "../APIRequests/APIRequests";
import RoleRadioButtons from "./Elements/RoleRadioButton";
import DepartmentRadioButtons from "./Elements/DepartmentRadioButton";

import searchIcon from "../assets/search-plus.svg";
import saveIcon from "../assets/save.svg";
import "./EditUserScreen.css";

const EditUserScreen: React.FC<ScreenProps> = ({
    userCredentials
}) => {
    const [username, setUsername] = useState("");
    const [showButtons, setShowButtons] = useState(false);
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    
    const [showModal] = useModalError();
    const [_, showInfoPopup] = usePopup();
    
    useUserRedirect(userCredentials, ["Admin"]);
    const navigate = useNavigate();
    
    const searchUser = async () => {
        try {
            const res = await makeRequest(`api/Users/${username}`, "GET", "text", "", userCredentials.token);
            if (!res.ok) {
                showModal("Invalid username", "Invalid username entered, try again.");
                return;
            }
            
            const userResponse = await res.json();
            
            setRole(userResponse.role);
            setDepartment(userResponse.department);
            setShowButtons(true);
            
            showInfoPopup(`Fetched user ${userResponse.user}`);
        } catch (error: any) {
            showModal("Error occured making the query", error.message);
        }
    };
    
    const handleSave = async () => {
        try {
            const requests = [];
            requests.push(
                makeRequest(
                    "api/Users/change-role",
                    "POST",
                    "json",
                    { username, newRole: role.replace(/ /g, "") },
                    userCredentials.token
                )
            );
            requests.push(
                makeRequest(
                    "api/Users/change-department",
                    "POST",
                    "json",
                    { username, newDepartment: department.replace(/ /g, "") },
                    userCredentials.token
                )
            );
            
            const results = await Promise.all(requests);
            
            // If any failed
            if (results.map(v => v.ok).includes(false)) {
                showModal("Update failed", `Failed to fully update the user ${username}`);
                return;
            }
            
            showInfoPopup(`Successfully updated ${username}'s role/department.`);
            navigate(-1);
        } catch (error: any) {
            showModal("Error occured making the request", error.message);
        }
    }
    
    return <>
    <CenteredLabel>Edit User</CenteredLabel>
    <div className="edit-user-container">
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
    {showButtons &&
    <div className="edit-user-radio-buttons">
        <MenuGridLayout>
            <RoleRadioButtons
                value={role}
                setValue={setRole}
            />
            <DepartmentRadioButtons
                value={department}
                setValue={setDepartment}
            />
        </MenuGridLayout>
    </div>
    }
    {showButtons && (
        <IconButton
            iconUrl={saveIcon}
            fontSize="18pt"
            className="edit-user-save-btn"
            onClick={handleSave}
        >
            Save
        </IconButton>
    )}
    </div>
    </>;
}

export default EditUserScreen;
