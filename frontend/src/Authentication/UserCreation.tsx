import { confirmPassword, validatePassword, validateUsername, validateUserRole } from "./Validation";

async function createUser(event : any,
    token: string,
    setShowErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    event.preventDefault();
    if (validateUsername()
        && validatePassword("password", "passwordErrorMessage")
        && confirmPassword("password", "confirmPassword", "confirmPasswordErrorMessage")
        && validateUserRole()) {
        let enteredUsername = document.getElementById("username") as HTMLInputElement;
        let enteredPassword = document.getElementById("password") as HTMLInputElement;

        const userRole: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="role"]');
        let userRoleIndex = 0;

        for (let i = 0; i < userRole.length; i++) {
            if (userRole[i].checked) {
                userRoleIndex = i;
            }
        }

        let userData = {
            "username": enteredUsername.value,
            "password": enteredPassword.value,
            "Role": userRole[userRoleIndex].value
        };

        let res = null;
        try {
            let createUserForm = document.getElementById("createUserForm") as HTMLFormElement;
            res = await fetch(createUserForm.action, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                'body': JSON.stringify(userData)
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
            // Clearing the form
            let confirmPassword = document.getElementById("confirmPassword") as HTMLInputElement;
            enteredUsername.value = "";
            enteredPassword.value = "";
            confirmPassword.value = "";
            userRole[userRoleIndex].checked = false;
        }
    }
}

export { createUser };