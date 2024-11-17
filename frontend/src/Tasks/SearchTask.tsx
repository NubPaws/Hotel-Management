import { useNavigate } from "react-router-dom";
import { AuthenticatedUserProps } from "../Utils/Props";
import { useEffect, useState } from "react";
import { NavigationBar } from "../UIElements/NavigationBar";
import CenteredLabel from "../UIElements/CenteredLabel";
import Input, { InputType } from "../UIElements/Forms/Input";
import { Button } from "../UIElements/Buttons/Button";
import { authorizedGetRequest } from "../APIRequests/APIRequests";
import Modal from "../UIElements/Modal";
import { validateRadioButton } from "../Authentication/Validation";
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
        <NavigationBar />
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

export function SearchTaskByDepartmentScreen(props: AuthenticatedUserProps) {
    const [showTasksNotFound, setShowTasksNotFound] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    const navigate = useNavigate();
    useEffect(() => {
        if (props.userCredentials.username === "") {
            navigate("/home");
        }
    }, [props.userCredentials, navigate]);

    return (
        <>
            <NavigationBar />
            <CenteredLabel>Search task by department</CenteredLabel>
            <form id="taskSearchByDepartmentForm" className="fieldsContainer" action="http://localhost:8000/api/Tasks/department/">
                {/* <UserDepartmentRadioButton></UserDepartmentRadioButton> */}
                <Button
                    className="fieldLabel"
                    backgroundColor="white"
                    textColor="black"
                    borderWidth="1px"
                    onClick={(event) => searchTaskByDepartment(event,
                        props.userCredentials.token,
                        setTasks,
                        setShowTasksNotFound
                    )}>
                    Search task
                </Button>
            </form>
            {showTasksNotFound && (
                <Modal title="Tasks not found" onClose={() => { setShowTasksNotFound(false) }}>
                    There are no tasks under the selected department.
                </Modal>
            )}
            {tasks.length > 0 && (
                <ul>
                    {tasks.map((task) => (
                        <TaskEntry
                            key={task.taskId}
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
                    ))}
                </ul>
            )}
        </>
    )
}

async function searchTaskByDepartment(event: any,
    token: string,
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    setShowTasksNotFound: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    if (!validateRadioButton("department", "userDepartmentErrorMessage", "Role must be chosen")) {
        return;
    }

    let userDepartment = null // TODO: getUserDepartment();
    if (userDepartment === null) {
        return;
    }
    let taskSearchByDepartmentForm = document.getElementById("taskSearchByDepartmentForm") as HTMLFormElement;
    let url = taskSearchByDepartmentForm.action // TODO: + userDepartment.value;

    let res = await authorizedGetRequest(url, token);
    if (res === null) {
        return;
    }

    let status = res.status;
    if (status === 200) {
        let tasks = await res.json();
        if (tasks.length === 0) {
            setShowTasksNotFound(true);
            return;
        }
        const parsedTasks = tasks.map((task: Task) => ({
            ...task,
            timeCreated: new Date(task.timeCreated)
        }));
        setTasks(parsedTasks);
    }
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