import { FC, useEffect, useState } from "react";
import "./BillingScreen.css";
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

const BillingScreen: FC<ScreenProps> = ({
	userCredentials
}) => {
	useUserRedirect(userCredentials);
	const navigate = useNavigate();
	
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	
	const reservation = id ? useFetchReservationInfo(userCredentials.token, Number(id)) : undefined;
	
	const [prices, setPrices] = useState<number[]>([]);
	const [extras, setExtras] = useState<Extra[]>([{
		extraId: 1,
		description: "This is a description",
		price: 1000,
		item: "Fancy item",
		reservationId: Number(id),
	}]);
	
	const [showModal] = useModalError();
	
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
				const response = await makeRequest(reqUrl, "GET", "json", reqData, userCredentials.token);
				
				const jsonResponse = await response.json();
				if (!response.ok) {
					showModal("Invalid respose received", JSON.stringify(jsonResponse));
					return;
				}
				
				// setExtras(jsonResponse as Extra[]);
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
	
	const onRemove = (extraId: number) => {
		
	};
	
	const nightsTotalPrice = prices.reduce((prev, curr) => prev + curr, 0);
	const extrasTotalPrice = extras.reduce((prev, curr) => prev + curr.price, 0);
	
	const totalPrice = nightsTotalPrice + extrasTotalPrice;
	
	return <div className="billing-screen-wrapper">
		<p>Total: {totalPrice} | Nights: {nightsTotalPrice} | Extras: {extrasTotalPrice}</p>
		<p>Night:</p>
		<div className="billing-prices-container">
			<DynamicList
				id="billing-prices-list"
				list={prices}
				label="Night"
				setList={setPrices}
				totalText="Total nights"
				addButtonText="Add night"
			/>
		</div>
		<div className="billing-extras-containers">
			<Button>Add extra</Button>
			{extras && extras.length > 0 && extras.map((extra, index) => (
				<ExtraEntry
					key={index}
					extra={extra}
					onRemove={onRemove}
				/>
			))}
		</div>
	</div>;
};

export default BillingScreen;
