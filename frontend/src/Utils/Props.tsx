export interface AuthenticatedUserProps {
    userCredentials: UserCredentials,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}