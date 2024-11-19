import IconButton from "../UIElements/Buttons/IconButton";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import { NavigationBar } from "../UIElements/NavigationBar";
import { ScreenProps } from '../Utils/Props';
import myImage from "../assets/react.svg";
import CenteredLabel from "../UIElements/CenteredLabel";
import { useNavigate } from "react-router-dom";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";

const RoomsManagementScreen: React.FC<ScreenProps> = ({
	userCredentials,
}) => {
	useUserRedirect(userCredentials);
	
	const navigate = useNavigate();
	
	const buttons = [
		{image: myImage, navUrl: "add", text: "Add"},
		{image: myImage, navUrl: "remove", text: "Remove"},
		{image: myImage, navUrl: "information", text: "Query"},
		{image: myImage, navUrl: "update", text: "Update"}
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
		<NavigationBar />
		<CenteredLabel>Rooms Management</CenteredLabel>
		<MenuGridLayout shadow>
			{elements}
		</MenuGridLayout>
	</>;
}

export default RoomsManagementScreen;
