import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { UserCredentials } from "../APIRequests/ServerData";
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
): Promise<void> {
    if (!validatePassword(newPass) || !validateUsername(userCredentials.username) || newPass !== confirmPass) {
        setShowErrorMessage(true);
        return;
    }
    
    const { token, username } = userCredentials;
    
    const data = {
        "username": username,
        "oldPassword": oldPass,
        "newPassword": newPass,
    }
    
    try {
        const res = await makeRequest("api/Users/change-password", "POST", "json", data, token);
        if (res.status !== 200) {
            throw new RequestError("Invalid request made to the server");
        }
        const newToken = await res.text();
        
        setShowSuccessMessage(true);
        setUserCredentials({ ...userCredentials, token: `Bearer ${newToken}` });
    } catch (error) {
        if (error instanceof FetchError) {
            setShowConnectionErrorMessage(true);
        }
        if (error instanceof RequestError) {
            setShowErrorMessage(true);
        }
    }
}
