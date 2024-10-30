import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { changePassword } from "./PasswordChange"
import { Modal } from "../UIElements/Modal";
import { NavigationBar } from "../UIElements/NavigationBar";

export function ChangePasswordScreen(props: {
    userCredentials: UserCredentials,
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/login");
        }
    }, [props.userCredentials, props.setUserCredentials, navigate]);

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Password Change" />
            <form id="changePasswordForm" className="fieldsContainer" action="http://localhost:8000/api/Users/change-password">
                <Input id="oldPassword" className="field" type="password" name="oldPassword"
                    placeholder="Old Password" errorMessageId="oldPasswordErrorMessage">
                    Old Password
                </Input>
                <Input id="newPassword" className="field" type="password" name="password"
                    placeholder="New Password" errorMessageId="passwordErrorMessage">
                    New Password
                </Input>
                <Input id="confirmPassword" className="field" type="password" name="confirmPassword"
                    placeholder="Confirm Password" errorMessageId="confirmPasswordErrorMessage">
                    Confirm Password
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => { changePassword(event,
                                                         props.userCredentials,
                                                         props.setUserCredentials,
                                                         setShowErrorMessage,
                                                         props.setShowConnectionErrorMessage,
                                                         setShowSuccessMessage)}}>
                    Change Password
                </Button>
            </form>
            <Modal title="Password Change Failed" show={showErrorMessage} onClose={() => { setShowErrorMessage(false) }}>
                <h5>Failed to change user's password</h5>
            </Modal>
            <Modal title="Password Change Success" show={showSuccessMessage} onClose={() => { setShowSuccessMessage(false) }}>
                <h5>Succeeded in changing user's password</h5>
            </Modal>
        </>
    )
}