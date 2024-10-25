import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export function RoomTypeScreen(props: {
    userCredentials: UserCredentials,
}) {
    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.role !== "Admin") {
            navigate("/login");
        }
    }, [props.userCredentials, navigate]);
    return <h1>room type screen</h1>
}