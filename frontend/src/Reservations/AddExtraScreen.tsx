import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import FormContainer from "../UIElements/Forms/FormContainer";
import Modal, { ModalController } from "../UIElements/Modal";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import { checkExtraPermissions } from "../Navigation/Navigation";

const AddExtraScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [reservationId, setReservationId] = useState(-1);
    const [item, setItem] = useState("");
    const [price, setPrice] = useState(-1);
    const [description, setDescription] = useState("");
    const [addExtraMessage, setAddExtraMessage] = useState<ModalController | undefined>(undefined);

    const navigate = useNavigate();
    useEffect(() => {
        checkExtraPermissions(userCredentials.role, userCredentials.department, navigate);
    }, [userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const addExtraData = { reservationId, item, price, description };

        try {
            const res = await makeRequest("api/Reservations/add-extra", "POST", "json", addExtraData, userCredentials.token);
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setAddExtraMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 200:
                setAddExtraMessage({
                    title: "Success!",
                    message: "Successfully added extra!",
                });
                break;
            case 400:
                setAddExtraMessage({
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
            <CenteredLabel>Add extra</CenteredLabel>
            <FormContainer onSubmit={(e) => handleSubmit(e)}>
                <Input
                    id="reservationId"
                    label="Reservation Id"
                    type={InputType.Number}
                    placeholder="Enter reservationId Id"
                    onChange={(e) => setReservationId(Number(e.target.value))}
                />
                <Input
                    id="item"
                    label="Item"
                    type={InputType.Text}
                    placeholder="Enter item"
                    onChange={(e) => setItem(e.target.value)}
                />
                <Input
                    id="price"
                    label="Item price"
                    type={InputType.Number}
                    placeholder="Enter item price"
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <Input
                    id="description"
                    label="Item description"
                    type={InputType.Text}
                    placeholder="Enter item description"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                    id="addExtraButton"
                    type={InputType.Submit}
                    value="Add extra"
                />
            </FormContainer>

            {addExtraMessage && (
                <Modal title={addExtraMessage.title} onClose={() => setAddExtraMessage(undefined)}>
                    {addExtraMessage.message}
                </Modal>
            )}
        </>
    )

}

export default AddExtraScreen;