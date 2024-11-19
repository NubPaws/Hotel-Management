import { useEffect, useState } from "react";
import { useModalError } from "../../Utils/Contexts/ModalErrorContext";
import { usePopupError } from "../../Utils/Contexts/PopupErrorContext";
import { FetchError, makeRequest, RequestError } from "../../APIRequests/APIRequests";
import { RoomType } from "../../APIRequests/ServerData";

type UseFetchRoomTypesResult = {
	roomTypes: string[];
	loading: boolean;
};

const useFetchRoomTypes = (token: string | null): UseFetchRoomTypesResult => {
	const [roomTypes, setRoomTypes] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	
	const [showModal] = useModalError();
	const [showErrorPopup] = usePopupError();
	
	useEffect(() => {
		if (!token) {
			return;
		}
		
		const fetchRoomTypes = async () => {
            try {
                const res = await makeRequest("api/Rooms/types", "GET", "text", "", token);
                
                const data: RoomType[] = await res.json();
                setRoomTypes(data.map(val => val.code));
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
	}, [token, showErrorPopup, showModal]);
	
	return { roomTypes, loading };
}

export default useFetchRoomTypes;
