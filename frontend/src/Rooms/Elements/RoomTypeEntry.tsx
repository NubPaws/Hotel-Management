
import { FC } from "react"
import "./RoomTypeEntry.css"

type RoomTypeEntryProps = {
	entry: string;
	removeEntry: (entry: string) => void;
};

const RoomTypeEntry: FC<RoomTypeEntryProps> = ({
	entry,
	removeEntry,
}) => {
	return <>
		<div className="room-type-entry">
			{entry}
		</div>
	</>;
};

export default RoomTypeEntry;
