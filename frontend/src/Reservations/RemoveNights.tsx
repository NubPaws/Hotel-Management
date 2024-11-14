import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";
import Modal from "../UIElements/Modal";


class InvalidRequestError extends Error { }

const REMOVE_NIGHTS_URL = "http://localhost:8000/api/Reservations/remove-nights";

export function RemoveNightScreen(props: AuthenticatedUserProps) {
    const [reservationId, setReservationId] = useState(-1);
    const [nightCount, setNightCount] = useState(-1);
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
            await removeNights(
                props.userCredentials.token,
                reservationId,
                nightCount,
                props.setShowConnectionErrorMessage
            )
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
            <CenteredLabel>Remove nights</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="reservationId"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservationId Id"
                    onChange={(e) => setReservationId(Number(e.target.value))}
                />
                <Input
                    id="nightCount"
                    label="Number of nights"
                    type={InputType.Number}
                    placeholder="Enter number of nights"
                    onChange={(e) => setNightCount(Number(e.target.value))}
                />
                <Input
                    id="removeNightsButton"
                    type={InputType.Submit}
                    value="Remove nights"
                />
            </FormContainer>
            {showErrorMessage && (
                <Modal
                    title="Remove night Failed"
                    onClose={() => setShowErrorMessage(false)}
                >
                    <h1>Failed to remove nights</h1>
                </Modal>
            )}
            {showSuccessMessage && (
                <Modal
                    title="Remove night success"
                    onClose={() => setShowSuccessMessage(false)}
                >
                    <h1>Successfully removed the specified nights</h1>
                </Modal>
            )}

        </>
    )
}

async function removeNights(
    token: string,
    reservationId: number,
    nightCount: number,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    let addNightsData = {
        "reservationId": reservationId,
        "nights": nightCount,
    }

    let res = await authorizedPostRequestWithBody(
        token,
        JSON.stringify(addNightsData),
        REMOVE_NIGHTS_URL,
        setShowConnectionErrorMessage
    );

    if (res?.status !== 200) {
        throw new InvalidRequestError();
    }
}