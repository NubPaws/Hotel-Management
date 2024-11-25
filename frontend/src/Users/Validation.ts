const USERNAME_MIN_LENGTH = 4;
const PASSWORD_MIN_LENGTH = 4;

function validateUsername(username: string) {
    return username.length >= USERNAME_MIN_LENGTH;
}

function validatePassword(password: string) {
    return password.length >= PASSWORD_MIN_LENGTH;
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
    validateRadioButton,
}