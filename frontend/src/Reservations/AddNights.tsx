import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input, InputType } from "../UIElements/Input";
import { FormContainer } from "../UIElements/FormContainer";
import { DynamicList } from "../UIElements/DynamicList";
import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";
import { Modal } from "../UIElements/Modal";

class InvalidRequestError extends Error { }

const ADD_NIGHTS_URL = "http://localhost:8000/api/Reservations/add-nights";

export function AddNightsScreen(props: AuthenticatedUserProps) {
    const [reservationId, setReservationId] = useState(-1);
    const [nightCount, setNightCount] = useState(-1);
    const [prices, setPrices] = useState<number[]>([]);
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
            await addNights(
                props.userCredentials.token,
                reservationId,
                nightCount,
                prices,
                props.setShowConnectionErrorMessage
            );
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
                    onChange={(e) => setNightCount(Number(e.target.value))}
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
                    addItemButtonValue="Add Price"
                />
                <Input
                    id="addNightsButton"
                    type={InputType.Submit}
                    value="Add nights"
                />
            </FormContainer>
            <Modal
                title="Add night Failed"
                show={showErrorMessage}
                onClose={() => setShowErrorMessage(false)}
            >
                <h1>Failed to add nights</h1>
            </Modal>
            <Modal
                title="Add night success"
                show={showSuccessMessage}
                onClose={() => setShowSuccessMessage(false)}
            >
                <h1>Successfully added the specified nights</h1>
            </Modal>
        </>
    )
}

async function addNights(
    token: string,
    reservationId: number,
    nightCount: number,
    prices: number[],
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    let addNightsData = {
        "reservationId": reservationId,
        "nights": nightCount,
        "prices": prices
    }

    let res = await authorizedPostRequestWithBody(
        token,
        JSON.stringify(addNightsData),
        ADD_NIGHTS_URL,
        setShowConnectionErrorMessage
    );

    if (res?.status !== 200) {
        throw new InvalidRequestError();
    }
}