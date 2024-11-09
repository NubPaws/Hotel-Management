import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input, InputType } from "../UIElements/Input";
import { Button } from "../UIElements/Button";
import { createGuest } from "./CreateGuests";
import { Modal } from "../UIElements/Modal";
import { AuthenticatedUserProps } from "../Utils/Props";

export function CreateGuestScreen(props: AuthenticatedUserProps) {
    const [showInvalidInputErrorMessage, setShowInvalidInputErrorMessage] = useState(false);
    const [showGuestExistsErrorMessage, setShowGuestExistsErrorMessage] = useState(false);
    const [showGuestCreatedSuccessMessage, setShowGuestCreatedSuccessMessage] = useState(false);

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
        <NavigationBar/>
        <CenteredLabel>Create Guest</CenteredLabel>
        <form id="guestCreateForm" className="fieldsContainer" action="http://localhost:8000/api/Guests/create">
            <Input
                id="identification"
                label="Guest Id"
                type={InputType.Text}
                placeholder="Enter guest identification" />
            <Input
                id="guestName"
                label="Guest Name"
                type={InputType.Text}
                placeholder="Enter guest name" />
            <Input
                id="guestEmail"
                label="Guest Email"
                type={InputType.Email}
                placeholder="Enter guest email" />
            <Input
                id="guestPhone"
                label="Guest Phone"
                type={InputType.Tel}
                placeholder="Enter guest phone" />
            <Input
                id="guestTitle"
                label="Guest Title"
                type={InputType.Text}
                placeholder="Enter guest title" />
            <Button
                className="fieldLabel"
                backgroundColor="white"
                textColor="black"
                borderWidth="1px"
                onClick={(event) => createGuest(event,
                    props.userCredentials.token,
                    props.setShowConnectionErrorMessage,
                    setShowInvalidInputErrorMessage,
                    setShowGuestExistsErrorMessage,
                    setShowGuestCreatedSuccessMessage,
                    )}>
                Create Guest
            </Button>
        </form>
        {showInvalidInputErrorMessage && (
            <Modal title="Invalid input in guest creation" onClose={() => { setShowInvalidInputErrorMessage(false) }}>
                Invalid input was inserted in guest creation form.
            </Modal>
        )}
        {showGuestExistsErrorMessage && (
            <Modal title="Guest already exists" onClose={() => { setShowGuestExistsErrorMessage(false) }}>
                The specified guest already exists
            </Modal>
        )}
        {showGuestCreatedSuccessMessage && (
            <Modal title="Guest creation succeeded" onClose={() => { setShowGuestCreatedSuccessMessage(false) }}>
                Created new guest
            </Modal>
        )}
    </>;
}