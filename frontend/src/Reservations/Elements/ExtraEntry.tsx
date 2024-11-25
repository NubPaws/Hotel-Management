import { FC, useState } from "react";
import { Extra } from "../../APIRequests/ServerData";
import IconButton from "../../UIElements/Buttons/IconButton";
import InputModal, { InputModalField } from '../../UIElements/InputModal';
import { InputType } from "../../UIElements/Forms/Input";

import trashcanIcon from "../../assets/trashcan.svg";
import editIcon from "../../assets/edit.svg";
import "./ExtraEntry.css";

type ExtraEntryProps = {
	extra: Extra;
	onRemove?: (id: number) => void;
	onEdit?: (extra: Extra) => void;
};

const ExtraEntry: FC<ExtraEntryProps> = ({
	extra,
	onRemove = () => {},
	onEdit = () => {},
}) => {
	const { extraId, item, description, price } = extra;
	const [editExtraFields, setEditExtraFields] = useState<InputModalField[] | undefined>(undefined);
	
	const hideEditExtraModal = () => setEditExtraFields(undefined);
	
	const showEditExtraModal = () => setEditExtraFields([
		{ name: "item", label: "Item", type: InputType.Text, placeholder: extra.item },
		{ name: "description", label: "Description", type: InputType.Text, placeholder: extra.description },
		{ name: "price", label: "Price", type: InputType.Number, placeholder: `${extra.price}` },
	]);
	
	const onConfirm = (formData: Record<string, any>) => {
		const item = formData["item"] ? formData["item"] as string : extra.item;
		const description = formData["description"] ? formData["description"] as string : extra.description;
		const price = formData["price"] ? formData["price"] as number : extra.price;
		
		onEdit({...extra, item, description, price});
		hideEditExtraModal();
	}
	
	return <>
	<div className="extra-entry-container">
		<div className="extra-entry-info">
			<div className="extra-entry-item">
				<strong>{item}</strong>
			</div>
			<div className="extra-entry-description">{description}</div>
			<div className="extra-entry-price">{price.toFixed(2)}$</div>
		</div>
		<div className="extra-entry-controls">
			<IconButton
				iconUrl={editIcon}
				onClick={showEditExtraModal}
				fontSize="18pt"
			/>
			<IconButton
				iconUrl={trashcanIcon}
				onClick={() => onRemove(extraId)}
				fontSize="18pt"
			/>
		</div>
	</div>
	{editExtraFields && (
		<InputModal
			fields={editExtraFields}
			title={`Edit extra #${extraId}`}
			onConfirm={onConfirm}
			onCancel={hideEditExtraModal}
		/>
	)}
	</>;
};

export default ExtraEntry;
