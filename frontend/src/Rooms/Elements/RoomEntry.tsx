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
		{roomId}
	</div>;
}


export default RoomEntry;
