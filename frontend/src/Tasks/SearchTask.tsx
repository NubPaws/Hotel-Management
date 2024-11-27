import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import Button from "../UIElements/Buttons/Button";
import { authorizedGetRequest } from "../APIRequests/APIRequests";
import Modal from "../UIElements/Modal";
import { validateRadioButton } from "../Users/Validation";
import { Task } from "../APIRequests/ServerData";

export function SearchTaskByIdScreen(props: AuthenticatedUserProps) {
    const [showTaskNotFound, setShowTaskNotFound] = useState(false);
    const [task, setTask] = useState<Task>();

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return <>
        <CenteredLabel>Search task by Id</CenteredLabel>
        <form id="taskSearchByIdForm" className="fieldsContainer" action="http://localhost:8000/api/Tasks/">
            <Input
                id="taskId"
                label="Task Id"
                type={InputType.Number}
                placeholder="Enter task Id"
            />
            <Button
                className="fieldLabel"
                backgroundColor="white"
                textColor="black"
                borderWidth="1px"
                onClick={(event) => searchTaskById(event,
                    props.userCredentials.token,
                    setTask,
                    setShowTaskNotFound
                )}>
                Search task
            </Button>
        </form>
        {showTaskNotFound && (
            <Modal title="Task not found" onClose={() => { setShowTaskNotFound(false) }}>
                Failed to find the specified task.
            </Modal>
        )}
        {task && (
            <TaskEntry
                taskId={task.taskId}
                timeCreated={task.timeCreated}
                room={task.room}
                description={task.description}
                urgency={task.urgency}
                department={task.department}
                creator={task.creator}
                status={task.status}
                history={task.history}>
            </TaskEntry>
        )}
    </>;
}

async function searchTaskById(event: any,
    token: string,
    setTask: React.Dispatch<React.SetStateAction<Task | undefined>>,
    setShowTaskNotFound: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    let taskIdInput = document.getElementById("taskId") as HTMLInputElement;
    let taskIdErrorMessage = document.getElementById("taskIdErrorMessage") as HTMLInputElement;
    let taskSearchByIdForm = document.getElementById("taskSearchByIdForm") as HTMLFormElement;
    let url = taskSearchByIdForm.action + taskIdInput.value;

    if (taskIdInput.value === "") {
        taskIdErrorMessage.innerText = "Task Id must be filled";
        return;
    } else {
        taskIdErrorMessage.innerText = "";
    }

    let res = await authorizedGetRequest(url, token);
    if (res === null) {
        return;
    }

    let status = res.status;
    if (status === 200) {
        let task = await res.json()
        task.timeCreated = new Date(task.timeCreated);
        setTask(task);
    } else {
        setShowTaskNotFound(true);
        setTask(undefined);
    }
    taskIdInput.value = "";
}
