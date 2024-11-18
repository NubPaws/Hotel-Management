import { AuthenticatedUserProps } from "../Utils/Props";
import SearchReservationScreen from "./SearchReservationScreen";
import CenteredLabel from "../UIElements/CenteredLabel";
import plus from "../assets/plus-icon.svg";
import { useNavigate } from "react-router-dom";
import IconButton from "../UIElements/Buttons/IconButton";


const ReservationsManagementsScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const navigate = useNavigate();
    return <>
        <CenteredLabel>Reservations</CenteredLabel>
        <IconButton
            iconUrl={plus}
            borderWidth="2px"
            borderRadius="5px"
            fontSize="18pt"
            onClick={() => navigate("/create-reservation")}
        >
            New
        </IconButton>
        <SearchReservationScreen userCredentials={userCredentials} setShowConnectionErrorMessage={setShowConnectionErrorMessage} />
    </>;
}

export default ReservationsManagementsScreen;