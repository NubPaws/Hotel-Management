import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { useState } from "react";

export function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    return (
      <>
        <CenteredLabel labelName="Login" />
        <form className="fieldsContainer">
          <Input id="username" className="field" type="text" name="username"
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}>
                      Username
          </Input>
          <Input id="password" className="field" type="password" name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}>
                    Password
          </Input>
          <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={() => {}}>
                    Login
          </Button>
        </form>
      </>
    )
}