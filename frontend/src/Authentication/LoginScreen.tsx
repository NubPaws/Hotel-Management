import { Input } from "../UIElements/Input"
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
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </>
    )
}