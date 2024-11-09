import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import { Input, InputType } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { createUser } from "./UserCreation";
import { Modal } from "../UIElements/Modal";
import { NavigationBar } from "../UIElements/NavigationBar";
import { UserDepartmentRadioButton } from "./UserRadioButtons";

export function UserCreationScreen(props: {
    userCredentials: UserCredentials,
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showUserExistsErrorMessage, setShowUserExistsErrorMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.role !== "Admin") {
            navigate("/login");
        }
    }, [props.userCredentials, props.setUserCredentials, navigate]);

    return <>
        <NavigationBar></NavigationBar>
        <CenteredLabel>Create User</CenteredLabel>
        <form id="createUserForm" className="fieldsContainer" action="http://localhost:8000/api/Users/create">
            <Input
                id="username"
                label="Username"
                type={InputType.Text}
                placeholder="Username"
            />
            <span className="note">At least 4 characters long</span>
            <Input
                id="password"
                label="Password"
                type={InputType.Password}
                placeholder="Password"
            />
            <span className="note">At least 4 characters long</span>
            <Input
                id="confirmPassword"
                label="Confirm Password"
                type={InputType.Password}
                placeholder="Confirm Password"
            />
            <div className="userRoleContainer" >
                <p>Select user role:</p>
                <input type="radio" id="user" name="role" value="User"></input>
                <label htmlFor="user">User</label>
                <br />
                <input type="radio" id="admin" name="role" value="Admin"></input>
                <label htmlFor="admin">Admin</label>
                <div id="userRoleErrorMessage"></div>
            </div>
            <UserDepartmentRadioButton />

            <Button
                className="fieldLabel"
                backgroundColor="white"
                textColor="black"
                borderWidth="1px"
                onClick={(event) => createUser(event,
                                                props.userCredentials.token,
                                                setShowErrorMessage,
                                                props.setShowConnectionErrorMessage,
                                                setShowSuccessMessage,
                                                setShowUserExistsErrorMessage)}>
                Create User
            </Button>
        </form>
        {showErrorMessage && (
            <Modal title="User Creation Failed" onClose={() => { setShowErrorMessage(false) }}>
                Failed to create user
            </Modal>
        )}
        {showSuccessMessage && (
            <Modal title="User Creation Success" onClose={() => { setShowSuccessMessage(false) }}>
                Succeeded in creating a new user
            </Modal>
        )}
        {showUserExistsErrorMessage && (
            <Modal title="User Already Exists" onClose={() => { setShowUserExistsErrorMessage(false) }}>
                User already exists
            </Modal>
        )}
    </>;
}