import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input, InputType } from "../UIElements/Input";
import { FormContainer } from "../UIElements/FormContainer";
import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";
import { Modal } from "../UIElements/Modal";

class InvalidRequestError extends Error { }

const REMOVE_EXTRA_URL = "http://localhost:8000/api/Reservations/remove-extra";

export function RemoveExtraScreen(props: AuthenticatedUserProps) {
    const [reservationId, setReservationId] = useState(-1);
    const [extraId, setExtraId] = useState(-1);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.role === "") {
            navigate("/login");
        }
        if (props.userCredentials.role !== "Admin"
            && props.userCredentials.department !== "FrontDesk"
            && props.userCredentials.department !== "FoodAndBeverage") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await removeExtra(
                props.userCredentials.token,
                reservationId,
                extraId,
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
            <CenteredLabel>Remove Extra</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="reservationId"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservationId Id"
                    onChange={(e) => setReservationId(Number(e.target.value))}
                />
                <Input
                    id="extraId"
                    label="Extra Id"
                    type={InputType.Number}
                    placeholder="Enter extra id"
                    onChange={(e) => setExtraId(Number(e.target.value))}
                />
                <Input
                    id="removeExtraButton"
                    type={InputType.Submit}
                    value="Remove extra"
                />
            </FormContainer>
            <Modal
                title="Remove extra Failed"
                show={showErrorMessage}
                onClose={() => setShowErrorMessage(false)}
            >
                <h1>Failed to remove extra</h1>
            </Modal>
            <Modal
                title="Remove extra success"
                show={showSuccessMessage}
                onClose={() => setShowSuccessMessage(false)}
            >
                <h1>Successfully removed extra</h1>
            </Modal>
        </>
    )
}

async function removeExtra(
    token: string,
    reservationId: number,
    extraId: number,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    let addExtraData = {
        "reservationId": reservationId,
        "extraId": extraId
    }

    let res = await authorizedPostRequestWithBody(
        token,
        JSON.stringify(addExtraData),
        REMOVE_EXTRA_URL,
        setShowConnectionErrorMessage
    );

    if (res?.status !== 200) {
        throw new InvalidRequestError();
    }
}