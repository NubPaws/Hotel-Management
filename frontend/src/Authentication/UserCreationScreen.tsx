import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Input, InputType } from "../UIElements/Forms/Input";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { createUser } from "./UserCreation";
import { Modal } from "../UIElements/Modal";
import { NavigationBar } from "../UIElements/NavigationBar";
import { ScreenProps } from "../Utils/Props";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import RadioButtonContainer from "../UIElements/Forms/Radio/RadioButtonContainer";
import RadioButton from "../UIElements/Forms/Radio/RadioButton";

const UserCreationScreen: React.FC<ScreenProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showUserExistsErrorMessage, setShowUserExistsErrorMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (userCredentials.role !== "Admin") {
            navigate("/login");
        }
    }, [userCredentials, navigate]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        createUser(event,
            userCredentials.token,
            setShowErrorMessage,
            setShowConnectionErrorMessage,
            setShowSuccessMessage,
            setShowUserExistsErrorMessage)
    }
    
    return <>
        <NavigationBar />
        <CenteredLabel>Create New User</CenteredLabel>
        <FormContainer onSubmit={handleSubmit}>
            <Input
                id="username"
                label="Username"
                type={InputType.Text}
                placeholder="Username"
                hint="At least 4 characters long"
            />
            <Input
                id="password"
                label="Password"
                type={InputType.Password}
                placeholder="Password"
                hint="At least 4 characters long"
            />
            <Input
                id="confirmPassword"
                label="Confirm Password"
                type={InputType.Password}
                placeholder="Confirm Password"
            />
            
            <RadioButtonContainer title="Select User's Role:" name="role">
                <RadioButton>User</RadioButton>
                <RadioButton>Admin</RadioButton>
            </RadioButtonContainer>
            
            <RadioButtonContainer title="Select User's Department:" name="department">
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
        
        {showErrorMessage && (
            <Modal title="User Creation Failed" onClose={() => { setShowErrorMessage(false) }}>
                Failed to create user
            </Modal>
        )}
        {showSuccessMessage && (
            <Modal title="User Creation Success" onClose={() => { setShowSuccessMessage(false) }}>
                Succeeded in creating a new user
            </Modal>
        )}
        {showUserExistsErrorMessage && (
            <Modal title="User Already Exists" onClose={() => { setShowUserExistsErrorMessage(false) }}>
                User already exists
            </Modal>
        )}
    </>;
}

export default UserCreationScreen;
