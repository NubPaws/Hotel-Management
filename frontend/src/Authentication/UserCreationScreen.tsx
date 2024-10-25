import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import { Input } from "../UIElements/Input"
import { Button } from "../UIElements/Button"
import { CenteredLabel } from "../UIElements/CenteredLabel"
import { createUser } from "./UserCreation";
import { Modal } from "../UIElements/Modal";
import { NavigationBar } from "../UIElements/NavigationBar";

export function UserCreationScreen(props: {
    userCredentials: UserCredentials,
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>
}) {
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);
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
                <div className="userDepartmentContainer" >
                    <p>Select user department:</p>
                    <input type="radio" id="General" name="department" value="General"></input>
                    <label htmlFor="General">General</label>
                    <br />

                    <input type="radio" id="FrontDesk" name="department" value="FrontDesk"></input>
                    <label htmlFor="FrontDesk">Front Desk</label>
                    <br />

                    <input type="radio" id="Housekeeping" name="department" value="HouseKeeping"></input>
                    <label htmlFor="Housekeeping">Housekeeping</label>
                    <br />

                    <input type="radio" id="Maintenance" name="department" value="Maintenance"></input>
                    <label htmlFor="Maintenance">Maintenance</label>
                    <br />

                    <input type="radio" id="FoodAndBeverage" name="department" value="FoodAndBeverage"></input>
                    <label htmlFor="FoodAndBeverage">Food And Beverage</label>
                    <br />

                    <input type="radio" id="Security" name="department" value="Security"></input>
                    <label htmlFor="Security">Security</label>
                    <br />

                    <input type="radio" id="Concierge" name="department" value="Concierge"></input>
                    <label htmlFor="Concierge">Concierge</label>
                    <br />

                    <div id="userDepartmentErrorMessage"></div>
                </div>

                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => createUser(event,
                                                   props.userCredentials.token,
                                                   setShowErrorMessage,
                                                   setShowConnectionErrorMessage,
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
            <Modal title="Failed to connect to server" show={showConnectionErrorMessage} onClose={() => { setShowConnectionErrorMessage(false) }}>
                <h5>Unfortunately, we failed to reach our server.</h5>
            </Modal>
            <Modal title="User Already Exists" show={showUserExistsErrorMessage} onClose={() => { setShowUserExistsErrorMessage(false) }}>
                <h5>User already exists</h5>
            </Modal>
        </>
    )
}