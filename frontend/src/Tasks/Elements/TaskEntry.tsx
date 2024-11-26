import { useState } from "react";
import { Task } from "../../APIRequests/ServerData";
import Dropdown from "../../UIElements/Dropdown";
import "./TaskEntry.css"
import Modal from "../../UIElements/Modal";
import Button from "../../UIElements/Buttons/Button";

const STATUS_OPTIONS = ["Pending", "Progress", "Finished"];
const DEPARTMENT_OPTIONS = ["General", "FrontDesk", "HouseKeeping", "Maintenance", "FoodAndBeverage", "Security", "Concierge"];

type TaskEntryProps = {
    task: Task;
    changeStatus: (taskId: number, newStatus: string) => void;
    changeDepartment: (taskId: number, newDepartment: string) => void;
    onRemove: (taskId: number) => void;
};

const TaskEntry: React.FC<TaskEntryProps> = ({
    task, changeStatus, changeDepartment, onRemove
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { taskId, timeCreated, room, description, urgency, department, creator, status } = task;
    return <>
        <div className="task-entry">
            <div className="task-entry-urgency">Level: {urgency}
                <Button
                    onClick={() => setConfirmDelete(true)}
                    backgroundColor="#f9f9f9;">
                    X
                </Button>
            </div>
            <div>{timeCreated.toLocaleDateString()}</div>
            <div className="task-entry-room">Room: {room}
                <Dropdown
                    options={STATUS_OPTIONS}
                    defaultOption={status}
                    onChange={(newStatus) => changeStatus(taskId, newStatus)} />
            </div>
            <div className="task-entry-description">{description}</div>
            <div>
                <Dropdown
                    options={DEPARTMENT_OPTIONS}
                    defaultOption={department}
                    onChange={(newDepartment) => changeDepartment(taskId, newDepartment)} />
            </div>
            <div>History</div>
        </div>
        {confirmDelete && (
            <Modal
                title="Confirm Delete"
                onClose={() => setConfirmDelete(false)}
                onAccept={() => { onRemove(taskId); setConfirmDelete(false); }}
            >
                Are you sure you want to delete?
            </Modal>
        )}
    </>;
}

export default TaskEntry;