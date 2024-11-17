import { useNavigate } from "react-router-dom";
import IconButton from "../UIElements/Buttons/IconButton";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import { NavigationBar } from "../UIElements/NavigationBar";
import { ScreenProps } from '../Utils/Props';
import myImage from "../assets/react.svg";
import { useEffect } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";

const RoomsManagementScreen: React.FC<ScreenProps> = ({
	userCredentials,
}) => {
	const navigate = useNavigate();
	
	useEffect(() => {
		if (userCredentials.username === "") {
			navigate("/login");
		}
		
	}, [userCredentials, navigate]);
	
	const buttons = [
		{image: myImage, navUrl: "add", text: "Add room"},
		{image: myImage, navUrl: "remove", text: "Remove room"},
		{image: myImage, navUrl: "information", text: "Query"},
		{image: myImage, navUrl: "add", text: "Add room"},
		{image: myImage, navUrl: "add", text: "Add room"},
	];
	
	const elements = [];
	for (const btn of buttons) {
		elements.push(
			<IconButton
				iconUrl={btn.image}
				borderWidth="2px"
				borderRadius="5px"
				fontSize="18pt"
				onClick={() => navigate(`/rooms-mamangement/${btn.navUrl}`)}
			>
				{btn.text}
			</IconButton>
		);
	}
	
	return <>
		<NavigationBar />
		<CenteredLabel>Rooms Management</CenteredLabel>
		<MenuGridLayout>
			{elements}
		</MenuGridLayout>
	</>;
}

export default RoomsManagementScreen;
