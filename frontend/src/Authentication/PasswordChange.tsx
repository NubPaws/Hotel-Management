import { confirmPassword, validatePassword } from "./Validation";

async function changePassword(event : any) {
    event.preventDefault();
    if (validatePassword("oldPassword", "oldPasswordErrorMessage")
        && validatePassword("newPassword", "passwordErrorMessage")
        && confirmPassword("newPassword", "confirmPassword", "confirmPasswordErrorMessage")) {
        // let oldPassword = document.getElementById("oldPassword") as HTMLInputElement;
        // let newPassword = document.getElementById("newPassword") as HTMLInputElement;
        // let passwordChangeData = {

        // }
    }
}

export { changePassword };