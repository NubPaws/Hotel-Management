import { FC, MouseEvent, useEffect, useState } from "react";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetchReservationInfo from "./Hooks/useFetchReservationInfo";
import { Extra } from "../APIRequests/ServerData";
import { makeRequest, RequestError } from "../APIRequests/APIRequests";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import DynamicList from "../UIElements/DynamicList";
import ExtraEntry from "./Elements/ExtraEntry";
import Button from "../UIElements/Buttons/Button";
import IconButton from "../UIElements/Buttons/IconButton";
import InputModal, { InputModalField } from "../UIElements/InputModal";
import { InputType } from "../UIElements/Forms/Input";
import usePopup from "../Utils/Contexts/PopupContext";

import backIcon from "../assets/back.svg";
import saveIcon from "../assets/save.svg";
import "./BillingScreen.css";

const BillingScreen: FC<ScreenProps> = ({
	userCredentials
}) => {
	useUserRedirect(userCredentials);
	const navigate = useNavigate();
	
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	
	const reservation = id ? useFetchReservationInfo(userCredentials.token, Number(id)) : undefined;
	
	const [prices, setPrices] = useState<number[]>([]);
	const [extras, setExtras] = useState<Extra[]>([]);
	
	const [addExtraFields, setAddExtraFields] = useState<InputModalField[] | undefined>(undefined);
	
	const [showModal] = useModalError();
	const [_, showInfoPopup] = usePopup();
	
	const nightsTotalPrice = prices.reduce((prev, curr) => prev + curr, 0);
	const extrasTotalPrice = extras.reduce((prev, curr) => prev + curr.price, 0);
	
	const totalPrice = nightsTotalPrice + extrasTotalPrice;
	
	useEffect(() => {
		if (!reservation) {
			return;
		}
		
		setPrices(reservation.prices);
		
		const getExtras = async () => {
			if (reservation.extras.length === 0) {
				return;
			}
			
			const reqData = {
				extraIds: reservation.extras,
			};
			console.log(JSON.stringify(reqData));
			const reqUrl = "api/Extras/get-all";
			
			try {
				const response = await makeRequest(reqUrl, "POST", "json", JSON.stringify(reqData), userCredentials.token);
				
				const jsonResponse = await response.json();
				if (!response.ok) {
					showModal("Invalid respose received", JSON.stringify(jsonResponse));
					return;
				}
				
				setExtras(jsonResponse as Extra[]);
			} catch (error: any) {
				if (error instanceof TypeError) {
					showModal("Conection error", error.message);
				}
				if (error instanceof RequestError) {
					showModal("Invalid request was sent", error.message);
				}
			}
		}
		
		getExtras();
	}, [reservation]);
	
	const onSave = (event: MouseEvent<HTMLButtonElement>) => {
		// TODO: this function
	};
	
	const onRemove = async (extraId: number) => {
		const url = "api/Reservations/remove-extra";
		const body = {
			reservationId: id,
			extraId: extraId,
		}
		
		try {
			const res = await makeRequest(url, "POST", "json", body, userCredentials.token);
			
			if (!res.ok) {
				showModal("Invalid request made", await res.json());
				return;
			}
			
			setExtras(prev => prev.filter(value => value.extraId !== extraId));
			showInfoPopup(`Successfully deleted extra ${extraId} from reservation ${id}`);
		} catch (error: any) {
			showModal("Request error has occured", error.message);
		}
	};
	
	const onEdit = async (extra: Extra) => {
		const url = "api/Extras/update";
		
		try {
			const res = await makeRequest(url, "POST", "json", extra, userCredentials.token);
			
			if (!res.ok) {
				showModal("Invalid input has been sent", await res.json());
				return;
			}
			
			const newExtra = await res.json() as Extra;
			
			setExtras(prev => prev.map(value => value.extraId === newExtra.extraId ? newExtra : value));
			showInfoPopup("Extra updated successfully");
		} catch (error: any) {
			showModal("Request error has occured", error.message);
		}
	}
	
	const showAddExtraInputModal = () => setAddExtraFields([
		{ name: "item", label: "Item name", type: InputType.Text, placeholder: "Item name..." },
		{ name: "description", label: "Description", type: InputType.Text, placeholder: "Describe the item..." },
		{ name: "price", label: "Price", type: InputType.Number, placeholder: "0" },
	]);
	
	const hideAddExtraInputModal = () => setAddExtraFields(undefined);
	
	const handleAddExtra = async (formData: Record<string, any>) => {
		hideAddExtraInputModal();
		const item = formData["item"] as string;
		const description = formData["description"] ? formData["description"] as string : "";
		const price = formData["price"] as number;
		
		// Validate input.
		if (!item || !price) {
			showModal("Invalid input", "Must provide item name and price.");
		}
		
		// Prepare the packets.
		const url = "api/Reservations/add-extra";
		const body = {
			reservationId: id,
			item: item,
			price: price,
			description: description,
		};
		
		// Make the request.
		try {
			const res = await makeRequest(url, "POST", "json", body, userCredentials.token);
			
			if (!res.ok) {
				showModal("Failed to add extra", await res.json());
			}
			
			const extra = await res.json() as Extra;
			
			setExtras(prev => [...prev, extra])
			showInfoPopup("Successfully added extra");
		} catch (error: any) {
			showModal("Error occured", error.message)
		}
	}
	
	// TODO: Cap the height of the reservations.
	return <>
	<div className="billing-screen-wrapper">
		<div className="billing-screen-controls">
			<IconButton
				onClick={() => navigate(-1)}
				iconUrl={backIcon}
				fontSize="16pt"
			/>
			<span>Total: {totalPrice.toFixed(2)}$</span>
			<IconButton
				onClick={onSave}
				iconUrl={saveIcon}
				fontSize="16pt"
			>Save</IconButton>
		</div>
		
		<div className="billing-prices-container">
			<p className="billing-prices-label">Nights: {nightsTotalPrice.toFixed(2)}$</p>
			<DynamicList
				id="billing-prices-nights-list"
				list={prices}
				label="Night"
				setList={setPrices}
				totalText="Total nights"
				addButtonText="Add night"
			/>
		</div>
		
		<div className="billing-prices-container">
			<p className="billing-prices-label">Extras: {extrasTotalPrice.toFixed(2)}$</p>
			<div className="billing-add-extra">
				<Button onClick={showAddExtraInputModal}>Add extra</Button>
			</div>
			{extras && extras.length > 0 && extras.map((extra, index) => (
				<ExtraEntry
					key={index}
					extra={extra}
					onEdit={onEdit}
					onRemove={onRemove}
				/>
			))}
		</div>
	</div>
	{addExtraFields && (
		<InputModal
			title="Add Extra"
			fields={addExtraFields}
			onConfirm={handleAddExtra}
			onCancel={hideAddExtraInputModal}
		/>
	)}
	</>;
};

export default BillingScreen;
