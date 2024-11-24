import { FC, useState } from "react";
import { Extra } from "../../APIRequests/ServerData";
import "./ExtraEntry.css";
import Button from "../../UIElements/Buttons/Button";

type ExtraEntryProps = {
	extra: Extra;
	onRemove?: (id: number) => void;
};

const ExtraEntry: FC<ExtraEntryProps> = ({
	extra,
	onRemove = () => {},
}) => {
	const { extraId } = extra;
	
	const [item, setItem] = useState(extra.item);
	const [description, setDescription] = useState(extra.description);
	const [price, setPrice] = useState(extra.price);
	
	return (
	<div className="extra-entry-container">
		<div className="extra-entry-info">
			<div className="extra-entry-item">
				<strong>{item}</strong>
			</div>
			<div className="extra-entry-description">{description}</div>
			<div className="extra-entry-price">{price.toFixed(2)}</div>
		</div>
		<Button onClick={() => onRemove(extraId)}>X Remove</Button>
	</div>
	);
};

export default ExtraEntry;
