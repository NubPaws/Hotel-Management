import { useEffect, useState } from "react";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Forms/Input";
import { Button } from "../UIElements/Button";
import Modal from "../UIElements/Modal";
import { authorizedPostRequestWithoutBody } from "../APIRequests/APIRequests";

export function RemoveTaskScreen(props: AuthenticatedUserProps) {
    const [showTaskRemovalMessage, setShowTaskRemovalMessage] = useState(false);
    const [showTaskRemovalErrorMessage, setShowTaskRemovalErrorMessage] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.role !== "Admin") {
            navigate("/login");
        }
    }, [props.userCredentials, navigate]);

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Remove task"></CenteredLabel>
            <form id="taskRemoveForm" className="fieldsContainer" action="http://localhost:8000/api/Tasks/remove/">
                <Input id="taskId" className="field" type="number" name="taskId"
                    placeholder="Enter task Id" errorMessageId="taskIdErrorMessage">
                    Task Id
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => removeTask(event,
                        props.userCredentials.token,
                        props.setShowConnectionErrorMessage,
                        setShowTaskRemovalMessage,
                        setShowTaskRemovalErrorMessage
                    )}>
                    Remove task
                </Button>
            </form>
            <Modal title="Task removal success" show={showTaskRemovalMessage} onClose={() => { setShowTaskRemovalMessage(false) }}>
                <h5>Task successfully removed.</h5>
            </Modal>
            <Modal title="Task removal error" show={showTaskRemovalErrorMessage} onClose={() => { setShowTaskRemovalErrorMessage(false) }}>
                <h5>Failed to remove task.</h5>
            </Modal>
        </>
    )
}

async function removeTask(event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowTaskRemovalMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowTaskRemovalErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    let taskIdInput = document.getElementById("taskId") as HTMLInputElement;
    let taskIdErrorMessage = document.getElementById("taskIdErrorMessage") as HTMLInputElement;
    let taskRemoveForm = document.getElementById("taskRemoveForm") as HTMLFormElement;
    let url = taskRemoveForm.action + taskIdInput.value;

    if (taskIdInput.value === "") {
        taskIdErrorMessage.innerText = "Task Id must be filled";
        return;
    } else {
        taskIdErrorMessage.innerText = "";
    }

    let res = await authorizedPostRequestWithoutBody(token, url, setShowConnectionErrorMessage);
    if (res === null) {
        return;
    }
    let status = res.status;
    if (status === 200) {
        setShowTaskRemovalMessage(true);
    } else {
        setShowTaskRemovalErrorMessage(true);
    }
}

