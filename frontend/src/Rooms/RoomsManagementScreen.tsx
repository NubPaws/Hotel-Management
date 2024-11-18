import IconButton from "../UIElements/Buttons/IconButton";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import { ScreenProps } from '../Utils/Props';
import myImage from "../assets/react.svg";
import CenteredLabel from "../UIElements/CenteredLabel";
import useAuthenticationRedirect from "../Utils/useAuthenticationRedirect";
import { useNavigate } from "react-router-dom";

const RoomsManagementScreen: React.FC<ScreenProps> = ({
	userCredentials,
}) => {
	useAuthenticationRedirect(userCredentials.username);
	
	const navigate = useNavigate();
	
	const buttons = [
		{image: myImage, navUrl: "add", text: "Add room"},
		{image: myImage, navUrl: "remove", text: "Remove room"},
		{image: myImage, navUrl: "information", text: "Query"},
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
				onClick={() => navigate(`/rooms-management/${btn.navUrl}`)}
			>
				{btn.text}
			</IconButton>
		);
	}
	
	return <>
		<CenteredLabel>Rooms Management</CenteredLabel>
		<MenuGridLayout shadow>
			{elements}
		</MenuGridLayout>
	</>;
}

export default RoomsManagementScreen;
