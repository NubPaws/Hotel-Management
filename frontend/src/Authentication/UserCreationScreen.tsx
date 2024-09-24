import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { createUser } from "./UserCreation";

export function UserCreationScreen() {

    return (
        <>
            <CenteredLabel labelName="Create User" />
            <form className="fieldsContainer">
                <Input id="username" className="field" type="text" name="username"
                    placeholder="Username" errorMessageId="usernameErrorMessage">
                    Username<br/>
                    <span className="note">At least 4 characters long</span>
                </Input>
                <Input id="password" className="field" type="password" name="password"
                    placeholder="Password" errorMessageId="passwordErrorMessage">
                    Password<br/>
                </Input>
                <span className="note">At least 4 characters long</span>
                <Input id="confirmPassword" className="field" type="password" name="confirmPassword"
                    placeholder="Confirm Password" errorMessageId="confirmPasswordErrorMessage">
                    Confirm Password
                </Input>
                <div className="userRoleContainer" >
                    <p>Select user role:</p>
                    <input type="radio" id="staff" name="role" value="staff"></input>
                    <label htmlFor="staff">Staff</label>
                    <br />
                    <input type="radio" id="admin" name="role" value="admin"></input>
                    <label htmlFor="admin">Admin</label>
                    <div id="userRoleErrorMessage"></div>
                </div>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => createUser(event)}>
                    Login
                </Button>
            </form>
        </>
    )
}