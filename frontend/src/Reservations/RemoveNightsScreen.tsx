import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import Modal, { ModalController } from "../UIElements/Modal";
import { checkAdminOrFrontDesk } from "../Navigation/Navigation";

const RemoveNightScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [reservationId, setReservationId] = useState(-1);
    const [nights, setNights] = useState(-1);
    const [removeNightMessage, setRemoveNightMessage] = useState<ModalController | undefined>(undefined);

    const navigate = useNavigate();
    useEffect(() => {
        checkAdminOrFrontDesk(userCredentials.role, userCredentials.department, navigate);
    }, [userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const removeNightsData = { reservationId, nights };

        try {
            const res = await makeRequest("api/Reservations/remove-nights", "POST", "json", removeNightsData, userCredentials.token);
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setRemoveNightMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 200:
                setRemoveNightMessage({
                    title: "Success!",
                    message: "Successfully removed nights from reservation!",
                });
                break;
            case 400:
                setRemoveNightMessage({
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
            <NavigationBar />
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
                    onChange={(e) => setNights(Number(e.target.value))}
                />
                <Input
                    id="removeNightsButton"
                    type={InputType.Submit}
                    value="Remove nights"
                />
            </FormContainer>
            {removeNightMessage && (
                <Modal title={removeNightMessage.title} onClose={() => setRemoveNightMessage(undefined)}>
                    {removeNightMessage.message}
                </Modal>
            )}

        </>
    )
}

export default RemoveNightScreen;