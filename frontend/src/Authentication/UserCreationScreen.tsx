import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Input, { InputType } from "../UIElements/Forms/Input";
import CenteredLabel from "../UIElements/CenteredLabel";
import Modal, { ModalController } from "../UIElements/Modal";
import { ScreenProps } from "../Utils/Props";
import FormContainer from "../UIElements/Forms/FormContainer";
import RadioButtonContainer from "../UIElements/Forms/Radio/RadioButtonContainer";
import RadioButton from "../UIElements/Forms/Radio/RadioButton";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";


const UserCreationScreen: React.FC<ScreenProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [userCreationMessage, setUserCreationMessage] = useState<ModalController | undefined>(undefined);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPasword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (userCredentials.role !== "Admin") {
            navigate("/login");
        }
    }, [userCredentials, navigate]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateInputs()) {
            return;
        }
        
        const userData = { username, password, role, department: department.replace(new RegExp(" ", 'g'), "") };
        
        try {
            const res = await makeRequest("api/Users/create", "POST", "json", userData, userCredentials.token);
            
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setUserCreationMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    };
    
    const validateInputs = () => {
        const ERROR_TITLE = "Failed to process form";
        if (password !== confirmPasword) {
            setUserCreationMessage({
                title: ERROR_TITLE,
                message: "Password and confirm password must be the same."
            });
            return false;
        }
        if (!role || !department) {
            setUserCreationMessage({
                title: ERROR_TITLE,
                message: "Role or department not chosen."
            })
            return false;
        }
        return true;
    };
    
    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 200:
                setUserCreationMessage({
                    title: "Success!",
                    message: "User created successfully!",
                });
                clearForm();
                break;
            case 400:
                    setUserCreationMessage({
                        title: "Failed!",
                        message: await res.text(),
                    });
                    break;
            case 409:
                setUserCreationMessage({
                    title: "User already exists!",
                    message: "User with that username already exists. Choose another username and try again.",
                });
                break;
            default:
                setShowConnectionErrorMessage(true);
                break;
        }
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
                <RadioButton>HouseKeeping</RadioButton>
                <RadioButton>Maintenance</RadioButton>
                <RadioButton>Food And Beverage</RadioButton>
                <RadioButton>Security</RadioButton>
                <RadioButton>Concierge</RadioButton>
            </RadioButtonContainer>
            
            <Input
                id="create-user-button"
                type={InputType.Submit}
                value="Create User" />
        </FormContainer>
        
        {userCreationMessage && (
            <Modal title={userCreationMessage.title} onClose={() => setUserCreationMessage(undefined) }>
                {userCreationMessage.message}
            </Modal>
        )}
    </>;
}

export default UserCreationScreen;
