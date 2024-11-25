import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input, { InputType } from "../UIElements/Forms/Input";
import CenteredLabel from "../UIElements/CenteredLabel";
import FormContainer from "../UIElements/Forms/FormContainer";
import { ScreenProps } from "../Utils/Props";
import { makeRequest } from "../APIRequests/APIRequests";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import { UserCredentials } from "../APIRequests/ServerData";

export const LoginScreen: React.FC<ScreenProps> = ({
    userCredentials,
    setUserCredentials,
}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const [showModal] = useModalError();
    
    useEffect(() => {
        if (userCredentials.username) {
            navigate("/home");
        }
    }, [userCredentials, navigate]);
    
    const getUserToken = async () => {
        const res = await makeRequest("api/Users/login", "POST", "json", {
            username,
            password,
        });
        
        if (!res.ok) {
            return "";
        }
        
        return `Bearer ${await res.text()}`;
    }
    
    const getUserCredentials = async (token: string): Promise<UserCredentials | undefined> => {
        const userRes = await makeRequest(`api/Users/${username}`, "GET", "text", "", token);
        if (!userRes.ok) {
            return undefined;
        }
        
        const userDetails = await userRes.json();
        return {
            token: token,
            username: userDetails.user,
            role: userDetails. role,
            department: userDetails.department,
        };
    }
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        try {
            const token = await getUserToken();
            if (token === "") {
                showModal(
                    "Incorrect login details",
                    "Invalid username and/or password, check the details and try again."
                );
                return;
            }
            
            const userCreds = await getUserCredentials(token);
            if (!userCreds) {
                showModal(
                    "Failed to fetch user",
                    "Failed to fetch user information, please try again later."
                );
                return;
            }
            
            setUserCredentials(userCreds);
        } catch (error: any) {
            showModal("Failed logging in", error.message);
        }
    }
    
    return <>
        <CenteredLabel>Hotel Management System</CenteredLabel>
        <FormContainer onSubmit={handleSubmit}>
            <Input
                id="username"
                label="Username"
                type={InputType.Text}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                id="password"
                label="Password"
                type={InputType.Password}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input
                id="login-submit-button"
                type={InputType.Submit}
                value="Login"
            />
        </FormContainer>
    </>;
}
