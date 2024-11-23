import { Task } from "../../APIRequests/ServerData";

type TaskEntryProps = {
    task: Task;
};

const TaskEntry: React.FC<TaskEntryProps> = ({
    task
}) => {
    const { taskId, timeCreated, room, description, urgency, department, creator, status } = task;
    return <>
        <div>
            <p>Task Id: {taskId}</p>
            <p>Task created at: {timeCreated.toLocaleDateString()}</p>
            <p>Task assigned room: {room}</p>
            <p>Task description: {description}</p>
            <p>Task urgency: {urgency}</p>
            <p>Task department: {department}</p>
            <p>Task creator: {creator}</p>
            <p>Task status: {status}</p>
        </div>
    </>;
}

export default TaskEntry;