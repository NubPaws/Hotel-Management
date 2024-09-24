import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { useState } from "react";
import { loginUser } from "./Login";
import { Modal } from "../UIElements/Modal";

export function LoginScreen() {
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    return (
        <>
            <CenteredLabel labelName="Login" />
            <form className="fieldsContainer">
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
                    onClick={(event) => {loginUser(event)}}>
                    Login
                </Button>
            </form>
            <Modal title="Login Failed" show={showErrorMessage} onClose={() => { setShowErrorMessage(false) }}>
                <h5>Incorrect username/password</h5>
            </Modal>
        </>
    )
}