import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Input, { InputType } from "../UIElements/Forms/Input";
import CenteredLabel from "../UIElements/CenteredLabel";
import { changePassword } from "./PasswordChange";
import Modal from "../UIElements/Modal";
import { NavigationBar } from "../UIElements/NavigationBar";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import { ReactSetStateDispatch } from "../Utils/Types";
import { UserCredentials } from "../APIRequests/ServerData";

export interface ChangePasswordScreenProps {
    userCredentials: UserCredentials;
    setUserCredentials: ReactSetStateDispatch<UserCredentials>;
    setShowConnectionErrorMessage: ReactSetStateDispatch<boolean>;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
    userCredentials,
    setUserCredentials,
    setShowConnectionErrorMessage,
}) => {
    const navigate = useNavigate();
    
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    
    useEffect(() => {
        if (userCredentials.username === "") {
            navigate("/login");
        }
    }, [userCredentials, navigate]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await changePassword(
            userCredentials,
            oldPass,
            newPass,
            confirmPass,
            setShowErrorMessage,
            setShowSuccessMessage,
            setShowConnectionErrorMessage,
            setUserCredentials,
        );
    }
    
    return <>
        <NavigationBar />
        <CenteredLabel>Change Password</CenteredLabel>
        <FormContainer onSubmit={handleSubmit}>
            <Input
                id="old-password"
                label="Old Password"
                type={InputType.Password}
                placeholder="Enter old password"
                onChange={(e) => setOldPass(e.target.value)}
            />
            <Input
                id="new-password"
                label="New Password"
                type={InputType.Password}
                placeholder="Enter new password"
                onChange={(e) => setNewPass(e.target.value)}
            />
            <Input
                id="confirm-password"
                label="Confirm Password"
                type={InputType.Password}
                placeholder="Enter new password again"
                onChange={(e) => setConfirmPass(e.target.value)}
            />
            <Input
                id="change-password-button"
                type={InputType.Submit}
                value="Update Password"
            />
        </FormContainer>
        
        {showErrorMessage && (
            <Modal title="Password Change Failed" onClose={() => setShowErrorMessage(false)}>
                Failed to change user's password
            </Modal>
        )}
        {showSuccessMessage && (
            <Modal title="Password Change Success" onClose={() => setShowSuccessMessage(false)}>
                Succeeded in changing user's password
            </Modal>
        )}
    </>;
}
