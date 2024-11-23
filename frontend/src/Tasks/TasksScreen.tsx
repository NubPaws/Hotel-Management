import { useNavigate } from "react-router-dom";
import IconButton from "../UIElements/Buttons/IconButton";
import CenteredLabel from "../UIElements/CenteredLabel";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { ScreenProps } from "../Utils/Props";
import plusIcon from "../assets/plus-icon.svg";
import useFetchTasksByDepartment from "./Hooks/useFetchTasksByDepartment";
import TaskEntry from "./Elements/TaskEntry";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";
import Dropdown from "../UIElements/Dropdown";
import { useState } from "react";
import { Department } from "../APIRequests/ServerData";

const TasksScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const DEPARTMENT_OPTIONS = ["General", "FrontDesk", "HouseKeeping", "Maintenance", "FoodAndBeverage", "Security", "Concierge"]
    const [department, setDepartment] = useState<Department | undefined>(userCredentials.department);
    const { tasks, loading, update } = useFetchTasksByDepartment(userCredentials.token, department);
    const navigate = useNavigate();

    if (loading) {
        return <p>Loading room types.</p>;
    }

    const updateTasks = async (newDepartment: string) => {
        const allowedValues: Department[] = ["General", "FrontDesk", "HouseKeeping", "Maintenance", "FoodAndBeverage", "Security", "Concierge"];

        if (allowedValues.includes(newDepartment as Department)) {
            setDepartment(newDepartment as Department);
        }
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
        <SearchableDropdown
                id="tasks-screen-departments"
                label="Department"
                options={DEPARTMENT_OPTIONS}
                setValue={(value) => updateTasks(value)}
            />
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