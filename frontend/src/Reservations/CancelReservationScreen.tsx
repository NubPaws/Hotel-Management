import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import Input, { InputType } from "../UIElements/Forms/Input";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import Modal, { ModalController } from "../UIElements/Modal";
import { checkAdminOrFrontDesk } from "../Navigation/Navigation";

const CancelReservationScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [reservationId, setReservationId] = useState(-1);
    const [cancelReservationMessage, setCancelReservationMessage] = useState<ModalController | undefined>(undefined);

    const navigate = useNavigate();
    useEffect(() => {
        checkAdminOrFrontDesk(userCredentials.role, userCredentials.department, navigate);
    }, [userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const cancelReservationData = { reservationId };

        try {
            const res = await makeRequest("api/Reservations/cancel", "POST", "json", cancelReservationData, userCredentials.token);
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setCancelReservationMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 200:
                setCancelReservationMessage({
                    title: "Success!",
                    message: "Successfully canceled reservation!",
                });
                break;
            case 400:
                setCancelReservationMessage({
                        title: "Failed!",
                        message: await res.text(),
                    });
                    break;
            default:
                setShowConnectionErrorMessage(true);
                break;
        }
    };

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
            {cancelReservationMessage && (
                <Modal title={cancelReservationMessage.title} onClose={() => setCancelReservationMessage(undefined)}>
                    {cancelReservationMessage.message}
                </Modal>
            )}
        </>
    )

}

export default CancelReservationScreen;