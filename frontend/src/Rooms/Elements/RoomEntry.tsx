import { useState } from "react";
import { Room } from "../../APIRequests/ServerData";
import Button from "../../UIElements/Buttons/Button";
import Modal from "../../UIElements/Modal";
import Dropdown from "../../UIElements/Dropdown";

import "./RoomEntry.css";

const ROOM_OPTIONS = ["Clean", "Inspected", "Dirty", "OutOfOrder"];

interface RoomEntryProps extends Room {
	changeState: (roomId: number, newState: string) => void;
	removeRoom: (roomId: number) => void;
}

const RoomEntry: React.FC<RoomEntryProps> = ({
	roomId,
	type,
	state,
	occupied,
	reservation,
	changeState,
	removeRoom,
}) => {
	const [showRemoveModal, setShowRemoveModal] = useState(false);
	
	return (
	<>
		<div className="room-entry">
			<div className="room-entry-id">{roomId}</div>
			<div>{type}</div>
			<div>
				<Dropdown
					options={ROOM_OPTIONS}
					defaultOption={state}
					onChange={(newState) => changeState(roomId, newState)} />
			</div>
			<div>
				{occupied ? `Reservation ${reservation}` : ""}
			</div>
			<div>
				<Button onClick={() => setShowRemoveModal(true)}>-</Button>
			</div>
		</div>
		
		{showRemoveModal && (
			<Modal
				title="Are you sure?"
				onClose={() => setShowRemoveModal(false)}
				onAccept={() => { setShowRemoveModal(false); removeRoom(roomId); }}>
				Are you sure you want to remove room {roomId}?
			</Modal>
		)}
	</>
	);
}


export default RoomEntry;
