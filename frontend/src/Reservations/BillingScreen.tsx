import { FC, useEffect, useState } from "react";
import "./BillingScreen.css";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetchReservationInfo from "./Hooks/useFetchReservationInfo";

const BillingScreen: FC<ScreenProps> = ({
	userCredentials
}) => {
	useUserRedirect(userCredentials);
	const navigate = useNavigate();
	
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	
	const reservation = id ? useFetchReservationInfo(userCredentials.token, Number(id)) : undefined;
	
	const [extras, setExtras] = useState<number[]>([]);
	const [prices, setPrices] = useState<number[]>([]);
	
	useEffect(() => {
		if (!reservation) {
			return;
		}
		
		setPrices(reservation.prices);
		
		
	}, [reservation]);
	
	return <></>;
};

export default BillingScreen;
