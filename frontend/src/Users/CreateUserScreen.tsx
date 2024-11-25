import React, { useState } from "react";
import Input, { InputType } from "../UIElements/Forms/Input";
import CenteredLabel from "../UIElements/CenteredLabel";
import { ScreenProps } from "../Utils/Props";
import FormContainer from "../UIElements/Forms/FormContainer";
import RadioButtonContainer from "../UIElements/Forms/Radio/RadioButtonContainer";
import RadioButton from "../UIElements/Forms/Radio/RadioButton";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";

const UserCreationScreen: React.FC<ScreenProps> = ({
    userCredentials, 
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPasword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    
    const [showModal] = useModalError();
    
    useUserRedirect(userCredentials, ["Admin"]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateInputs()) {
            return;
        }
        
        const userData = { username, password, role, department: department.replace(" ", "") };
        
        try {
            const res = await makeRequest("api/Users/create", "POST", "json", userData, userCredentials.token);
            
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                showModal("Failed to connect to server", error.message);
            }
            if (error instanceof RequestError) {
                showModal("General Error Occurred", error.message);
            }
        }
    };
    
    const validateInputs = () => {
        const ERROR_TITLE = "Failed to process form";
        if (password !== confirmPasword) {
            showModal(ERROR_TITLE, "Password and confirm password must be the same.");
            return false;
        }
        if (!role || !department) {
            showModal(ERROR_TITLE, "Role or department not chosen.")
            return false;
        }
        return true;
    };
    
    const handleResponse = async (res: Response) => {
        if (!res.ok) {
            if (res.status === 400) {
                showModal("Failed!", await res.text());
            } else if (res.status === 409) {
                showModal(
                    "User already exists!",
                    "User with that username already exists. Choose another username and try again."
                );
            } else {
                showModal("Failed to connect to server", "Connection to the server failed.");
            }
            return;
        }
        
        showModal("Success!", "User created successfully!");
        clearForm();
    };
    
    const clearForm = () => {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        setDepartment("");
    }
    
    return <>
        <CenteredLabel>Create New User</CenteredLabel>
        <FormContainer onSubmit={handleSubmit}>
            <Input
                id="username"
                label="Username"
                type={InputType.Text}
                placeholder="Username"
                value={username}
                hint="At least 4 characters long"
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                id="password"
                label="Password"
                type={InputType.Password}
                placeholder="Password"
                value={password}
                hint="At least 4 characters long"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input
                id="confirmPassword"
                label="Confirm Password"
                type={InputType.Password}
                placeholder="Confirm Password"
                value={confirmPasword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <RadioButtonContainer
                title="Select User's Role:"
                name="role"
                value={role}
                setValue={setRole}
            >
                <RadioButton>User</RadioButton>
                <RadioButton>Admin</RadioButton>
            </RadioButtonContainer>
            
            <RadioButtonContainer
                title="Select User's Department:"
                name="department"
                value={department}
                setValue={setDepartment}
            >
                <RadioButton>General</RadioButton>
                <RadioButton>Front Desk</RadioButton>
                <RadioButton>Housekeeping</RadioButton>
                <RadioButton>Maintenance</RadioButton>
                <RadioButton>Food and Beverage</RadioButton>
                <RadioButton>Security</RadioButton>
                <RadioButton>Concierge</RadioButton>
            </RadioButtonContainer>
            
            <Input
                id="create-user-button"
                type={InputType.Submit}
                value="Create User" />
        </FormContainer>
    </>;
}

export default UserCreationScreen;
