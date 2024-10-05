import { Link } from "react-router-dom"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { NavigationBar } from "../UIElements/NavigationBar"

export function HomeScreen() {
    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Home" />
            <Link to="/change-password">Change Password</Link>
        </>
    )
}


