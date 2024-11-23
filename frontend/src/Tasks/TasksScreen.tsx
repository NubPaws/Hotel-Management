import { useNavigate } from "react-router-dom";
import IconButton from "../UIElements/Buttons/IconButton";
import CenteredLabel from "../UIElements/CenteredLabel";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { ScreenProps } from "../Utils/Props";
import plusIcon from "../assets/plus-icon.svg";
import useFetchTasksByDepartment from "./Hooks/useFetchTasksByDepartment";
import TaskEntry from "./Elements/TaskEntry";

const TasksScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const {tasks, loading, update} = useFetchTasksByDepartment(userCredentials.token, userCredentials.department);

    const navigate = useNavigate();

    if (loading) {
        return <p>Loading room types.</p>;
    }


    return <>
        <CenteredLabel>Tasks</CenteredLabel>
        <IconButton
            className="tasks-add-btn"
            iconUrl={plusIcon}
            onClick={() => navigate("/tasks/add")}
        >
            Add Task
        </IconButton>
        {tasks && (
                <ul>
                    {tasks.map((task) => (
                        <TaskEntry
                            key={task.taskId}
                            task={task}
                        />
                    ))}
                </ul>
            )}
    </>;
}

export default TasksScreen;