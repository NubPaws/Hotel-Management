import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../APIRequests/ServerData";

const useAdminRedirect = (role: UserRole) => {
	const navigate = useNavigate();
	
	useEffect(() => {
		if (role !== "Admin") {
			navigate("/home");
		}
	}, [role, navigate]);
}

export default useAdminRedirect;
