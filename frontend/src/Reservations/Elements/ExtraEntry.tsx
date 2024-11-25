import { FC } from "react";
import { Extra } from "../../APIRequests/ServerData";
import IconButton from "../../UIElements/Buttons/IconButton";

import trashcanIcon from "../../assets/trashcan.svg";
import "./ExtraEntry.css";

type ExtraEntryProps = {
	extra: Extra;
	onRemove?: (id: number) => void;
};

const ExtraEntry: FC<ExtraEntryProps> = ({
	extra,
	onRemove = () => {},
}) => {
	const { extraId, item, description, price } = extra;
	
	return (
	<div className="extra-entry-container">
		<div className="extra-entry-info">
			<div className="extra-entry-item">
				<strong>{item}</strong>
			</div>
			<div className="extra-entry-description">{description}</div>
			<div className="extra-entry-price">{price.toFixed(2)}$</div>
		</div>
		<IconButton
			iconUrl={trashcanIcon}
			onClick={() => onRemove(extraId)}
			fontSize="18pt"
		/>
	</div>
	);
};

export default ExtraEntry;
