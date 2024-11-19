import IconButton from "../UIElements/Buttons/IconButton";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import { ScreenProps } from '../Utils/Props';
import CenteredLabel from "../UIElements/CenteredLabel";
import { useNavigate } from "react-router-dom";
import plus from "../assets/plus-icon.svg"
import search from "../assets/search-plus.svg"
import icon from "../assets/react.svg";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";

const GuestsManagementScreen: React.FC<ScreenProps> = ({
	userCredentials,
}) => {
    useUserRedirect(userCredentials);
    
    const navigate = useNavigate();
    const buttons = [
        {image: plus, navUrl: "/create-guest",     text: "Create guests"},
        {image: icon, navUrl: "/update-guest",     text: "Update guests"},
        {image: plus, navUrl: "/add-reservation",  text: "Add reservation to guest"},
    ];

    const elements = [];
	for (const btn of buttons) {
		elements.push(
			<IconButton
				key={btn.navUrl}
				iconUrl={btn.image}
				borderWidth="2px"
				borderRadius="5px"
				fontSize="18pt"
				onClick={() => navigate(`/${btn.navUrl}`)}
			>
				{btn.text}
			</IconButton>
		);
	}
	
	return <>
		<CenteredLabel>Guests Management</CenteredLabel>
		<MenuGridLayout shadow>
            <IconButton
                iconUrl={search}
                borderWidth="2px"
                borderRadius="5px"
                fontSize="18pt"
                onClick={() => navigate("/search-guest")}
                >
                    Search Guest
                </IconButton>
            {(userCredentials.department === "FrontDesk" || userCredentials.role === "Admin" )&& (
                elements
            )}
		</MenuGridLayout>
	</>;
}

export default GuestsManagementScreen;