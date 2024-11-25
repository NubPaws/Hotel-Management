import { useNavigate } from "react-router-dom";
import Button from "./Buttons/Button";
import "./NavigationBar.css"
import { ReactSetStateDispatch } from "../Utils/Types";
import { UserCredentials } from "../APIRequests/ServerData";
import Colors from "../styles/Colors";

import backIcon from "../assets/back.svg";
import "./NavigationBar.css"
import IconButton from "./Buttons/IconButton";

interface NavigationProps {
    setUserCredentials: ReactSetStateDispatch<UserCredentials>;
}

export const NavigationBar: React.FC<NavigationProps> = ({
    setUserCredentials
}) => {
    const navigate = useNavigate();

    return <>
    <div className="navigation-container">
        <div className="navigation-bar-left-side">
            <IconButton
                iconUrl={backIcon}
                borderWidth="0px"
                fontSize="20pt"
                onClick={() => navigate(-1)}
            />
            <Button
                className="navigation-button"
                onClick={() => navigate("/home")}
                borderWidth="3px"
            >
                Home
            </Button>
        </div>
        <div className="nagivation-bar-right-side">
            <Button
                className="navigation-button"
                onClick={() => navigate("/change-password")}
                borderWidth="3px"
            >
                Settings
            </Button>
            <Button
                className="navigation-button"
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
    </div>
    <hr />
    </>;
}