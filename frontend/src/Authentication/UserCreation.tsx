import { confirmPassword, validatePassword, validateUsername, validateUserRole } from "./Validation";

async function createUser(event : any) {
    event.preventDefault();
    if (validateUsername()
        && validatePassword("password", "passwordErrorMessage")
        && confirmPassword("password", "confirmPassword", "confirmPasswordErrorMessage")
        && validateUserRole()) {
        // user creation logic
    }
}

export { createUser };