import { getUserDetails } from "../APIRequests/APIRequests";
import { ReactSetStateDispatch } from "../Utils/Types";
import { validatePassword, validateUsername } from "./Validation";

class InvalidRequestError extends Error {}
class UserCredentialsFetchError extends Error {}

async function fetchUserCredentials(username: string, password: string) {
    const userData = { username, password };
    
    const res = await fetch("http://localhost:8000/api/Users/login", {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': JSON.stringify(userData)
    });

    if (res?.status !== 200) {
        throw new InvalidRequestError();
    }
    const token = await res.text();
    const userDetails = await getUserDetails(username, "Bearer " + token);
    if (!token && !userDetails) {
        throw new UserCredentialsFetchError();
    }
    
    return {
        token: "Bearer " + token,
        username: userDetails.user,
        role: userDetails.role,
        department: userDetails.department
    } as UserCredentials;
}

export async function loginUser(
    username: string,
    password: string,
    setShowErrorMessage: ReactSetStateDispatch<boolean>,
    setShowConnectionErrorMessage: ReactSetStateDispatch<boolean>,
    setUserCredentials: ReactSetStateDispatch<UserCredentials>
) {
    if (!validateUsername(username) || !validatePassword(password)) {
        setShowErrorMessage(true);
        return;
    }
    
    try {
        const credentials = await fetchUserCredentials(username, password);
        setUserCredentials(credentials);
    } catch (error: any) {
        if (error instanceof TypeError) {
            setShowConnectionErrorMessage(true);
        }
        if (error instanceof InvalidRequestError) {
            setShowErrorMessage(true);
        }
        if (error instanceof UserCredentialsFetchError) {
            setShowErrorMessage(true);
        }
    }
}
