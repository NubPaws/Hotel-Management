import { confirmPassword, validatePassword } from "./Validation";

async function changePassword(event : any,
    userCredentials: UserCredentials,
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>,
    setShowErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    event.preventDefault();
    if (validatePassword("oldPassword", "oldPasswordErrorMessage")
        && validatePassword("newPassword", "passwordErrorMessage")
        && confirmPassword("newPassword", "confirmPassword", "confirmPasswordErrorMessage")) {
        let oldPassword = document.getElementById("oldPassword") as HTMLInputElement;
        let newPassword = document.getElementById("newPassword") as HTMLInputElement;
        let passwordChangeData = {
            "username": userCredentials.username,
            "oldPassword": oldPassword.value,
            "newPassword": newPassword.value
        }

        let res = null;
        try {
            let changePasswordForm = document.getElementById("changePasswordForm") as HTMLFormElement;
            res = await fetch(changePasswordForm.action, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': userCredentials.token
                },
                'body': JSON.stringify(passwordChangeData)
            });
        } catch (error) {
            if (error instanceof TypeError) {
                setShowConnectionErrorMessage(true);
                return;
            }
        }
        if (res!.status !== 200) {
            setShowErrorMessage(true);
        } else {
            setShowSuccessMessage(true);
            setUserCredentials({
                token: "Bearer " + res!.text(),
                username: userCredentials.username,
                role: userCredentials.role
            })
            // Clearing the form
            let confirmPassword = document.getElementById("confirmPassword") as HTMLInputElement;
            oldPassword.value = "";
            newPassword.value = "";
            confirmPassword.value = "";
        }
    }
}

export { changePassword };