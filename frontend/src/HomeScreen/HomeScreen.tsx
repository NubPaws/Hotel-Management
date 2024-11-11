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
            <CenteredLabel>Home</CenteredLabel>
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
            <Link to="/create-guest">Create guests</Link>
            <br></br>
            <Link to="/update-guest">Update guests</Link>
            <br></br>
            <Link to="/add-reservation">Add reservation to guest</Link>
            <br></br>
            <Link to="/search-guest">Search guest</Link>
            <br></br>
            <Link to="/create-task">Create tasks</Link>
            <br></br>
            <Link to="/update-task">Update tasks</Link>
            <br></br>
            <Link to="/remove-task">Remove tasks</Link>
            <br></br>
            <Link to="/search-task-by-id">Search task by Id</Link>
            <br></br>
            <Link to="/search-task-by-department">Search task by department</Link>
            <br></br>
            <Link to="/create-reservation">Create reservation</Link>
            <br></br>
            <Link to="/cancel-reservation">Cancel reservation</Link>
            <br></br>
            <Link to="/add-nights">Add nights</Link>
        </>
    )
}


