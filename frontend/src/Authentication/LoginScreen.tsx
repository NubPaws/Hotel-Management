import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { loginUser } from "./Login";
import { Modal } from "../UIElements/Modal";

export function LoginScreen(props: {
    userCredentials: UserCredentials,
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    // Will change after successful login attempt
    useEffect(() => {
        if (props.userCredentials.username !== "") {
            navigate("/home");
        }
    }, [props.userCredentials, props.setUserCredentials, navigate]);

    return (
        <>
            <CenteredLabel labelName="Login" />
            <form id="loginForm" className="fieldsContainer" action="http://localhost:8000/api/Users/login">
                <Input id="username" className="field" type="text" name="username"
                    placeholder="Username" errorMessageId="usernameErrorMessage">
                    Username
                </Input>
                <Input id="password" className="field" type="password" name="password"
                    placeholder="Password" errorMessageId="passwordErrorMessage">
                    Password
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => {
                        loginUser(event,
                            setShowErrorMessage,
                            props.setShowConnectionErrorMessage,
                            props.setUserCredentials)
                    }}>
                    Login
                </Button>
            </form>
            <Modal title="Login Failed" show={showErrorMessage} onClose={() => { setShowErrorMessage(false) }}>
                <h5>Incorrect username/password</h5>
            </Modal>
        </>
    )
}