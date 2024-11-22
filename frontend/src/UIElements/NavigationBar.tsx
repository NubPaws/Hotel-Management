import { useNavigate } from "react-router-dom";
import Button from "./Buttons/Button";
import "./NavigationBar.css"

import Colors from "../styles/Colors";
import "./NavigationBar.css"
import { ReactSetStateDispatch } from "../Utils/Types";
import { UserCredentials } from "../APIRequests/ServerData";

interface NavigationProps {
    setUserCredentials: ReactSetStateDispatch<UserCredentials>;
}

export const NavigationBar: React.FC<NavigationProps> = ({
    setUserCredentials
}) => {
    const navigate = useNavigate();

    return <>
        <div className="navigation-container">
            <Button
                className="navigation-button home-button"
                onClick={() => navigate("/home")}
                borderWidth="3px"
            >
                Home
            </Button>
            <Button
                className="navigation-button settings-button"
                onClick={() => navigate("/change-password")}
                borderWidth="3px"
            >
                Settings
            </Button>
            <Button
                className="navigation-button logout-button"
                backgroundColor={Colors.red}
                onClick={() => {
                    setUserCredentials({
                        token: "",
                        username: "",
                        role: "",
                        department: ""
                    });
                    navigate("/login");
                }}
                borderWidth="3px"
            >
                Logout
            </Button>
        </div>
        <hr />
    </>;
}