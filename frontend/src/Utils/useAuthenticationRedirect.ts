import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthenticationRedirect = (username: string) => {
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!username) {
			navigate("/login");
		}
	}, [username, navigate]);
}

export default useAuthenticationRedirect;
