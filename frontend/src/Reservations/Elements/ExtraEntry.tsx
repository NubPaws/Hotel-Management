import { FC, useState } from "react";
import { Extra } from "../../APIRequests/ServerData";
import "./ExtraEntry.css";

type ExtraEntryProps = {
	extra: Extra;
};

const ExtraEntry: FC<ExtraEntryProps> = ({
	extra
}) => {
	const [item, setItem] = useState(extra.item);
	const [description, setDescription] = useState(extra.description);
	const [price, setPrice] = useState(extra.price);
	
	return <>
	{item} : {description} : {price}
	</>;
};

export default ExtraEntry;
