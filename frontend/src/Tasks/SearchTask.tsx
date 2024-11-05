import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import { CenteredLabel } from "../UIElements/CenteredLabel";
import { Input } from "../UIElements/Input";
import { Button } from "../UIElements/Button";
import { authorizedGetRequest } from "../APIRequests/APIRequests";
import { Modal } from "../UIElements/Modal";

export function SearchTaskByIdScreen(props: AuthenticatedUserProps) {
    const [showTaskNotFound, setShowTaskNotFound] = useState(false);
    const [task, setTask] = useState<Task>();

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return (
        <>
            <NavigationBar></NavigationBar>
            <CenteredLabel labelName="Search task by Id"></CenteredLabel>
            <form id="taskSearchByIdForm" className="fieldsContainer" action="http://localhost:8000/api/Tasks/">
                <Input id="taskId" className="field" type="number" name="taskId"
                    placeholder="Enter task Id" errorMessageId="taskIdErrorMessage">
                    Task Id
                </Input>
                <Button
                    className="fieldLabel"
                    bgColor="white"
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
            <Modal title="Task not found" show={showTaskNotFound} onClose={() => { setShowTaskNotFound(false) }}>
                <h5>Failed to find the specified task.</h5>
            </Modal>
            {task !== undefined && (
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
        </>
    )
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

export function TaskEntry(task: Task) {
    return (
        <div className="fieldsContainer">
            <p>Task Id: {task.taskId}</p>
            <p>Task created at: {task.timeCreated.toLocaleString()}</p>
            <p>Task assigned room: {task.room}</p>
            <p>Task description: {task.description}</p>
            <p>Task urgency: {task.urgency}</p>
            <p>Task department: {task.department}</p>
            <p>Task creator: {task.creator}</p>
            <p>Task status: {task.status}</p>
            {task.history.length > 0 && (
                <div>
                    <p>History:</p>
                    <ul>
                        {task.history.map((event, index) => (
                            <li key={index}>{event}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}