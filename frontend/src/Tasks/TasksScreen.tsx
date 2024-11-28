import { useNavigate } from "react-router-dom";
import IconButton from "../UIElements/Buttons/IconButton";
import CenteredLabel from "../UIElements/CenteredLabel";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { ScreenProps } from "../Utils/Props";
import plusIcon from "../assets/plus-icon.svg";
import useFetchTasksByDepartment from "./Hooks/useFetchTasksByDepartment";
import TaskEntry from "./Elements/TaskEntry";
import SearchableDropdown from "../UIElements/Forms/SearchableDropdown";
import { useState } from "react";
import { Department } from "../APIRequests/ServerData";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";
import { FetchError, makeRequest, RequestError } from "../APIRequests/APIRequests";
import DateInput from "../UIElements/Forms/DateInput";
import { getTodaysDateRelativeTo } from "../Utils/DateConverter";
import MenuGridLayout from "../UIElements/MenuGridLayout";

import "./TasksScreen.css";

const WEEK_AGO = -7;

const TasksScreen: React.FC<ScreenProps> = ({
    userCredentials,
}) => {
    useUserRedirect(userCredentials);

    const DEPARTMENT_OPTIONS = ["General", "FrontDesk", "Housekeeping", "Maintenance", "FoodAndBeverage", "Security", "Concierge"]
    const [department, setDepartment] = useState<Department | undefined>(userCredentials.department);
    const [startDate, setStartDate] = useState(getTodaysDateRelativeTo(WEEK_AGO));
    const { tasks, loading, update } = useFetchTasksByDepartment(userCredentials.token, department, startDate);

    const [showModal] = useModalError();
    const [showErrorPopup, showInfoPopup] = usePopup();

    const navigate = useNavigate();

    if (loading) {
        return <p>Loading room types.</p>;
    }

    const updateDepartment = async (newDepartment: string) => {
        const allowedValues: Department[] = ["General", "FrontDesk", "Housekeeping", "Maintenance", "FoodAndBeverage", "Security", "Concierge"];

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

    const onEdit = async (taskId: number, urgency: number, description: string) => {
        const url = `api/Tasks/${taskId}`;

        if (urgency > 9 || urgency < 0) {
            showModal("Invalid urgency", "Urgency must be between 0 and 9");
            return;
        }

        try {
            const res = await makeRequest(url, "POST", "json", {
                urgency: urgency,
                description: description,
            }, userCredentials.token);

            if (res.ok) {
                showInfoPopup(`Successfully updated task`);
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

    return <>
        <IconButton
            className="tasks-add-btn"
            iconUrl={plusIcon}
            onClick={() => navigate("/tasks/add")}
        >
            Add Task
        </IconButton>
        <CenteredLabel>Tasks</CenteredLabel>
        <MenuGridLayout>
            <SearchableDropdown
                id="tasks-screen-departments"
                label="Department"
                options={DEPARTMENT_OPTIONS}
                setValue={(value) => updateDepartment(value)}
            />
            <DateInput
                className="task-start-date"
                id="task-screen-start-date"
                label="Task start date"
                value={startDate}
                onChange={(d) => setStartDate(d)}
            />
        </MenuGridLayout>
        {tasks && tasks.length > 0 && (
            <div>
                {tasks.map((task) => (
                    <TaskEntry
                        key={task.taskId}
                        task={task}
                        changeStatus={changeStatus}
                        changeDepartment={changeDepartment}
                        onRemove={onRemove}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        )}
    </>;
}

export default TasksScreen;