import { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import FormContainer from "../UIElements/Forms/FormContainer";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";

const AddReservationScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const [guestId, setGuestId] = useState(0);
    const [reservationId, setReservationId] = useState(0);
    
    const [showModal] = useModalError();
    const [showErrorPopup, showInfoPopup] = usePopup();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = { guestId, reservationId }

        try {
            const res = await makeRequest("api/Guests/add-reservation", "POST", "json", data, userCredentials.token);
            handleResponse(res);
        } catch (error) {
            if (error instanceof FetchError) {
                showErrorPopup("Error connecting to the server");
            }
            if (error instanceof RequestError) {
                showModal("General Error Occurred", error.message);
            }
        }
    }

    const handleResponse = async (res: Response) => {
        if (res.status === 200) {
            showInfoPopup("Successfully added reservation to guest");
            return;
        }
        if (res.status === 400) {
            showModal("Failed to add reservation", "Failed to add reservation to guest, make sure your input is valid and try again.");
            return;
        }
    }

    return <>
        <CenteredLabel>Add Reservation to guest</CenteredLabel>
        <FormContainer onSubmit={(e) => handleSubmit(e)}>
            <Input
                id="guest-id"
                label="Guest Id"
                type={InputType.Text}
                placeholder="Enter guest Id"
                value={`${guestId}`}
                onChange={(e) => setGuestId(Number(e.target.value))}
            />
            <Input
                id="reservation-id"
                label="Reservation Id"
                type={InputType.Number}
                placeholder="Enter reservation Id"
                value={`${reservationId}`}
                onChange={(e) => setReservationId(Number(e.target.value))}
            />
            <Input
                id="add-reservation-to-guest"
                type={InputType.Submit}
                value="Add reservation"
            />
        </FormContainer>
    </>;
}

export default AddReservationScreen;