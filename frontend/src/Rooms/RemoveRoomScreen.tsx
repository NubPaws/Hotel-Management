import { FormEvent, useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import FormContainer from "../UIElements/Forms/FormContainer";
import { NavigationBar } from "../UIElements/NavigationBar";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { ScreenProps } from "../Utils/Props";
import Input, { InputType } from "../UIElements/Forms/Input";
import Modal, { ModalController } from "../UIElements/Modal";
import { makeRequest, RequestError } from "../APIRequests/APIRequests";

const RemoveRoomScreen: React.FC<ScreenProps> = ({
	userCredentials,
	setShowConnectionErrorMessage,
}) => {
	const [roomNumber, setRoomNumber] = useState(0);
	
	const [removeRoomMessage, setRemoveRoomMessage] = useState<ModalController | undefined>(undefined);
	
	useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
	
	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		
		if (roomNumber <= 0) {
			setRemoveRoomMessage({
				title: "Invalid room number",
				message: "Room must be positive."
			});
		}
		
		try {
			const res = await makeRequest(`api/Rooms/remove-room/${roomNumber}`, "POST", "text", "", userCredentials.token);
			
			handleResponse(res);
		} catch (error) {
			if (error instanceof TypeError) {
				setShowConnectionErrorMessage(true);
			}
			if (error instanceof RequestError) {
				setRemoveRoomMessage({
					title: "Request failed",
					message: "Revalidate your fields."
				});
			}
		}
	}
	
	const handleResponse = (res: Response) => {
		if (res.ok) {
			setRemoveRoomMessage({
				title: "Success",
				message: "Successfully removed the room.",
			});
		} else {
			setRemoveRoomMessage({
				title: "Failed",
				message: "Failed to remove room.",
			})
		}
	}
	
	return <>
		<NavigationBar />
		<CenteredLabel>Remove Room</CenteredLabel>
		<FormContainer onSubmit={handleSubmit}>
			<Input
				id="room-number-input"
				label="Room number"
				value={`${roomNumber}`}
				type={InputType.Number}
				placeholder="Enter room number"
				onChange={e => setRoomNumber(e.target.value ? parseInt(e.target.value) : 0)}
			/>
			<Input
				id="remove-room-btn"
				type={InputType.Submit}
				value="Remove"
			/>
		</FormContainer>
		
		{removeRoomMessage &&
            <Modal title={removeRoomMessage.title} onClose={() => setRemoveRoomMessage(undefined)}>
                {removeRoomMessage.message}
            </Modal>
        }
	</>;
};

export default RemoveRoomScreen;
