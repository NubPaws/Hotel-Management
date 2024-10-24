const USERNAME_MIN_LENGTH = 4;
const PASSWORD_MIN_LENGTH = 4;

function validateUsername() {
    let username = document.getElementById("username") as HTMLInputElement;
    let errorMessageSpan = document.getElementById("usernameErrorMessage")!
    if (username.value.length < USERNAME_MIN_LENGTH) {
        errorMessageSpan.innerText = "Username needs to have at least 4 characters";
        return false;
    }
    errorMessageSpan.innerText = "";
    return true;
}

function validatePassword(passwordId: string, passwordErrorMessageId: string) {
    let password = document.getElementById(passwordId) as HTMLInputElement;
    let errorMessageSpan = document.getElementById(passwordErrorMessageId)!
    if (password.value.length < PASSWORD_MIN_LENGTH) {
        errorMessageSpan.innerText = "Password needs have at least " + PASSWORD_MIN_LENGTH + " characters";
        return false;
    }
    errorMessageSpan.innerText = "";
    return true;
}

function confirmPassword(passwordId: string, confirmPasswordId: string, confirmPasswordErrorMessageId: string) {
    let password = document.getElementById(passwordId) as HTMLInputElement;
    let confirmPassword = document.getElementById(confirmPasswordId) as HTMLInputElement;
    let errorMessageSpan = document.getElementById(confirmPasswordErrorMessageId) as HTMLInputElement;
    if (confirmPassword.value.length < PASSWORD_MIN_LENGTH) {
        errorMessageSpan.innerText = "Password needs have at least " + PASSWORD_MIN_LENGTH + " characters";
        return false;
    }
    if (confirmPassword.value !== password.value) {
        errorMessageSpan.innerText = "Passwords do not match";
        return false;
    }
    errorMessageSpan.innerText = "";
    return true;
}

function validateUserRole() {
    const userRole: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="role"]');
    let validChoice = false;
    let userRoleErrorMessage = document.getElementById("userRoleErrorMessage") as HTMLInputElement;

    for (let i = 0; i < userRole.length; i++) {
        if (userRole[i].checked) {
            validChoice = true;
        }
    }
    if (!validChoice) {
        userRoleErrorMessage.innerText = "Role must be chosen";
        return false;
    }
    else {
        userRoleErrorMessage.innerText = "";
    }
    return validChoice;
}

function validateUserDepartment() {
    const userDepartment: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="department"]');

    let validChoice = false;
    let userDepartmentErrorMessage = document.getElementById("userDepartmentErrorMessage") as HTMLInputElement;

    for (let i = 0; i < userDepartment.length; i++) {
        if (userDepartment[i].checked) {
            validChoice = true;
        }
    }
    if (!validChoice) {
        userDepartmentErrorMessage.innerText = "Role must be chosen";
        return false;
    }
    else {
        userDepartmentErrorMessage.innerText = "";
    }
    return validChoice;
}

export {
    validateUsername,
    validatePassword,
    confirmPassword,
    validateUserRole,
    validateUserDepartment
}