import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import "./LoginScreen.css"

export function LoginScreen() {
    return (
      <>
        <div className="label">
          <div className="text-wrapper">Login</div>
        </div>
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
                    onClick={() => {}}>
                    Login
          </Button>
        </form>
      </>
    )
}