import { FC } from "react";
import { Reservation } from "../APIRequests/ServerData";

import "./ReservationEntry.css";

const ReservationEntry: FC<Reservation> = ({
    reservationId,
    reservationMade,
    comment,
    startDate,
    startTime,
    nightCount,
    endTime,
    endDate,
    prices,
    roomType,
    room,
    state,
    extras,
    guest,
    guestName,
    email,
    phone
}) => {
    return (
	<div className="reservation-entry-fields-container">
		<p>Reservation Id: {reservationId}</p>
		<p>Reservation made at: {reservationMade.toLocaleString()}</p>
		<p>Reservation start date: {startDate.toLocaleString()}</p>
		<p>Reservation end date: {endDate.toLocaleString()}</p>
		<p>Reservation start time: {startTime}</p>
		<p>Reservation end time: {endTime}</p>
		<p>Reservation number of nights: {nightCount}</p>
		<p>Reservation room type: {roomType}</p>
		<p>Reservation room number: {room}</p>
		<p>Reservation state: {state}</p>
		<p>Reservation guest name: {guestName}</p>
		<p>Reservation guest Id: {guest}</p>
		<p>Reservation guest email: {email}</p>
		<p>Reservation guest phone: {phone}</p>
		<p>Reservation comment: {comment}</p>
		{prices.length > 0 && (
			<div>
				<p>Prices:</p>
				<ul>
					{prices.map((price, index) => (
						<li key={index}>{price}</li>
					))}
				</ul>
			</div>
		)}
		{extras.length > 0 && (
			<div>
				<p>Extras:</p>
				<ul>
					{extras.map((extra, index) => (
						<li key={index}>{extra}</li>
					))}
				</ul>
			</div>
		)}
	</div>
    );
};

export default ReservationEntry;
