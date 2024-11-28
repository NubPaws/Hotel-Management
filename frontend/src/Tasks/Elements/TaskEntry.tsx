import { useState } from "react";
import { Task } from "../../APIRequests/ServerData";
import Dropdown from "../../UIElements/Dropdown";
import Modal from "../../UIElements/Modal";
import Button from "../../UIElements/Buttons/Button";
import InputModal, { InputModalField } from "../../UIElements/InputModal";
import { InputType } from "../../UIElements/Forms/Input";
import IconButton from "../../UIElements/Buttons/IconButton";
import editIcon from "../../assets/edit.svg";

import "./TaskEntry.css";

const STATUS_OPTIONS = ["Pending", "Progress", "Finished"];
const DEPARTMENT_OPTIONS = ["General", "FrontDesk", "Housekeeping", "Maintenance", "FoodAndBeverage", "Security", "Concierge"];

type TaskEntryProps = {
    task: Task;
    changeStatus: (taskId: number, newStatus: string) => void;
    changeDepartment: (taskId: number, newDepartment: string) => void;
    onRemove: (taskId: number) => void;
    onEdit: (taskId: number, urgency: number, description: string) => void;
};

const TaskEntry: React.FC<TaskEntryProps> = ({
    task, changeStatus, changeDepartment, onRemove, onEdit
}) => {
    const { taskId, timeCreated, room, description, urgency, department, status, history } = task;

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [editTaskFields, setEditTaskFields] = useState<InputModalField[] | undefined>(undefined);

    const hideEditTaskModal = () => setEditTaskFields(undefined);

    const showEditTaskModal = () => setEditTaskFields([
        { name: "urgency", label: "Urgency", type: InputType.Number, placeholder: `${urgency}` },
        { name: "description", label: "Description", type: InputType.Text, placeholder: description },
    ]);

    const onConfirm = (formData: Record<string, any>) => {
        const newUrgency = formData["urgency"] ? formData["urgency"] as number : urgency;
        const newDescription = formData["description"] ? formData["description"] as string : description;

        onEdit(taskId, newUrgency, newDescription);
        hideEditTaskModal();
    }

    return <>
    <div className="task-entry">
    <div className="task-entry-main-body">
        <div className="task-entry-general-info">
            <span className="task-entry-date">{timeCreated.toLocaleDateString()}</span>
            <span className="task-entry-room">Room {room}</span>
            <span className="task-entry-description">{description}</span>
            
            <div className="task-entry-dropdowns">
            <span>Status: </span>
                <Dropdown
                    options={STATUS_OPTIONS}
                    defaultOption={status}
                    onChange={(newStatus) => changeStatus(taskId, newStatus)}
                />
            </div>
            <div className="task-entry-dropdowns">
                <span>Department: </span>
                <Dropdown
                    options={DEPARTMENT_OPTIONS}
                    defaultOption={department}
                    onChange={(newDepartment) => changeDepartment(taskId, newDepartment)}
                />
            </div>
            
        </div>
        
        <div className="task-entry-controls">
            <div className="up">
                <span className="task-entry-urgency">Level: {urgency}</span>
                <Button onClick={() => setConfirmDelete(true)}>X</Button>
            </div>
            
            <div className="down">
                <IconButton
                    className="task-entry-edit-btn"
                    iconUrl={editIcon}
                    onClick={showEditTaskModal}
                    fontSize="14pt"
                >
                    Edit
                </IconButton>
                <Button
                    textSize="14pt"
                    onClick={() => setShowHistory(prev => !prev)}
                >
                    {showHistory ? "Hide" : "Show"} History
                </Button>
            </div>
        </div>
    </div>
    
    <div className={`task-entry-history ${showHistory ? "visible" : ""}`}>
        {history && history.length > 0 && (
            history.map((value, index) => (
                <div key={index} className="task-history-entry">
                    {value.replace(/\=\>/g, "→")}
                </div>
            ))
        )}
    </div>
    
    </div>
    {editTaskFields && (
        <InputModal
            fields={editTaskFields}
            title={"Edit task"}
            onConfirm={onConfirm}
            onCancel={hideEditTaskModal}
        />
    )}
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