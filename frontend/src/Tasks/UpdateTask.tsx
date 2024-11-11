import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import Input from "../UIElements/Forms/Input";
import { Button } from "../UIElements/Button";
import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";
import Modal from "../UIElements/Modal";

export function UpdateTaskScreen(props: AuthenticatedUserProps) {
    const [showTaskUpdatedMessage, setShowTaskUpdatedMessage] = useState(false);
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
            <CenteredLabel labelName="Update task"></CenteredLabel>
            <form id="taskUpdateForm" className="fieldsContainer" action="http://localhost:8000/api/Tasks/">
                <Input id="taskId" className="field" type="number" name="taskId"
                    placeholder="Enter task Id" errorMessageId="taskIdErrorMessage">
                    Task Id
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
                <div className="taskStatusContainer">
                    <p>Select task status:</p>
                    <input type="radio" id="Pending" name="taskStatus" value="Pending"></input>
                    <label htmlFor="Pending">Pending</label>
                    <br></br>

                    <input type="radio" id="Progress" name="taskStatus" value="Progress"></input>
                    <label htmlFor="Progress">Progress</label>
                    <br />

                    <input type="radio" id="Finished" name="taskStatus" value="Finished"></input>
                    <label htmlFor="Finished">Finished</label>
                    <br />
                </div>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => updateTask(event,
                        props.userCredentials.token,
                        props.setShowConnectionErrorMessage,
                        setShowTaskUpdatedMessage,
                        setShowInvalidInputErrorMessage
                    )}>
                    Create task
                </Button>
            </form>
            <Modal title="Invalid input in task update" show={showInvalidInputErrorMessage} onClose={() => { setShowInvalidInputErrorMessage(false) }}>
                <h5>Invalid input was inserted in task update form.</h5>
            </Modal>
            <Modal title="Task update success" show={showTaskUpdatedMessage} onClose={() => { setShowTaskUpdatedMessage(false) }}>
                <h5>Succeeded in updating task.</h5>
            </Modal>
        </>
    )
}

async function updateTask(event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowTaskUpdatedMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowInvalidInputErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    if (!validateUpdateTask()) {
        return;
    }

    let taskIdInput = document.getElementById("taskId") as HTMLInputElement;
    let taskDescriptionInput = document.getElementById("taskDescription") as HTMLInputElement;
    let taskUrgencyInput = document.getElementById("taskUrgency") as HTMLInputElement;

    let taskUpdateForm = document.getElementById("taskUpdateForm") as HTMLFormElement;
    let url = taskUpdateForm.action + taskIdInput.value;

    const userDepartment: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="department"]');
    let userDepartmentIndex = -1;

    for (let i = 0; i < userDepartment.length; i++) {
        if (userDepartment[i].checked) {
            userDepartmentIndex = i;
        }
    }

    let selectedDepartment = userDepartmentIndex > -1 ? userDepartment[userDepartmentIndex].value : ""

    let taskUpdateData = {
        "description": taskDescriptionInput.value,
        "urgency": taskUrgencyInput.value,
        "department": selectedDepartment ,
        "status": "Progress"
    }

    let res = await authorizedPostRequestWithBody(token, JSON.stringify(taskUpdateData), url, setShowConnectionErrorMessage);
    if (res === null) {
        return;
    }
    let status = res.status;
    if (status === 200) {
        setShowTaskUpdatedMessage(true);
        // Clearing the form
        taskIdInput.value = "";
        taskDescriptionInput.value = "";
        taskUrgencyInput.value = "";
        if (userDepartmentIndex > -1) {
            userDepartment[userDepartmentIndex].checked = false;
        }
    } else if (status === 400) {
        setShowInvalidInputErrorMessage(true);
    }

}

function validateUpdateTask() {
    let taskIdInput = document.getElementById("taskId") as HTMLInputElement;
    let taskIdErrorMessage = document.getElementById("taskIdErrorMessage") as HTMLInputElement;

    let taskUrgencyInput = document.getElementById("taskUrgency") as HTMLInputElement;
    let taskUrgencyErrorMessage = document.getElementById("taskUrgencyErrorMessage") as HTMLInputElement;

    if (taskIdInput.value === "") {
        taskIdErrorMessage.innerText = "Task Id must be filled";
        return false;
    } else {
        taskIdErrorMessage.innerText = "";
    }

    if (taskUrgencyInput.value !== "") {
        if (Number(taskUrgencyInput.value) < 0 || Number(taskUrgencyInput.value) > 9) {
            taskUrgencyErrorMessage.innerText = "Urgency must be between 0 to 9";
            return false;
        } else {
            taskUrgencyErrorMessage.innerText = "";
        }
    }

    return true;
}