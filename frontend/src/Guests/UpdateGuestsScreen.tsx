import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { Button } from "../UIElements/Button";
import { updateGuest } from "./UpdateGuest";
import { Modal } from "../UIElements/Modal";

export function UpdateGuestScreen(props: {
    userCredentials: UserCredentials,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
}) {
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

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Update Guest Information"></CenteredLabel>
            <form id="guestUpdateForm" className="fieldsContainer" action="http://localhost:8000/api/Guests/update">
                <Input id="guestId" className="field" type="text" name="guestId"
                    placeholder="Enter guest Id" errorMessageId="guestIdErrorMessage">
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
                <Button
                    className="fieldLabel"
                    bgColor="white"
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
            <Modal title="Guest update succeeded" show={showGuestUpdatedMessage} onClose={() => { setShowGuestUpdatedMessage(false) }}>
                <h5>Successfully update guest</h5>
            </Modal>
            <Modal title="Invalid input in guest updating" show={showInvalidInputErrorMessage} onClose={() => { setShowInvalidInputErrorMessage(false) }}>
                <h5>Invalid input was inserted in guest update form.</h5>
            </Modal>
            <Modal title="Guest not found" show={showGuestNotFoundErrorMessage} onClose={() => { setShowGuestNotFoundErrorMessage(false) }}>
                <h5>Failed to find the specified guest.</h5>
            </Modal>
        </>
    )
}