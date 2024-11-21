import React from "react";
import { useNavigate } from "react-router-dom";

import CenteredLabel from "../UIElements/CenteredLabel";

import { ScreenProps } from "../Utils/Props";
import MenuGridLayout from "../UIElements/MenuGridLayout";

import icon from "../assets/react.svg";
import person from "../assets/person.svg"
import IconButton from "../UIElements/Buttons/IconButton";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";

export const HomeScreen: React.FC<ScreenProps> = ({
    userCredentials
}) => {
    useUserRedirect(userCredentials);
    
    const navigate = useNavigate();

    const elements = [
        { image: icon, navUrl: "/reservations", text: "Reservations" },
        { image: person, navUrl: "/guests", text: "Guests" },
        { image: icon, navUrl: "/rooms", text: "Rooms"},
        // {image: icon, navUrl: "/change-password",           text: "Change password"},
        // {image: icon, navUrl: "/user-creation",             text: "Create new user"},
        // {image: icon, navUrl: "/create-guest",              text: "Create guests"},
        // {image: icon, navUrl: "/add-reservation",           text: "Add reservation to guest"},
        // {image: icon, navUrl: "/create-task",               text: "Create tasks"},
        // {image: icon, navUrl: "/update-task",               text: "Update tasks"},
        // {image: icon, navUrl: "/remove-task",               text: "Remove tasks"},
        // {image: icon, navUrl: "/search-task-by-id",         text: "Search task by Id"},
        // {image: icon, navUrl: "/search-task-by-department", text: "Search task by department"},
        // {image: icon, navUrl: "/create-reservation",        text: "Create reservation"},
        // {image: icon, navUrl: "/cancel-reservation",        text: "Cancel reservation"},
        // {image: icon, navUrl: "/add-nights",                text: "Add nights"},
        // {image: icon, navUrl: "/remove-nights",             text: "Remove nights"},
        // {image: icon, navUrl: "/add-extra",                 text: "Add Extra"},
        // {image: icon, navUrl: "/remove-extra",              text: "Remove extra"},
        // {image: icon, navUrl: "/update-extra",              text: "Update extra"},
        // {image: icon, navUrl: "/search-reservation",        text: "Search reservation"},
        // {image: icon, navUrl: "/update-reservation",        text: "Update reservation"},

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
                    iconUrl={icon}
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
                    iconUrl={icon}
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
