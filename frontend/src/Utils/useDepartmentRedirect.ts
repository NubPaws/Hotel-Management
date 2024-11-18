import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Department } from "../APIRequests/ServerData";

const useDepartmentRedirect = (check: Department, needsToBe: Department) => {
	const navigate = useNavigate();
	
	useEffect(() => {
		if (check !== needsToBe) {
			navigate("/home");
		}
	}, [check, navigate]);
}

export default useDepartmentRedirect;
