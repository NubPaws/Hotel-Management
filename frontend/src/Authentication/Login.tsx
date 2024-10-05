import { getUserDetails } from "../APIRequests/APIRequests";
import { validatePassword, validateUsername } from "./Validation";

async function loginUser(event : any,
                        setShowErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
                        setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
                        setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>) {
    event.preventDefault();
    if (validateUsername() && validatePassword("password", "passwordErrorMessage")) {
        let enteredUsername = document.getElementById("username") as HTMLInputElement;
        let enteredPassword = document.getElementById("password") as HTMLInputElement;
        let userData = {
            "username": enteredUsername.value,
            "password": enteredPassword.value,
        };

        let res = null;
        try {
            let loginForm = document.getElementById("loginForm") as HTMLFormElement;
            res = await fetch(loginForm.action, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
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
        }
        else {
            const token = await res!.text();
            const userDetails = await getUserDetails(enteredUsername.value, "Bearer " + token,);
            if (token !== null && userDetails !== null) {
                setUserCredentials({
                    token: "Bearer " + token,
                    username: userDetails.user,
                    role: userDetails.role
                })
            }
        }
    }
}

export { loginUser };