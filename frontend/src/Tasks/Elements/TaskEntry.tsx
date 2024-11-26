import { Task } from "../../APIRequests/ServerData";
import Dropdown from "../../UIElements/Dropdown";
import "./TaskEntry.css"

const STATUS_OPTIONS = ["Pending", "Progress", "Finished"];
const DEPARTMENT_OPTIONS = ["General", "FrontDesk", "HouseKeeping", "Maintenance", "FoodAndBeverage", "Security", "Concierge"];

type TaskEntryProps = {
    task: Task;
    changeStatus: (taskId: number, newStatus: string) => void;
    changeDepartment: (taskId: number, newDepartment: string) => void;
};

const TaskEntry: React.FC<TaskEntryProps> = ({
    task, changeStatus, changeDepartment
}) => {
    const { taskId, timeCreated, room, description, urgency, department, creator, status } = task;
    return <>
        <div className="task-entry">
            <div>{timeCreated.toLocaleDateString()}</div>
            <div>{room}</div>
            <div>{description}</div>
            <div>{urgency}</div>
            <div>{creator}</div>
            <div>
                <Dropdown
                    options={DEPARTMENT_OPTIONS}
                    defaultOption={department}
                    onChange={(newDepartment) => changeDepartment(taskId, newDepartment)} />
            </div>
            <div>
                <Dropdown
                    options={STATUS_OPTIONS}
                    defaultOption={status}
                    onChange={(newStatus) => changeStatus(taskId, newStatus)} />
            </div>
            <div>History</div>
        </div>
    </>;
}

export default TaskEntry;