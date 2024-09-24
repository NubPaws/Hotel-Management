import { confirmPassword, validatePassword } from "./Validation";

async function changePassword(event : any) {
    event.preventDefault();
    if (validatePassword("oldPassword", "oldPasswordErrorMessage")
        && validatePassword("newPassword", "passwordErrorMessage")
        && confirmPassword("newPassword", "confirmPassword", "confirmPasswordErrorMessage")) {
        // change password logic
    }
}

export { changePassword };