import { Dispatch, SetStateAction } from "react";

const USERNAME_MIN_LENGTH = 4;
const PASSWORD_MIN_LENGTH = 4;

// Validated all the fields required to create user
function validateUserCreation(username: string,
    password: string,
    confirmPasswordText: string,
    setUsernameErrorMessage: Dispatch<SetStateAction<string>>,
    setConfirmPasswordFailedMessage: Dispatch<SetStateAction<string>>,
) {
    if (!validateUsername(username, setUsernameErrorMessage)) {
        return false;
    }
    if (!validatePassword(password,
                           confirmPasswordText,
                           setConfirmPasswordFailedMessage)) {
        return false;
    }
    return true;
}

function validateUsername(username: string,
                          setUsernameErrorMessage: Dispatch<SetStateAction<string>>) {
    if (username.length === 0) {
        setUsernameErrorMessage("Username is empty");
        return false;
    }
    if (username.length < USERNAME_MIN_LENGTH) {
        setUsernameErrorMessage(`Username length need to be ${USERNAME_MIN_LENGTH} characters length`);
        return false;
    }
    return true;
}

function validatePassword(passwordFirstAttempt: string,
                         passwordSecondAttempt: string,
                         setConfirmPasswordFailedMessage: Dispatch<SetStateAction<string>>) {
    if (passwordFirstAttempt !== passwordSecondAttempt) {
        setConfirmPasswordFailedMessage("Passwords don't match");
        return false;
    }
    if (passwordFirstAttempt.length < PASSWORD_MIN_LENGTH) {
        setConfirmPasswordFailedMessage(`Username length need to be ${PASSWORD_MIN_LENGTH} characters length`);
        return false;
    }
    return true;
}

export {
    validateUserCreation
}