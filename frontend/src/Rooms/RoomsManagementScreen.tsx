import IconButton from "../UIElements/Buttons/IconButton";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import { NavigationBar } from "../UIElements/NavigationBar";
import { ScreenProps } from "../Utils/Props";
import myImage from "../assets/react.svg";

const RoomsManagementScreen: React.FC<ScreenProps> = () => {
	
	
	return <>
		<NavigationBar />
		<MenuGridLayout>
			<IconButton
				iconUrl={myImage}
				borderWidth="2px"
				borderRadius="5px"
				fontSize="18pt"
				onClick={() => alert("Button clicked!")}
			>Add room</IconButton>
			
			<IconButton
				iconUrl={myImage}
				borderWidth="2px"
				borderRadius="5px"
				fontSize="18pt"
				onClick={() => alert("Button clicked!")}
			>Manage room</IconButton>
			
			<IconButton
				iconUrl={myImage}
				borderWidth="2px"
				borderRadius="5px"
				fontSize="18pt"
				onClick={() => alert("Button clicked!")}
			>Something else</IconButton>
			
			<IconButton
				iconUrl={myImage}
				borderWidth="2px"
				borderRadius="5px"
				fontSize="18pt"
				onClick={() => alert("Button clicked!")}
			>Click me</IconButton>
			
			<IconButton
				iconUrl={myImage}
				borderWidth="2px"
				borderRadius="5px"
				fontSize="18pt"
				onClick={() => alert("Button clicked!")}
			>Click me</IconButton>
			
			<IconButton
				iconUrl={myImage}
				borderWidth="2px"
				borderRadius="5px"
				fontSize="18pt"
				onClick={() => alert("Button clicked!")}
			>Click me</IconButton>
		</MenuGridLayout>
	</>;
}

export default RoomsManagementScreen;
