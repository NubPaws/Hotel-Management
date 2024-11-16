import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { FormContainer } from "../UIElements/Forms/FormContainer";
import Modal, { ModalController } from "../UIElements/Modal";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { checkExtraPermissions } from "../Navigation/Navigation";

const UpdateExtraScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [extraId, setExtraId] = useState(-1);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(-1);
    const [description, setDescription] = useState("");
    const [updateExtraMessage, setUpdateExtraMessage] = useState<ModalController | undefined>(undefined);

    const navigate = useNavigate();
    useEffect(() => {
        checkExtraPermissions(userCredentials.role, userCredentials.department, navigate);
    }, [userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const updateExtraData = { extraId, name, price, description };

        try {
            const res = await makeRequest("api/Extras/update", "POST", "json", updateExtraData, userCredentials.token);
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setUpdateExtraMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 200:
                setUpdateExtraMessage({
                    title: "Success!",
                    message: "Successfully updated extra!",
                });
                break;
            case 400:
                setUpdateExtraMessage({
                    title: "Failed!",
                    message: await res.text(),
                });
                break;
            case 404:
                setUpdateExtraMessage({
                    title: "Failed!",
                    message: `Extra ${extraId} does not exists`,
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
            <CenteredLabel>Update Extra</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="extraId"
                    label="Extra Id"
                    type={InputType.Number}
                    placeholder="Enter extra Id"
                    onChange={(e) => setExtraId(Number(e.target.value))}
                />
                <Input
                    id="item"
                    label="Item"
                    type={InputType.Text}
                    placeholder="Enter item name"
                    onChange={(e) => setName(e.target.value)}
                    isRequired={false}
                />
                <Input
                    id="price"
                    label="Item price"
                    type={InputType.Number}
                    placeholder="Enter item price"
                    onChange={(e) => setPrice(Number(e.target.value))}
                    isRequired={false}
                />
                <Input
                    id="description"
                    label="Item description"
                    type={InputType.Text}
                    placeholder="Enter item description"
                    onChange={(e) => setDescription(e.target.value)}
                    isRequired={false}
                />
                <Input
                    id="addExtraButton"
                    type={InputType.Submit}
                    value="Update extra"
                />
            </FormContainer>

            {updateExtraMessage && (
                <Modal title={updateExtraMessage.title} onClose={() => setUpdateExtraMessage(undefined)}>
                    {updateExtraMessage.message}
                </Modal>
            )}
        </>
    )
}

export default UpdateExtraScreen;