import { UserCredentials } from "../APIRequests/ServerData";
import { ReactSetStateDispatch } from "./Types";

export interface AuthenticatedUserProps {
    userCredentials: UserCredentials,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ScreenProps {
    userCredentials: UserCredentials;
    setUserCredentials: ReactSetStateDispatch<UserCredentials>;
    setShowConnectionErrorMessage: ReactSetStateDispatch<boolean>;
}
