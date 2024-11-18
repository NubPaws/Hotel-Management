import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../backend/src/models/User";

const useAdminRedirect = (role: UserRole) => {
	const navigate = useNavigate();
	
	useEffect(() => {
		if (role !== UserRole.Admin) {
			navigate("/home");
		}
	}, [role, navigate]);
}

export default useAdminRedirect;
