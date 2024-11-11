import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input, InputType } from "../UIElements/Forms/Input";
import { Button } from "../UIElements/Button";
import { addReservation } from "./AddReservation";
import Modal from "../UIElements/Modal";
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
            <CenteredLabel>Add Reservation to guest</CenteredLabel>
            <form id="addReservationForm" className="fieldsContainer" action="http://localhost:8000/api/Guests/add-reservation">
                <Input
                    id="guestId"
                    label="Guest Id"
                    type={InputType.Text}
                    placeholder="Enter guest Id"
                />
                <Input
                    id="reservationId"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservation Id"
                />    
                <Button
                    className="fieldLabel"
                    backgroundColor="white"
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
            {showAddReservationSuccessMessage && (
                <Modal title="Reservation Added successfully" onClose={() => { setShowAddReservationSuccessMessage(false) }}>
                    Successfully update guest
                </Modal>
            )}
            {showInvalidInputMessage && (
                <Modal title="Invalid input" onClose={() => { setShowInvalidInputMessage(false) }}>
                    Received invalid input when trying to add reservation
                </Modal>
            )}
            {showGuestNotFoundMessage && (
                <Modal title="Guest not found" onClose={() => { setShowGuestNotFoundMessage(false) }}>
                    Failed to find guest when trying to add reservation
               </Modal>
            )}
            
        </>
    )
}