import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { loginUser } from "./Login";
import { Modal } from "../UIElements/Modal";

export function LoginScreen(props: {
    userCredentials: {},
    setUserCredentials: React.Dispatch<React.SetStateAction<{}>>
}) {
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);

    // Will change after successful login attempt
    useEffect(() => {
        if (Object.keys(props.userCredentials).length !== 0) {
            navigate("/home");
        }
    }, [props.userCredentials, props.setUserCredentials, navigate]);

    return (
        <>
            <CenteredLabel labelName="Login" />
            <form id="loginForm" className="fieldsContainer" action="http://localhost:8000/api/Tokens">
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
                            setShowConnectionErrorMessage,
                            props.setUserCredentials)
                    }}>
                    Login
                </Button>
            </form>
            <Modal title="Login Failed" show={showErrorMessage} onClose={() => { setShowErrorMessage(false) }}>
                <h5>Incorrect username/password</h5>
            </Modal>
            <Modal title="Failed to connect to server" show={showConnectionErrorMessage} onClose={() => { setShowConnectionErrorMessage(false) }}>
                <h5>Unfortunately, we failed to reach our server.</h5>
            </Modal>
        </>
    )
}