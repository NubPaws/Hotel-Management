const USERNAME_MIN_LENGTH = 4;
const PASSWORD_MIN_LENGTH = 4;

function validateUsername(username: string) {
    return username.length >= USERNAME_MIN_LENGTH;
}

function validatePassword(password: string) {
    return password.length >= PASSWORD_MIN_LENGTH;
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


function validateRadioButton(radioName: string, errorMessageId: string, errorMessageContent: string) {
    let selector = 'input[name="' + radioName + '"]'
    const radioOptions: NodeListOf<HTMLInputElement> = document.querySelectorAll(selector);

    let validChoice = false;
    let errorMessage = document.getElementById(errorMessageId) as HTMLInputElement;

    for (let i = 0; i < radioOptions.length; i++) {
        if (radioOptions[i].checked) {
            validChoice = true;
        }
    }
    if (!validChoice) {
        errorMessage.innerText = errorMessageContent;
        return false;
    }
    else {
        errorMessage.innerText = "";
    }
    return validChoice;
}

export {
    validateUsername,
    validatePassword,
    confirmPassword,
    validateRadioButton,
}