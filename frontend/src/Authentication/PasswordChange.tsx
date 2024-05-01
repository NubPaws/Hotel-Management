import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"

export function ChangePassword() {
    return (
      <>
        <CenteredLabel labelName="Password Change" />
        <form className="fieldsContainer">
          <Input id="oldPassword" className="field" type="password" name="oldPassword"
                    placeholder="Old Password" errorMessageId="oldPasswordErrorMessage">
                    Old Password
          </Input>
          <Input id="newPassword" className="field" type="password" name="newPassword"
                    placeholder="New Password" errorMessageId="newPasswordErrorMessage">
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
                    onClick={() => {}}>
                    Login
          </Button>
        </form>
      </>
    )
}