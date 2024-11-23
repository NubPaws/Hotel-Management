import { useEffect, useState } from "react";
import { useModalError } from "../../Utils/Contexts/ModalErrorContext";
import usePopup from "../../Utils/Contexts/PopupContext";
import { FetchError, makeRequest, RequestError } from "../../APIRequests/APIRequests";
import { Task } from "../../APIRequests/ServerData";

type UseFetchTasksByDepartmentResult = {
    tasks: Task[];
    loading: boolean;
    update: () => void;
};

const useFetchTasksByDepartment = (token: string | null, department: string | null): UseFetchTasksByDepartmentResult => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [loading, setLoading] = useState(true);
    const [updater, setUpdater] = useState(false);

    const [showModal] = useModalError();
    const [showErrorPopup] = usePopup();

    useEffect(() => {
        if (!token || !department) {
            return;
        }

        const fetchTasks = async () => {
            try {
                const url = "api/Tasks/department/" + department;
                const res = await makeRequest(url, "GET", "text", "", token);

                const data: Task[] = await res.json();
                const parsedTasks = data.map((task: Task) => ({
                    ...task,
                    timeCreated: new Date(task.timeCreated)
                }));
                setTasks(parsedTasks);
            } catch (error) {
                if (error instanceof FetchError) {
                    showErrorPopup("Failed to fetch tasks from server.");
                }
                if (error instanceof RequestError) {
                    showModal("Failed to fetch tasks.", "Invalid error occurred, contact makers.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [token, showErrorPopup, showModal, updater]);

    const update = () => {
        setUpdater(!updater);
    };

    return { tasks, loading, update};
}

export default useFetchTasksByDepartment;