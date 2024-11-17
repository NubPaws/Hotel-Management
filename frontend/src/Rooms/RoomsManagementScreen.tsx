import IconButton from "../UIElements/Buttons/IconButton";
import { ScreenProps } from "../Utils/Props";
import myImage from "../assets/react.svg";

const RoomsManagementScreen: React.FC<ScreenProps> = () => {
	
	
	return <>
		<IconButton
			iconUrl={myImage}
			borderWidth="5px"
			borderRadius="8px"
			fontSize="18pt"
			onClick={() => alert("Button clicked!")}
		>Click me</IconButton>
	</>;
}

export default RoomsManagementScreen;
