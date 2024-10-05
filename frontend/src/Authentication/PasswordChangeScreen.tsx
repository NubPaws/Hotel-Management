import { useNavigate } from "react-router-dom"
import { redirect } from "react-router-dom";
import { useEffect } from "react";
import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { changePassword } from "./PasswordChange"

export function ChangePasswordScreen(props: {
    userCredentials: {},
    setUserCredentials: React.Dispatch<React.SetStateAction<{}>>
}) {
    const navigate = useNavigate();

    useEffect(() => {
        if (Object.keys(props.userCredentials).length === 0) {
            props.setUserCredentials({});
            navigate("/login");
        }
    }, [props.userCredentials, props.setUserCredentials, navigate]);

    return (
        <>
            <CenteredLabel labelName="Password Change" />
            <form className="fieldsContainer">
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
                    onClick={(event) => { changePassword(event)}}>
                    Change Password
                </Button>
            </form>
        </>
    )
}