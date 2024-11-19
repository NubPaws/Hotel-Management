
import { FC } from "react"
import "./RoomTypeEntry.css"
import Button from "../../UIElements/Buttons/Button";

type RoomTypeEntryProps = {
	entry: string;
	description: string;
	removeEntry?: (entry: string) => void;
};

const RoomTypeEntry: FC<RoomTypeEntryProps> = ({
	entry,
	description,
	removeEntry = () => {},
}) => {
	return <>
		<div className="room-type-entry" title={description}>
			<span className="entry-name">{entry}</span>
			<Button
				className="entry-remove-btn"
				onClick={() => removeEntry(entry)}
				borderWidth="0"
			>
				X
			</Button>
		</div>
	</>;
};

export default RoomTypeEntry;
