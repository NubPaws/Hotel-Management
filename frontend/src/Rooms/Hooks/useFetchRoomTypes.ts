import { useEffect, useState } from "react";
import { useModalError } from "../../Utils/Contexts/ModalErrorContext";
import { FetchError, makeRequest, RequestError } from "../../APIRequests/APIRequests";
import { RoomType } from "../../APIRequests/ServerData";
import usePopup from "../../Utils/Contexts/PopupContext";

type UseFetchRoomTypesResult = {
	roomTypes: string[];
    typesDescription: string[];
	loading: boolean;
    update: () => void;
};

const useFetchRoomTypes = (token: string | null): UseFetchRoomTypesResult => {
	const [roomTypes, setRoomTypes] = useState<string[]>([]);
    const [typesDescription, setTypesDescription] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
    const [updater, setUpdater] = useState(false);
	
	const [showModal] = useModalError();
	const [showErrorPopup] = usePopup();
	
	useEffect(() => {
		if (!token) {
			return;
		}
		
		const fetchRoomTypes = async () => {
            try {
                const res = await makeRequest("api/Rooms/types", "GET", "text", "", token);
                
                const data: RoomType[] = await res.json();
                setRoomTypes(data.map(val => val.code));
                setTypesDescription(data.map(val => val.description));
            } catch (error) {
                if (error instanceof FetchError) {
                    showErrorPopup("Failed to fetch room types from server.");
                }
                if (error instanceof RequestError) {
                    showModal("Failed to fetch room types.", "Invalid error occurred, contact makers.");
                }
            } finally {
                setLoading(false);
            }
        };
		
		fetchRoomTypes();
	}, [token, showErrorPopup, showModal, updater]);
	
    const update = () => {
        setUpdater(!updater);
    };
    
	return { roomTypes, typesDescription, loading, update };
}

export default useFetchRoomTypes;
