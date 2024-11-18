import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Department, UserCredentials, UserRole } from "../APIRequests/ServerData";

// TODO: Use React context to make a global item that we can display as an error.

/**
 * Redirects the user properly.
 * 
 * @param user The user credentials object.
 * @param allowedRoles The roles that are allowed as an array, or undefined for no checks.
 * @param allowedDepartments The departments that are allowed as an array, or undefined for no checks.
 */
const useUserRedirect = (
	user: UserCredentials,
	allowedRoles?: UserRole[],
	allowedDepartments?: Department[]
) => {
	const navigate = useNavigate();
	
	useEffect(() => {
		const validRole = allowedRoles && !allowedRoles.includes(user.role);
		const validDepartment = allowedDepartments && !allowedDepartments.includes(user.department);
		if (validRole && validDepartment) {
			navigate("/home");
		}
		
		if (!user.username) {
			navigate("/login");
		}
	}, [user, allowedDepartments, allowedDepartments, navigate]);
}

export default useUserRedirect;
