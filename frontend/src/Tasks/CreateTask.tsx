import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { UserDepartmentRadioButton } from "../Authentication/UserRadioButtons";
import { Button } from "../UIElements/Button";
import { validateRadioButton } from "../Authentication/Validation";
import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";
import { Modal } from "../UIElements/Modal";

export function CreateTaskScreen(props: AuthenticatedUserProps) {
    const [showTaskCreateMessage, setShowTaskCreateMessage] = useState(false);
    const [showInvalidInputErrorMessage, setShowInvalidInputErrorMessage] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Create new task"></CenteredLabel>
            <form id="taskCreateForm" className="fieldsContainer" action="http://localhost:8000/api/Tasks">
                <Input id="roomNumber" className="field" type="number" name="roomNumber"
                    placeholder="Enter room number" errorMessageId="roomNumberErrorMessage">
                    Room number
                </Input>
                <Input id="taskDescription" className="field" type="text" name="taskDescription"
                    placeholder="Enter task description" errorMessageId="taskDescriptionErrorMessage">
                    Task description
                </Input>
                <Input id="taskUrgency" className="field" type="number" name="taskUrgency"
                    placeholder="Enter task urgency - must be between 0 to 9" errorMessageId="taskUrgencyErrorMessage">
                    Task urgency
                </Input>
                <UserDepartmentRadioButton></UserDepartmentRadioButton>

                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => createTask(event,
                        props.userCredentials.token,
                        props.userCredentials.username,
                        props.setShowConnectionErrorMessage,
                        setShowTaskCreateMessage,
                        setShowInvalidInputErrorMessage
                    )}>
                    Create task
                </Button>
            </form>
            <Modal title="Invalid input in task creation" show={showInvalidInputErrorMessage} onClose={() => { setShowInvalidInputErrorMessage(false) }}>
                <h5>Invalid input was inserted in task creation form.</h5>
            </Modal>
            <Modal title="Task creation success" show={showTaskCreateMessage} onClose={() => { setShowTaskCreateMessage(false) }}>
                <h5>Succeeded in creating task.</h5>
            </Modal>
        </>
    )
}

async function createTask(event: any,
    token: string,
    username: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowTaskCreateMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowInvalidInputErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    if (!validateTaskCreation()) {
        return;
    }
    let roomNumberInput = document.getElementById("roomNumber") as HTMLInputElement;
    let taskDescriptionInput = document.getElementById("taskDescription") as HTMLInputElement;
    let taskUrgencyInput = document.getElementById("taskUrgency") as HTMLInputElement;

    const userDepartment: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="department"]');
    let userDepartmentIndex = 0;

    for (let i = 0; i < userDepartment.length; i++) {
        if (userDepartment[i].checked) {
            userDepartmentIndex = i;
        }
    }

    let taskCreateForm = document.getElementById("taskCreateForm") as HTMLFormElement;
    let url = taskCreateForm.action;

    let taskCreateData = {
        "room": roomNumberInput.value,
        "description": taskDescriptionInput.value,
        "urgency": taskUrgencyInput.value,
        "department": userDepartment[userDepartmentIndex].value,
        "creator": username
    }

    let res = await authorizedPostRequestWithBody(token, JSON.stringify(taskCreateData), url, setShowConnectionErrorMessage);
    if (res === null) {
        return;
    }
    let status = res.status;
    if (status === 201) {
        setShowTaskCreateMessage(true);
        // Clearing the form
        roomNumberInput.value = "";
        taskDescriptionInput.value = "";
        taskUrgencyInput.value = "";
        userDepartment[userDepartmentIndex].checked = false;
    } else if (status === 400) {
        setShowInvalidInputErrorMessage(true);
    }
}

function validateTaskCreation() {
    let roomNumberInput = document.getElementById("roomNumber") as HTMLInputElement;
    let roomNumberErrorMessage = document.getElementById("roomNumberErrorMessage") as HTMLInputElement;

    let taskDescriptionInput = document.getElementById("taskDescription") as HTMLInputElement;
    let taskDescriptionErrorMessage = document.getElementById("taskDescriptionErrorMessage") as HTMLInputElement;

    let taskUrgencyInput = document.getElementById("taskUrgency") as HTMLInputElement;
    let taskUrgencyErrorMessage = document.getElementById("taskUrgencyErrorMessage") as HTMLInputElement;

    if (roomNumberInput.value === "") {
        roomNumberErrorMessage.innerText = "Room number must be filled";
        return false;
    } else {
        roomNumberErrorMessage.innerText = "";
    }

    if (taskDescriptionInput.value === "") {
        taskDescriptionErrorMessage.innerText = "Task description must be filled";
        return false;
    } else {
        taskDescriptionErrorMessage.innerText = "";
    }

    if (taskUrgencyInput.value === "") {
        taskUrgencyErrorMessage.innerText = "Urgency must be filled";
        return false;
    } else {
        taskUrgencyErrorMessage.innerText = "";
    }

    if (Number(taskUrgencyInput.value) < 0 || Number(taskUrgencyInput.value) > 9) {
        taskUrgencyErrorMessage.innerText = "Urgency must be between 0 to 9";
        return false;
    } else {
        taskUrgencyErrorMessage.innerText = "";
    }

    if (!validateRadioButton("department", "userDepartmentErrorMessage", "Department must be chosen")) {
        return false;
    }

    return true;
}