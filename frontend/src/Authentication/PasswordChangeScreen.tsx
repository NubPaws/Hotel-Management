import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Input, { InputType } from "../UIElements/Forms/Input";
import CenteredLabel from "../UIElements/CenteredLabel";
import Modal, { ModalController } from "../UIElements/Modal";
import { NavigationBar } from "../UIElements/NavigationBar";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import { ReactSetStateDispatch } from "../Utils/Types";
import { UserCredentials } from "../APIRequests/ServerData";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { validatePassword } from "./Validation";

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
    const [passwordChangeMessage, setPasswordChangeMessage] = useState<ModalController | undefined>();
    
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    
    useEffect(() => {
        if (userCredentials.username === "") {
            navigate("/login");
        }
    }, [userCredentials, navigate]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateInputs()) {
            return;
        }
        
        const data = {
            username: userCredentials.username,
            oldPassword: oldPassword,
            newPassword: newPassword,
        }
        
        try {
            const res = await makeRequest("api/Users/change-password", "POST", "json", data, userCredentials.token);
            
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setPasswordChangeMessage({
                    title: "General Error Occured",
                    message: error.message,
                });
            }
        }
    };
    
    const validateInputs = () => {
        if (oldPassword === newPassword) {
            setPasswordChangeMessage({
                title: "Reused passwords",
                message: "Your new password cannot be the same as your old one."
            });
            return false;
        }
        if (!validatePassword(newPassword)) {
            setPasswordChangeMessage({
                title: "Invalid new password",
                message: "Make sure that the password is appropriate.",
            });
            return false;
        }
        if (newPassword !== confirmPass) {
            setPasswordChangeMessage({
                title: "Passwords don't match",
                message: "New password and confirmed password don't match.",
            });
            return false;
        }
        return true;
    };
    
    const handleResponse = (res: Response) => {
        if (res.status === 200) {
            setPasswordChangeMessage({
                title: "Success",
                message: "Password changed successfully",
            });
            
            // Get the text from the response and update the user's token.
            res.text().then((value: string) => {
                setUserCredentials({ ...userCredentials, token: `Bearer ${value}`});
            });
            
            clearInputs();
            return;
        }
        if (res.status === 400) {
            setPasswordChangeMessage({
                title: "Request failed",
                message: "One or more of the fields is wrong/invalid.",
            });
            
            return;
        }
        if (res.status === 401) {
            setPasswordChangeMessage({
                title: "Unauthorized!",
                message: "You are not authorized to make that request",
            });
            
            return;
        }
        
        setShowConnectionErrorMessage(true);
    }
    
    const clearInputs = () => {
        setNewPassword("");
        setOldPassword("");
        setConfirmPass("");
    };
    
    return <>
        <NavigationBar />
        <CenteredLabel>Change Password</CenteredLabel>
        <FormContainer onSubmit={handleSubmit}>
            <Input
                id="old-password"
                label="Old Password"
                type={InputType.Password}
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
                id="new-password"
                label="New Password"
                type={InputType.Password}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
                id="confirm-password"
                label="Confirm Password"
                type={InputType.Password}
                placeholder="Enter new password again"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
            />
            <Input
                id="change-password-button"
                type={InputType.Submit}
                value="Update Password"
            />
        </FormContainer>
        
        {passwordChangeMessage && (
            <Modal title={passwordChangeMessage.title} onClose={() => setPasswordChangeMessage(undefined)}>
                {passwordChangeMessage.message}
            </Modal>
        )}
    </>;
}
