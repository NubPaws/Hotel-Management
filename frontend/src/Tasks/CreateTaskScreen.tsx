import { useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import FormContainer from "../UIElements/Forms/FormContainer";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { ScreenProps } from "../Utils/Props";
import Input, { InputType } from "../UIElements/Forms/Input";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import RadioButtonContainer from "../UIElements/Forms/Radio/RadioButtonContainer";
import RadioButton from "../UIElements/Forms/Radio/RadioButton";
import { useNavigate } from "react-router-dom";

const CreateTaskScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const [room, setRoom] = useState(0);
    const [description, setDescription] = useState("");
    const [urgency, setUrgency] = useState(0);
    const [department, setDepartment] = useState("");

    const [showModal] = useModalError();
    const [showErrorPopup, showInfoPopup] = usePopup();

    const navigate = useNavigate();
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        try {
            const res = await makeRequest("api/Tasks", "POST", "json", {
                room,
                description,
                urgency,
                department: department.replace(/ /g, ""),
                creator: userCredentials.username
            }, userCredentials.token);

            handleResponse(res);
        } catch (error) {
            if (error instanceof FetchError) {
                showModal("Failed to connect to server", "Connection with the server could not be made.");
            }
            if (error instanceof RequestError) {
                showModal("Invalid request", "Request was invalid, re-validate fields.");
            }
        }
    }

    const validateInputs = () => {
        const ERROR_TITLE = "Failed to process form";
        if (!department) {
            showModal(ERROR_TITLE, "Department not chosen");
            return false;
        }
        if (!description) {
            showModal(ERROR_TITLE, "Description must be filled");
            return false;
        }
        if (room === 0) {
            showModal(ERROR_TITLE, "Room number must be non-negative.");
            return false;
        }
        if (urgency > 9 || urgency < 0) {
            showModal(ERROR_TITLE, "Urgency must be between 0 and 9");
            return false;
        }
        return true;
    };

    const handleResponse = async (res: Response) => {
        switch (res.status) {
            case 201:
                showInfoPopup("Task created successfully");
                navigate(-1);
                return;
            case 400:
                showErrorPopup("Failed to create task");
                break;
        }
    };

    return <>
        <CenteredLabel>Create New Task</CenteredLabel>
        <FormContainer onSubmit={(e) => handleSubmit(e)}>
            <Input
                id="task-room-input"
                label="Room number"
                value={`${room}`}
                type={InputType.Number}
                placeholder="Enter room number"
                onChange={(e) => setRoom(e.target.value ? parseInt(e.target.value) : 0)}
            />
            <Input
                id="task-description-input"
                label="Description"
                value={description}
                type={InputType.Text}
                placeholder="Enter task description"
                onChange={(e) => setDescription(e.target.value)}
            />
            <Input
                id="task-urgency-input"
                label="Task urgency"
                value={`${urgency}`}
                type={InputType.Number}
                placeholder="Enter room number"
                onChange={(e) => setUrgency(e.target.value ? parseInt(e.target.value) : 0)}
            />
            <RadioButtonContainer
                title="Select User's Department:"
                name="department"
                value={department}
                setValue={setDepartment}
            >
                <RadioButton>General</RadioButton>
                <RadioButton>Front Desk</RadioButton>
                <RadioButton>Housekeeping</RadioButton>
                <RadioButton>Maintenance</RadioButton>
                <RadioButton>Food And Beverage</RadioButton>
                <RadioButton>Security</RadioButton>
                <RadioButton>Concierge</RadioButton>
            </RadioButtonContainer>
            <Input
                id="new-task-btn"
                type={InputType.Submit}
                value="Create"
            />
        </FormContainer>
    </>;
}

export default CreateTaskScreen;