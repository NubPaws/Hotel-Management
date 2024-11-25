import { useState } from "react";
import { useLocation } from "react-router-dom";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import FormContainer from "../UIElements/Forms/FormContainer";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";
import { Guest } from "../APIRequests/ServerData";

const UpdateGuestScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const location = useLocation();
    const state = location.state as Partial<Guest>;
    const {
        email: initialEmail,
        guestId: initialGuestId,
        phone: initialPhone,
        fullName: initialFullName
    } = state || {};

    const [email, setEmail] = useState(initialEmail || "");
    const [guestId, setGuestId] = useState(initialGuestId || 0);
    const [phone, setPhone] = useState(initialPhone || "");
    const [fullName, setFullName] = useState(initialFullName || "");

    const [showModal] = useModalError();
    const [showErrorPopup, showInfoPopup] = usePopup();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = { email, guestId, phone, fullName }

        try {
            const res = await makeRequest("api/Guests/update", "POST", "json", data, userCredentials.token);
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
            showInfoPopup(`Successfully updated guest`)
            return;
        }
        if (res.status === 400) {
            showModal("Failed to update guest", "Failed to update guest, make sure your input is valid and try again.");
            return;
        }
        if (res.status === 409) {
            showModal("Guest not exists", "There isn't a guest with the specified Id.");
            return;
        }
        if (res.status === 401) {
            showErrorPopup("Unauthorized to update guest");
            return;
        }
    }

    return <>
        <CenteredLabel>Update Guest Information</CenteredLabel>
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
                id="guest-name"
                label="Guest Name"
                type={InputType.Text}
                placeholder="Enter guest name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <Input
                id="guest-email"
                label="Guest Email"
                type={InputType.Email}
                placeholder="Enter guest email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                id="guest-phone"
                label="Guest Phone"
                type={InputType.Tel}
                placeholder="Enter guest phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Input
                id="update-guest"
                type={InputType.Submit}
                value="Update"
            />
        </FormContainer>
    </>;
}

export default UpdateGuestScreen;