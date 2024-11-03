import { getUserDetails } from "../APIRequests/APIRequests";
import { ReactSetStateDispatch } from "../Utils/Types";
import { validatePassword, validateUsername } from "./Validation";

export async function loginUser(
    username: string,
    password: string,
    setShowErrorMessage: ReactSetStateDispatch<boolean>,
    setShowConnectionErrorMessage: ReactSetStateDispatch<boolean>,
    setUserCredentials: ReactSetStateDispatch<UserCredentials>
) {
    if (true || (validateUsername(username) && validatePassword(password))) {
        const userData = { username, password };

        let res;
        try {
            res = await fetch("http://localhost:8000/api/Users/login", {
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

        if (res?.status !== 200) {
            setShowErrorMessage(true);
            return;
        }
        const token = await res.text();
        const userDetails = await getUserDetails(username, "Bearer " + token);
        if (token && userDetails) {
            setUserCredentials({
                token: "Bearer " + token,
                username: userDetails.user,
                role: userDetails.role,
                department: userDetails.department
            })
        }
    }
}
