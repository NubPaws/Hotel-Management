import { FC, useCallback } from "react";
import { Reservation } from "../../APIRequests/ServerData";

import "./ReservationEntry.css";
import Button from "../../UIElements/Buttons/Button";
import { useNavigate } from "react-router-dom";

type ReservationEntryProps = {
	reservation: Reservation;
};

const ReservationEntry: FC<ReservationEntryProps> = ({
	reservation
}) => {
	
	const navigate = useNavigate();
	
	const {
		reservationId, comment, startDate, startTime, nightCount,
		endTime, endDate, state, guestName,
	} = reservation;
	
	const formatDate = useCallback((date: Date) => {
		const year = `${date.getFullYear()}`.padStart(4, "0");
		const month = `${date.getMonth() + 1}`.padStart(2, "0");
		const day = `${date.getDay()}`.padStart(2, "0");
		
		return `${day}/${month}/${year}`;
	}, []);
	
	return <div className="reservation-entry-fields-container">
		<p className="reservation-entry-id">ID: {reservationId}</p>
		<div className="reservation-entry-date">
			<div className="reservation-entry-date-label">
				<p>From:</p>
				<p>To:</p>
			</div>
			<div className="reservation-entry-date-value">
				<p>{formatDate(startDate)} {startTime}</p>
				<p>{formatDate(endDate)} {endTime}</p>
			</div>
		</div>
		<p>{guestName}</p>
		<p>{nightCount} {nightCount > 1 ? "nights" : "night"}</p>
		<p>{state}</p>
		<p className="reservation-entry-comment">{comment}</p>
		<Button
			className="reservation-entry-update-btn"
			onClick={() => navigate(`/reservations/edit?id=${reservationId}`)}
		>
			Edit
		</Button>
	</div>;
};


export default ReservationEntry;
