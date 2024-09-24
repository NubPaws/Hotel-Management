import { validatePassword, validateUsername } from "./Validation";

async function loginUser(event : any) {
    event.preventDefault();
    if (validateUsername() && validatePassword("password", "passwordErrorMessage")) {
        // login logic
    }
}

export { loginUser };