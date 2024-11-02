import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"

import { CenteredLabel } from "../UIElements/CenteredLabel"
import { NavigationBar } from "../UIElements/NavigationBar"

export function HomeScreen(props: {
    userCredentials: UserCredentials,
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>
}) {
    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/login");
        }
    }, [props.userCredentials, props.setUserCredentials, navigate]);

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Home" />
            <Link to="/change-password">Change password</Link>
            <br></br>
            <Link to="/user-creation">Create new user</Link>
            <br></br>
            <Link to="/room-type">Create or delete room types</Link>
            <br></br>
            <Link to="/rooms">Create or delete rooms</Link>
            <br></br>
            <Link to="/room-update">Update room state</Link>
            <br></br>
            <Link to="/room-information">Search rooms</Link>
            <br></br>
            <Link to="/create-guest">Create Guests</Link>
            <br></br>
            <Link to="/update-guest">Update Guests</Link>
            <br></br>
            <Link to="/add-reservation">Add Reservation to guest</Link>
        </>
    )
}


