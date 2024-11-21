import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import FormContainer from "../UIElements/Forms/FormContainer";
import DynamicList from "../UIElements/DynamicList";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import Modal, { ModalController } from "../UIElements/Modal";
import { checkAdminOrFrontDesk } from "../Navigation/Navigation";


const AddNightsScreen: React.FC<AuthenticatedUserProps> = ({
    userCredentials, setShowConnectionErrorMessage
}) => {
    const [reservationId, setReservationId] = useState(-1);
    const [nights, setNights] = useState(-1);
    const [prices, setPrices] = useState<number[]>([]);
    const [addNightMessage, setAddNightMessage] = useState<ModalController | undefined>(undefined);

    const navigate = useNavigate();
    useEffect(() => {
        checkAdminOrFrontDesk(userCredentials.role, userCredentials.department, navigate);
    }, [userCredentials, navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const addNightsData = { reservationId, nights, prices };

        try {
            const res = await makeRequest("api/Reservations/add-nights", "POST", "json", addNightsData, userCredentials.token);
            handleResponse(res);
        } catch (error: any) {
            if (error instanceof FetchError) {
                setShowConnectionErrorMessage(true);
            }
            if (error instanceof RequestError) {
                setAddNightMessage({
                    title: "General Error Occurred",
                    message: error.message,
                });
            }
        }
    }

    const validateInputs = () => {
        const ERROR_TITLE = "Failed to process form";
        if (nights !== prices.length) {
            setAddNightMessage({
                title: ERROR_TITLE,
                message: "Nights and prices needs to match"
            });
            return false;
        }
        if (nights <= 0) {
            setAddNightMessage({
                title: ERROR_TITLE,
                message: "Nights must be positive"
            });
            return false;
        }
        return true;
    };

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 200:
                setAddNightMessage({
                    title: "Success!",
                    message: "Successfully added night!",
                });
                break;
            case 400:
                setAddNightMessage({
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
            <CenteredLabel>Add nights</CenteredLabel>
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
                <DynamicList
                    list={prices}
                    setList={setPrices}
                    listId="priceInputs"
                    itemId="price"
                    itemLabel="Night price"
                    itemPlaceHolder="Enter night price"
                    removeItemId="removePriceButton"
                    addItemId="addPriceButton"
                    addButtonText="Add Price"
                />
                <Input
                    id="addNightsButton"
                    type={InputType.Submit}
                    value="Add nights"
                />
            </FormContainer>
            {addNightMessage && (
                <Modal title={addNightMessage.title} onClose={() => setAddNightMessage(undefined)}>
                    {addNightMessage.message}
                </Modal>
            )}
        </>
    )
}

export default AddNightsScreen;