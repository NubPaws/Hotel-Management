import { useNavigate } from "react-router-dom";
import { ScreenProps } from "../Utils/Props";
import CenteredLabel from "../UIElements/CenteredLabel";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import IconButton from "../UIElements/Buttons/IconButton";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";

import plusIcon from "../assets/plus-icon.svg"
import editIcon from "../assets/edit.svg";

const AdministrationScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials, ["Admin"]);
    
    const navigate = useNavigate();
    
    
    return <>
        <CenteredLabel>Administration</CenteredLabel>
        <MenuGridLayout shadow>
            <IconButton
                iconUrl={plusIcon}
                borderWidth="2px"
                borderRadius="5px"
                fontSize="18pt"
                onClick={() => navigate("/administration/create-user")}
            >
                New user
            </IconButton>
            <IconButton
                iconUrl={editIcon}
                borderWidth="2px"
                borderRadius="5px"
                fontSize="18pt"
                onClick={() => navigate("/administration/edit-user")}
            >
                Edit user
            </IconButton>
        </MenuGridLayout>
    </>;
}

export default AdministrationScreen;