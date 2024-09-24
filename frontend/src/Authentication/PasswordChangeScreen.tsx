import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { changePassword } from "./PasswordChange"

export function ChangePassword() {
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