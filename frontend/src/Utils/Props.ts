import { UserCredentials } from "../APIRequests/ServerData";
import { ReactSetStateDispatch } from "./Types";

export interface ScreenProps {
    userCredentials: UserCredentials;
    setUserCredentials: ReactSetStateDispatch<UserCredentials>;
    setShowConnectionErrorMessage: ReactSetStateDispatch<boolean>;
}
