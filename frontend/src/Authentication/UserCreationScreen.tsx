import { useState } from "react"
import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { validateUserCreation } from "./Validation";

export function UserCreationScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPasswordText, setConfirmPasswordText] = useState("");

    let [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    let [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    let [confirmPasswordFailedMessage, setConfirmPasswordFailedMessage] = useState("");

    return (
      <>
        <CenteredLabel labelName="Create User" />
        <form className="fieldsContainer">
          <Input id="username" className="field" type="text" name="username"
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}>
                      Username
          </Input>
          <div>{usernameErrorMessage}</div>
          <Input id="password" className="field" type="password" name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}>
                    Password
          </Input>
          <div>{passwordErrorMessage}</div>
          <Input id="confirmPassword" className="field" type="password" name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPasswordText(e.target.value)}>
                    Confirm Password
          </Input>
          <div>{confirmPasswordFailedMessage}</div>
          <div className="userRoleContainer" >
            <p>Select user role:</p>
            <input type="radio" id="staff" name="role" value="staff"></input>
            <label htmlFor ="staff">Staff</label>
            <br/>
            <input type="radio" id="admin" name="role" value="admin"></input>
            <label htmlFor="admin">Admin</label>
          </div>
          <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={() => validateUserCreation(username,
                                                        password,
                                                        confirmPasswordText,
                                                        setUsernameErrorMessage,
                                                        setConfirmPasswordFailedMessage)}>
                    Login
          </Button>
        </form>
      </>
    )
}