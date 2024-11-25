import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenProps } from "../Utils/Props";

const EditUserScreen: React.FC<ScreenProps> = ({
    userCredentials
}) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (userCredentials.role !== "Admin") {
            navigate("/login");
        }
    }, [userCredentials, navigate]);
    
    return <>
    </>;
}

export default EditUserScreen;
