import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Buttons/Button";
import "./NavigationBar.css"
import Colors from "../styles/Colors";
import IconButton from "./Buttons/IconButton";
import { makeRequest } from "../APIRequests/APIRequests";
import { ScreenProps } from "../Utils/Props";
import { SystemInformation } from "../APIRequests/ServerData";

import backIcon from "../assets/back.svg";
import "./NavigationBar.css";

const NavigationBar: React.FC<ScreenProps> = ({
    userCredentials,
    setUserCredentials,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [sysInfo, setSysInfo] = useState<SystemInformation | undefined>(undefined);
    
    useEffect(() => {
        const fetchSystemInfo = async () => {
            const url = "api/BackOffice/get-system-information";
            try {
                const res = await makeRequest(url, "GET", "text", "", userCredentials.token);
                if (!res.ok) {
                    return;
                }
                
                setSysInfo(await res.json() as SystemInformation);
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchSystemInfo();
        
        const intervalId = setInterval(fetchSystemInfo, 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, []);
    
    return <>
    <div className="navigation-container">
        <div className="navigation-bar-left-side">
            {location.pathname !== "/home" && (
                <IconButton
                    iconUrl={backIcon}
                    borderWidth="0px"
                    fontSize="20pt"
                    onClick={() => navigate(-1)}
                />
            )}
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
    {sysInfo && sysInfo.systemDate.length >= 3 && (
        <div className="system-information">
            <p>{sysInfo.systemDate[0]}/{sysInfo.systemDate[1]}/{sysInfo.systemDate[2]}</p>
            <p>Occupancy: {sysInfo.occupancy.occupancy * 100}%</p>
            <p>Arrivals: {sysInfo.occupancy.arrivals}</p>
            <p>Departures: {sysInfo.occupancy.departures}</p>
        </div>
    )}
    <hr />
    </>;
}

export default NavigationBar;
