import { useState } from "react";
import { Task } from "../../APIRequests/ServerData";
import Dropdown from "../../UIElements/Dropdown";
import "./TaskEntry.css"
import Modal from "../../UIElements/Modal";
import Button from "../../UIElements/Buttons/Button";
import HistoryEntry from "./HistoryEntry";
import InputModal, { InputModalField } from "../../UIElements/InputModal";
import { InputType } from "../../UIElements/Forms/Input";
import IconButton from "../../UIElements/Buttons/IconButton";
import editIcon from "../../assets/edit.svg";

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
    const { taskId, timeCreated, room, description, urgency, department, creator, status, history } = task;

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
            <IconButton
				iconUrl={editIcon}
				onClick={showEditTaskModal}
				fontSize="18pt"
			/>
            <Button
                borderRadius="5px"
                borderWidth="2px"
                textSize="14pt"
                onClick={() => setShowHistory(prev => !prev)}
            >
                {showHistory ? "Hide" : "Show"} History
            </Button>
            <div className={`task-entry-history ${showHistory ? "visible" : ""}`}>
                {history && history.length > 0 && (
                    history.map((value, index) => <HistoryEntry key={index} event={value} />)
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