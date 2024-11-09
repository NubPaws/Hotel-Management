import { makeRequest, FetchError, RequestError } from "../Utils/Requester";
import { ReactSetStateDispatch } from "../Utils/Types";
import { validatePassword, validateUsername } from "./Validation";

export async function changePassword(
    userCredentials: UserCredentials,
    oldPass: string,
    newPass: string,
    confirmPass: string,
    setShowErrorMessage: ReactSetStateDispatch<boolean>,
    setShowSuccessMessage: ReactSetStateDispatch<boolean>,
    setShowConnectionErrorMessage: ReactSetStateDispatch<boolean>,
    setUserCredentials: ReactSetStateDispatch<UserCredentials>
): Promise<boolean> {
    if (!validatePassword(newPass) || !validateUsername(userCredentials.username) || newPass !== confirmPass) {
        setShowErrorMessage(true);
        return false;
    }
    
    const { token, username } = userCredentials;
    
    const data = {
        "username": username,
        "oldPassword": oldPass,
        "newPassword": newPass,
    }
    
    try {
        const res = await makeRequest("api/Users/change-password", "POST", "json", data, token);
        const newToken = await res.text();
        
        setShowSuccessMessage(true);
        setUserCredentials({ ...userCredentials, token: newToken });
        return true;
    } catch (error) {
        if (error instanceof FetchError) {
            setShowConnectionErrorMessage(true);
        }
        if (error instanceof RequestError) {
            setShowErrorMessage(true);
        }
        return false;
    }
}
