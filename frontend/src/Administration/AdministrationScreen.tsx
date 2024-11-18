import { useNavigate } from "react-router-dom";
import { ScreenProps } from "../Utils/Props";
import CenteredLabel from "../UIElements/CenteredLabel";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import IconButton from "../UIElements/Buttons/IconButton";
import plus from "../assets/plus-icon.svg"

const AdministrationScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    const navigate = useNavigate();
    if (userCredentials.role !== "Admin") {
        navigate("/home");
    }


    return <>
        <CenteredLabel>Administration</CenteredLabel>
        <MenuGridLayout shadow>
            <IconButton
                iconUrl={plus}
                borderWidth="2px"
                borderRadius="5px"
                fontSize="18pt"
                onClick={() => navigate("/user-creation")}
            >
                Create new user
            </IconButton>

        </MenuGridLayout>
    </>;
}

export default AdministrationScreen;