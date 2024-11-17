import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Button from "../UIElements/Buttons/Button";
import { updateGuest } from "./UpdateGuest";
import Modal from "../UIElements/Modal";
import { AuthenticatedUserProps } from "../Utils/Props";

export function UpdateGuestScreen(props: AuthenticatedUserProps) {
    const [showGuestUpdatedMessage, setShowGuestUpdatedMessage] = useState(false);
    const [showInvalidInputErrorMessage, setShowInvalidInputErrorMessage] = useState(false);
    const [showGuestNotFoundErrorMessage, setShowGuestNotFoundErrorMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.role !== "Admin") {
            navigate("/login");
        }
        if (props.userCredentials.department !== "FrontDesk") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return <>
        <NavigationBar />
        <CenteredLabel>Update Guest Information</CenteredLabel>
        <form id="guestUpdateForm" className="fieldsContainer" action="http://localhost:8000/api/Guests/update">
            <Input
                id="guestId"
                label="Guest Id"
                type={InputType.Text}
                placeholder="Enter guest Id"/>
            <Input
                id="guestName"
                label="Guest Name"
                type={InputType.Text}
                placeholder="Enter guest name"/>
            <Input
                id="guestEmail"
                label="Guest Email"
                type={InputType.Email}
                placeholder="Enter guest email"/>
            <Input
                id="guestPhone"
                label="Guest Phone"
                type={InputType.Tel}
                placeholder="Enter guest phone"/>
            <Button
                className="fieldLabel"
                backgroundColor="white"
                textColor="black"
                borderWidth="1px"
                onClick={(event) => updateGuest(event,
                    props.userCredentials.token,
                    props.setShowConnectionErrorMessage,
                    setShowInvalidInputErrorMessage,
                    setShowGuestUpdatedMessage,
                    setShowGuestNotFoundErrorMessage,
                )}>
                UpdateGuest
            </Button>
        </form>
        {showGuestUpdatedMessage && (
            <Modal title="Guest update succeeded" onClose={() => { setShowGuestUpdatedMessage(false) }}>
                Successfully update guest
            </Modal>
        )}
        {showInvalidInputErrorMessage && (
            <Modal title="Invalid input in guest updating" onClose={() => { setShowInvalidInputErrorMessage(false) }}>
                Invalid input was inserted in guest update form.
            </Modal>
        )}
        {showGuestNotFoundErrorMessage && (
            <Modal title="Guest not found" onClose={() => { setShowGuestNotFoundErrorMessage(false) }}>
                Failed to find the specified guest.
            </Modal>
        )}
    </>;
}