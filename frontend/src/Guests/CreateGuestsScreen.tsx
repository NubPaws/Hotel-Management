import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { Button } from "../UIElements/Button";
import { createGuests } from "./CreateGuests";
import { Modal } from "../UIElements/Modal";

export function CreateGuestScreen(props: {
    userCredentials: UserCredentials,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}) {
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

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Create Guest"></CenteredLabel>
            <form id="guestCreateForm" className="fieldsContainer" action="http://localhost:8000/api/Guests/create">
                <Input id="identification" className="field" type="text" name="identification"
                    placeholder="Enter guest identification" errorMessageId="guestIdErrorMessage">
                    Guest Id
                </Input>
                <Input id="guestName" className="field" type="text" name="guestName"
                    placeholder="Enter guest name" errorMessageId="guestNameErrorMessage">
                    Guest Name
                </Input>
                <Input id="guestEmail" className="field" type="email" name="guestEmail"
                    placeholder="Enter guest email" errorMessageId="guestEmailErrorMessage">
                    Guest Email
                </Input>
                <Input id="guestPhone" className="field" type="text" name="guestPhone"
                    placeholder="Enter guest phone" errorMessageId="guestPhoneErrorMessage">
                    Guest Phone
                </Input>
                <Input id="guestTitle" className="field" type="text" name="guestTitle"
                    placeholder="Enter guest title" errorMessageId="guestTitleErrorMessage">
                    Guest Title
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => createGuests(event,
                        props.userCredentials.token,
                        props.setShowConnectionErrorMessage,
                        setShowInvalidInputErrorMessage,
                        setShowGuestExistsErrorMessage,
                        setShowGuestCreatedSuccessMessage,
                        )}>
                    Create Guest
                </Button>
            </form>
            <Modal title="Invalid input in guest creation" show={showInvalidInputErrorMessage} onClose={() => { setShowInvalidInputErrorMessage(false) }}>
                <h5>Invalid input was inserted in guest creation form.</h5>
            </Modal>
            <Modal title="Guest already exists" show={showGuestExistsErrorMessage} onClose={() => { setShowGuestExistsErrorMessage(false) }}>
                <h5>The specified guest already exists</h5>
            </Modal>
            <Modal title="Guest creation succeeded" show={showGuestCreatedSuccessMessage} onClose={() => { setShowGuestCreatedSuccessMessage(false) }}>
                <h5>Created new guest</h5>
            </Modal>
        </>
    )
}