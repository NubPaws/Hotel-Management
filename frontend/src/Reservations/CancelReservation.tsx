import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { FormContainer } from "../UIElements/FormContainer";
import { Input, InputType } from "../UIElements/Input";
import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";
import { Modal } from "../UIElements/Modal";

class InvalidRequestError extends Error {}

const CANCEL_RESERVATION_URL = "http://localhost:8000/api/Reservations/cancel";

export function CancelReservationScreen(props: AuthenticatedUserProps) {
    const [reservationId, setReservationId] = useState(-1);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.role === "") {
            navigate("/login");
        }
        if (props.userCredentials.role !== "Admin" && props.userCredentials.department !== "FrontDesk") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await cancelReservation(
                props.userCredentials.token,
                reservationId,
                props.setShowConnectionErrorMessage
            );
            setShowSuccessMessage(true);
        }
        catch (error: any) {
            if (error instanceof InvalidRequestError) {
                setShowErrorMessage(true);
            }
        }
    }

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel>Cancel Reservation</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="reservationId"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservationId Id"
                    onChange={(e) => setReservationId(Number(e.target.value))}
                />
                <Input
                    id="cancelReservationButton"
                    type={InputType.Submit}
                    value="Cancel reservation"
                />
            </FormContainer>
            <Modal
                title="Cancelation Failed"
                show={showErrorMessage}
                onClose={() => setShowErrorMessage(false)}
            >
                <h1>Failed to cancel reservation</h1>
            </Modal>
            <Modal
                title="Cancelation Success"
                show={showSuccessMessage}
                onClose={() => setShowSuccessMessage(false)}
            >
                <h1>Successfully canceled reservation</h1>
            </Modal>
        </>
    )
}

async function cancelReservation(
    token: string,
    reservationId: number,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    let cancelReservationData = {
        "reservationId": reservationId,
    }

    let res = await authorizedPostRequestWithBody(
        token,
        JSON.stringify(cancelReservationData),
        CANCEL_RESERVATION_URL,
        setShowConnectionErrorMessage
    );

    if (res?.status !== 200) {
        throw new InvalidRequestError();
    }
}