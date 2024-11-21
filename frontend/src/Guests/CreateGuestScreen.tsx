import { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import FormContainer from "../UIElements/Forms/FormContainer";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";

const CreateGuestScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const [identification, setIdentification] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [title, setTitle] = useState("");

    const [showModal] = useModalError();
    const [showErrorPopup, showInfoPopup] = usePopup();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = { identification, fullName, email, phone, title }

        try {
            const res = await makeRequest("api/Guests/create", "POST", "json", data, userCredentials.token);
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
        if (res.status === 201) {
            showInfoPopup("Successfully created guest");
            return;
        }
        if (res.status === 400) {
            showModal("Failed to create guest", "Failed to update guest, make sure your input is valid and try again.");
            return;
        }
        if (res.status === 409) {
            showModal("Guest already exists", "There is already a guest with the specified information.");
            return;
        }
        if (res.status === 401) {
            showErrorPopup("Unauthorized to create guest");
            return;
        }
    }

    return <>
        <CenteredLabel>Create Guest</CenteredLabel>
        <FormContainer onSubmit={(e) => handleSubmit(e)}>
            <Input
                id="guest-identification"
                label="Identification"
                type={InputType.Text}
                placeholder="Enter guest Id"
                value={identification}
                onChange={(e) => setIdentification(e.target.value)}
            />
            <Input
                id="guest-name"
                label="Name"
                type={InputType.Text}
                placeholder="Enter guest name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <Input
                id="guest-email"
                label="Email"
                type={InputType.Email}
                placeholder="Enter guest email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                id="guest-phone"
                label="Phone"
                type={InputType.Tel}
                placeholder="Enter guest phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Input
                id="guest-title"
                label="Title"
                type={InputType.Tel}
                placeholder="Enter guest title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Input
                id="create-guest"
                type={InputType.Submit}
                value="Create"
            />
        </FormContainer>
    </>;
}

export default CreateGuestScreen;