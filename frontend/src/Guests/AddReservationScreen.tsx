import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { Button } from "../UIElements/Button";
import { addReservation } from "./AddReservation";
import { Modal } from "../UIElements/Modal";
import { AuthenticatedUserProps } from "../Utils/Props";

export function AddReservationScreen(props: AuthenticatedUserProps) {
    const [showAddReservationSuccessMessage, setShowAddReservationSuccessMessage] = useState(false);
    const [showInvalidInputMessage, setShowInvalidInputMessage] = useState(false);
    const [showGuestNotFoundMessage, setShowGuestNotFoundMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Add Reservation to guest"></CenteredLabel>
            <form id="addReservationForm" className="fieldsContainer" action="http://localhost:8000/api/Guests/add-reservation">
                <Input id="guestId" className="field" type="text" name="guestId"
                    placeholder="Enter guest Id" errorMessageId="guestIdErrorMessage">
                    Guest Id
                </Input>
                <Input id="reservationId" className="field" type="number" name="reservationId"
                    placeholder="Enter reservation Id" errorMessageId="reservationIdErrorMessage">
                    Reservation Id
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => addReservation(event,
                        props.userCredentials.token,
                        props.setShowConnectionErrorMessage,
                        setShowAddReservationSuccessMessage,
                        setShowInvalidInputMessage,
                        setShowGuestNotFoundMessage,
                        )}>
                    Add Reservation
                </Button>
            </form>
            <Modal title="Reservation Added successfully" show={showAddReservationSuccessMessage} onClose={() => { setShowAddReservationSuccessMessage(false) }}>
                <h5>Successfully update guest</h5>
            </Modal>
            <Modal title="Invalid input" show={showInvalidInputMessage} onClose={() => { setShowInvalidInputMessage(false) }}>
                <h5>Received invalid input when trying to add reservation </h5>
            </Modal>
            <Modal title="Guest not found" show={showGuestNotFoundMessage} onClose={() => { setShowGuestNotFoundMessage(false) }}>
                <h5>Failed to find guest when trying to add reservation </h5>
            </Modal>
        </>
    )
}