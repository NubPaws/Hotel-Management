import { useState } from "react";
import { Room } from "../../APIRequests/ServerData";
import Button from "../../UIElements/Buttons/Button";
import Modal from "../../UIElements/Modal";
import "./RoomEntry.css";

interface RoomEntryProps extends Room {
	removeRoom: (roomId: number) => void;
}

const RoomEntry: React.FC<RoomEntryProps> = ({
	roomId,
	type,
	state,
	occupied,
	reservation,
	removeRoom,
}) => {
	const [showModal, setShowModal] = useState(false);
	
	return (
	<>
		<div className="room-entry">
			<div>{roomId}</div>
			<div>{type}</div>
			<div>{state}</div>
			<div>
				{occupied ? `Reservation ${reservation}` : ""}
			</div>
			<div>
				<Button onClick={() => setShowModal(true)}>-</Button>
			</div>
		</div>
		{showModal && (
			<Modal
				title="Are you sure?"
				onClose={() => setShowModal(false)}
				onAccept={() => { setShowModal(false); removeRoom(roomId); }}>
				Are you sure you want to remove room {roomId}?
			</Modal>
		)}
	</>
	);
}


export default RoomEntry;
