import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Input, { InputType } from "../UIElements/Forms/Input";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { loginUser } from "./Login";
import Modal from "../UIElements/Modal";
import { ReactSetStateDispatch } from "../Utils/Types";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import { UserCredentials } from "../APIRequests/ServerData";

export interface LoginScreenProps {
    userCredentials: UserCredentials;
    setUserCredentials: ReactSetStateDispatch<UserCredentials>;
    setShowConnectionErrorMessage: ReactSetStateDispatch<boolean>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({userCredentials, setUserCredentials, setShowConnectionErrorMessage}) => {
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    useEffect(() => {
        if (userCredentials.username) {
            navigate("/home");
        }
    }, [userCredentials, navigate]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await loginUser(
            username,
            password,
            setShowErrorMessage,
            setShowConnectionErrorMessage,
            setUserCredentials
        );
    }
    
    return  <>
        <CenteredLabel>Hotel Management System</CenteredLabel>
        <FormContainer onSubmit={(e) => handleSubmit(e)}>
            <Input
                id="username"
                label="Username"
                type={InputType.Text}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                id="password"
                label="Password"
                type={InputType.Password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input
                id="login-submit-button"
                type={InputType.Submit}
                value="Login"
            />
        </FormContainer>
        {showErrorMessage && (
            <Modal title="Login Failed" onClose={() => setShowErrorMessage(false)}>
                Incorrect username/password
            </Modal>
        )}
    </>;
}
