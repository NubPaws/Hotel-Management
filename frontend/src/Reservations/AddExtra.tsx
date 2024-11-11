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

const ADD_EXTRA_URL = "http://localhost:8000/api/Reservations/add-extra";

export function AddExtraScreen(props: AuthenticatedUserProps) {
    const [reservationId, setReservationId] = useState(-1);
    const [item, setItem] = useState("");
    const [price, setPrice] = useState(-1);
    const [description, setDescription] = useState("");
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
            await addExtra(
                props.userCredentials.token,
                reservationId,
                item,
                price,
                description,
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
            <Modal
                title="Add extra Failed"
                show={showErrorMessage}
                onClose={() => setShowErrorMessage(false)}
            >
                <h1>Failed to add extra</h1>
            </Modal>
            <Modal
                title="Add extra success"
                show={showSuccessMessage}
                onClose={() => setShowSuccessMessage(false)}
            >
                <h1>Successfully added extra</h1>
            </Modal>
        </>
    )
}

async function addExtra(
    token: string,
    reservationId: number,
    item: string,
    price: number,
    description: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    let addExtraData = {
        "reservationId": reservationId,
        "item": item,
        "price": price,
        "description": description
    }

    let res = await authorizedPostRequestWithBody(
        token,
        JSON.stringify(addExtraData),
        ADD_EXTRA_URL,
        setShowConnectionErrorMessage
    );

    if (res?.status !== 200) {
        throw new InvalidRequestError();
    }
}