import { useEffect, useState } from 'react';
import { Reservation } from '../../APIRequests/ServerData';
import { useModalError } from '../../Utils/Contexts/ModalErrorContext';
import { FetchError, makeRequest, RequestError } from '../../APIRequests/APIRequests';

const useFetchReservationInfo = (token: string | null, reservationId: number): Reservation | undefined => {
	const [reservation, setReservation] = useState<Reservation | undefined>(undefined);
	
	const [showModal] = useModalError();
	
	useEffect(() => {
		if (!token) {
			return;
		}
		
		makeRequest(`api/Reservations/${reservationId}`, "GET", "text", "", token)
            .then(res => {
                handleResponse(res);
            })
            .catch(error => {
                if (error instanceof FetchError) {
                    showModal("Connection error occured", error.message);
                }
                if (error instanceof RequestError) {
                    showModal("General Error Occurred",error.message);
                }
            });
	}, []);
	
	const handleResponse = async (res: Response) => {
		if (!res.ok) {
			return;
		}
		
		const result = await res.json();
		setReservation({
			...result,
			reservationMade: new Date(result.reservationMade),
			startDate: new Date(result.startDate),
			endDate: new Date(result.endDate),
		});
	};
	
	return reservation;
};

export default useFetchReservationInfo;
