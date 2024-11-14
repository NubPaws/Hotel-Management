import { NavigateFunction } from "react-router-dom";

const checkExtraPermissions = (role: string, department: string, navigate: NavigateFunction) => {
    if (role === "") {
        navigate("/login");
    }
    if (role !== "Admin" && department !== "FrontDesk" && department !== "FoodAndBeverage") {
        navigate("/home");
    }
};

const checkAdminOrFrontDesk = (role: string, department: string, navigate: NavigateFunction) => {
    if (role === "") {
        navigate("/login");
    }
    if (role !== "Admin" && department !== "FrontDesk") {
        navigate("/home");
    }
};

export { checkExtraPermissions, checkAdminOrFrontDesk };