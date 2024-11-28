import React from "react";
import { useNavigate } from "react-router-dom";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import CenteredLabel from "../UIElements/CenteredLabel";
import { ScreenProps } from "../Utils/Props";
import MenuGridLayout from "../UIElements/MenuGridLayout";

import person from "../assets/person.svg"
import IconButton from "../UIElements/Buttons/IconButton";
import tasksIcon from "../assets/tasks.svg";
import adminIcon from "../assets/admin.svg";
import reservationIcon from "../assets/reservation.svg";
import roomIcon from "../assets/room.svg";
import backOfficeIcon from "../assets/back-office.svg";

export const HomeScreen: React.FC<ScreenProps> = ({
    userCredentials
}) => {
    useUserRedirect(userCredentials);
    
    const navigate = useNavigate();

    const elements = [
        { image: reservationIcon, navUrl: "/reservations", text: "Reservations" },
        { image: person, navUrl: "/guests", text: "Guests" },
        { image: roomIcon, navUrl: "/rooms", text: "Rooms"},
        { image: tasksIcon, navUrl: "/tasks", text: "Tasks"},
    ];

    const buttons = [];
    for (const btn of elements) {
        buttons.push(
            <IconButton
                key={btn.navUrl}
                iconUrl={btn.image}
                borderWidth="2px"
                borderRadius="5px"
                fontSize="18pt"
                onClick={() => navigate(btn.navUrl)}
            >
                {btn.text}
            </IconButton>);
    }

    return <>
        <CenteredLabel>Home</CenteredLabel>
        <MenuGridLayout shadow>
            {buttons}
            {(userCredentials.department === "FrontDesk" || userCredentials.role === "Admin") && (
                <IconButton
                    iconUrl={backOfficeIcon}
                    borderWidth="2px"
                    borderRadius="5px"
                    fontSize="18pt"
                    onClick={() => navigate("/back-office")}
                >
                    Back Office
                </IconButton>
            )}
            {(userCredentials.role === "Admin") && (
                <IconButton
                    iconUrl={adminIcon}
                    borderWidth="2px"
                    borderRadius="5px"
                    fontSize="18pt"
                    onClick={() => navigate("/administration")}
                >
                    Administration
                </IconButton>
            )}
        </MenuGridLayout>
    </>;
}
