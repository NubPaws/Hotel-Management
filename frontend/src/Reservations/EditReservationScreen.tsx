import { FC } from "react";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetchReservationInfo from "./Hooks/useFetchReservationInfo";

import "./EditReservationScreen.css";

const EditReservationScreen: FC<ScreenProps> = ({
	userCredentials,
}) => {
	useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
	const navigate = useNavigate();
	
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	
	if (!id) {
		return <p>Id should be provided to access this screen.</p>
	}
	
	const reservation = useFetchReservationInfo(userCredentials.token, Number(id));
	
	return <>{reservation?.comment}</>;
};

export default EditReservationScreen;
