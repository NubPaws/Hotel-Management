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
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";

const TasksScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const DEPARTMENT_OPTIONS = ["General", "FrontDesk", "HouseKeeping", "Maintenance", "FoodAndBeverage", "Security", "Concierge"]
    const [department, setDepartment] = useState<Department | undefined>(userCredentials.department);
    const { tasks, loading, update } = useFetchTasksByDepartment(userCredentials.token, department);

    const [showModal] = useModalError();
    const [showErrorPopup, showInfoPopup] = usePopup();
    
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

    const changeStatus = async (taskId: number, status: string) => {
        const url = `api/Tasks/${taskId}`;

        try {
            const res = await makeRequest(url, "POST", "json", {
                taskId: taskId,
                status: status,
            }, userCredentials.token);

            if (res.ok) {
                showInfoPopup(`Successfully updated task state to ${status}`);
                update();
            }
        } catch (error) {
            if (error instanceof FetchError) {
                showErrorPopup("Error connecting to the server");
            }
            if (error instanceof RequestError) {
				showModal("General Error Occurred", error.message);
            }
        }
    }

    const changeDepartment = async (taskId: number, newDepartment: string) => {
        const url = `api/Tasks/${taskId}`;

        try {
            const res = await makeRequest(url, "POST", "json", {
                taskId: taskId,
                department: newDepartment,
            }, userCredentials.token);

            if (res.ok) {
                showInfoPopup(`Successfully moved the task to ${newDepartment}`);
                update();
            }
        } catch (error) {
            if (error instanceof FetchError) {
                showErrorPopup("Error connecting to the server");
            }
            if (error instanceof RequestError) {
				showModal("General Error Occurred", error.message);
            }
        }
    }

    const onRemove = async (taskId: number) => {
		const url = `api/Tasks/remove/${taskId}`;

		try {
			const res = await makeRequest(url, "POST", "text", "", userCredentials.token);

			if (res.status === 401) {
				showModal("Insufficient permissions", "Only administrators can remove tasks.");
				return;
			}

			showInfoPopup(`Successfully deleted task`);
		} catch (error: any) {
			showModal("Request error has occurred", error.message);
		}
	};

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
            <ul className="task-entry-list-wrapper">
                {tasks.map((task) => (
                    <TaskEntry
                        key={task.taskId}
                        task={task}
                        changeStatus={changeStatus}
                        changeDepartment={changeDepartment}
                        onRemove={onRemove}
                    />
                ))}
            </ul>
        )}
    </>;
}

export default TasksScreen;