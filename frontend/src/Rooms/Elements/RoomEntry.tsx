import { Room } from "../../APIRequests/ServerData";
import "./RoomEntry.css";

interface RoomEntryProps extends Room {}

const RoomEntry: React.FC<RoomEntryProps> = ({
	roomId,
	type,
	state,
	occupied,
	reservation
}) => {
	return <div className="room-entry">
		<div>{roomId}</div>
		<div>{type}</div>
		<div>{state}</div>
		<div>
			{occupied ? (
				"Link to reservation" + reservation
			) : (
				""
			)}
		</div>
	</div>;
}


export default RoomEntry;
