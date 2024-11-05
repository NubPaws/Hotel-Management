import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import { Input } from "../UIElements/Input"
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

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Create User" />
            <form id="createUserForm" className="fieldsContainer" action="http://localhost:8000/api/Users/create">
                <Input id="username" className="field" type="text" name="username"
                    placeholder="Username" errorMessageId="usernameErrorMessage">
                    Username<br/>
                    <span className="note">At least 4 characters long</span>
                </Input>
                <Input id="password" className="field" type="password" name="password"
                    placeholder="Password" errorMessageId="passwordErrorMessage">
                    Password<br/>
                </Input>
                <span className="note">At least 4 characters long</span>
                <Input id="confirmPassword" className="field" type="password" name="confirmPassword"
                    placeholder="Confirm Password" errorMessageId="confirmPasswordErrorMessage">
                    Confirm Password
                </Input>
                <div className="userRoleContainer" >
                    <p>Select user role:</p>
                    <input type="radio" id="user" name="role" value="User"></input>
                    <label htmlFor="user">User</label>
                    <br />
                    <input type="radio" id="admin" name="role" value="Admin"></input>
                    <label htmlFor="admin">Admin</label>
                    <div id="userRoleErrorMessage"></div>
                </div>
                <UserDepartmentRadioButton></UserDepartmentRadioButton>

                <Button
                    className="fieldLabel"
                    bgColor="white"
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
            <Modal title="User Creation Failed" show={showErrorMessage} onClose={() => { setShowErrorMessage(false) }}>
                <h5>Failed to create user</h5>
            </Modal>
            <Modal title="User Creation Success" show={showSuccessMessage} onClose={() => { setShowSuccessMessage(false) }}>
                <h5>Succeeded in creating a new user</h5>
            </Modal>
            <Modal title="User Already Exists" show={showUserExistsErrorMessage} onClose={() => { setShowUserExistsErrorMessage(false) }}>
                <h5>User already exists</h5>
            </Modal>
        </>
    )
}