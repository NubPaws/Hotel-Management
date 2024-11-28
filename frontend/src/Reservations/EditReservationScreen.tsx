import { FC, useCallback, useEffect, useState } from "react";
import { ScreenProps } from "../Utils/Props";
import useUserRedirect from "../Utils/Hooks/useUserRedirect";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetchReservationInfo from "./Hooks/useFetchReservationInfo";
import Button from "../UIElements/Buttons/Button";
import Input, { InputType } from "../UIElements/Forms/Input";
import MenuGridLayout from "../UIElements/MenuGridLayout";
import DateInput from "../UIElements/Forms/DateInput";
import { makeRequest, RequestError } from "../APIRequests/APIRequests";
import { useModalError } from "../Utils/Contexts/ModalErrorContext";
import usePopup from "../Utils/Contexts/PopupContext";

import "./EditReservationScreen.css";
import Colors from "../styles/Colors";
import { ReservationState } from "../APIRequests/ServerData";

const EditReservationScreen: FC<ScreenProps> = ({
	userCredentials
}) => {
	useUserRedirect(userCredentials, ["Admin"], ["FrontDesk"]);
	const navigate = useNavigate();
	
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	
	const reservation = id ? useFetchReservationInfo(userCredentials.token, Number(id)) : undefined;
	
	const [comment, setComment] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [room, setRoom] = useState<number | null>(0);
	const [guestId, setGuestId] = useState(0);
	const [guestName, setGuestName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	
	const [showModal] = useModalError();
	const [_, showInfoPopup] = usePopup();
	
	useEffect(() => {
		if (!reservation) {
			return;
		}
		setComment(reservation.comment);
		setStartDate(reservation.startDate);
		setStartTime(reservation.startTime);
		setEndTime(reservation.endTime);
		setRoom(reservation.room);
		setGuestId(reservation.guest);
		setGuestName(reservation.guestName);
		setEmail(reservation.email);
		setPhoneNumber(reservation.phone);
	}, [reservation]);
	
	const errorHandler = useCallback((error: any) => {
		if (error instanceof TypeError) {
			showModal("Connection error", error.message);
		}
		if (error instanceof RequestError) {
			showModal("Request error", error.message);
		}
	}, [showModal]);
	
	if (!id) {
		return <p>Id should be provided to access this screen.</p>
	}
	if (!reservation) {
		return <p>Loading reservation...</p>
	}
	
	const {
		reservationMade: dateMade, nightCount, roomType, endDate, state
	} = reservation;
	
	const cancelReservation = () => {
		const url = "api/Reservations/cancel";
		const body = { reservationId: id };
		makeRequest(url, "POST", "json", body, userCredentials.token)
			.then(res => {
				if (!res.ok) {
					res.json().then(text => showModal("Failed to cancel reservation", text));
					return;
				}
				
				showInfoPopup(`Successfully cancelled reservation ${id}`);
				navigate("/reservations");
			})
			.catch(errorHandler);
	};
	
	const checkReservation = async (action: "checkin" | "checkout") => {
		const url = `api/Reservations/${action}`;
		const newState = action === "checkin" ? "Active" : "Passed";
		
		try {
			const res = await makeRequest(url, "POST", "json", { reservationId: id }, userCredentials.token);
			
			if (!res.ok) {
				showModal(
					"Failed changing state",
					`Failed changing reservation state from [${state}] to [${newState}].`
				);
				return;
			}
			
			showInfoPopup(`Successfully changed reservation state to [${newState}]`);
			navigate(-1);
		} catch (error) {
			errorHandler(error);
		}
	}
	
	const saveReservation = () => {
		const url = "api/Reservations/update";
		const body = {
			reservationId: id,
			comment,
			email,
			phone: phoneNumber,
			startDate,
			startTime,
			endTime,
			room,
		}
		makeRequest(url, "POST", "json", body, userCredentials.token)
			.then(res => {
				if (!res.ok) {
					res.json().then(text => showModal("Failed to save changes", text));
					return;
				}
				
				showInfoPopup("Saved reservation.");
			})
			.catch(errorHandler);
	};
	
	return <div className="edit-reservation-wrapper">
		<div className="edit-reservation-fields-container">
			<MenuGridLayout columns="1fr 1fr 2fr 1fr">
				<Input
					id="edit-reservation-id"
					value={id}
					label="Reservation #"
					type={InputType.Text}
					readonly={true}
				/>
				<Input
					id="edit-reservation-night-count"
					value={`${nightCount}`}
					label="Night count"
					type={InputType.Text}
					readonly={true}
				/>
				<Input
					id="edit-reservation-date-made"
					value={dateMade.toLocaleString()}
					label="Date made"
					type={InputType.Text}
					readonly={true}
				/>
				<Input
					id="edit-reservation-room-type"
					value={roomType}
					label="Room type"
					type={InputType.Text}
					readonly={true}
				/>
			</MenuGridLayout>
			
			<MenuGridLayout columns="1fr 1fr 1fr 1fr">
				<DateInput
					id="edit-reservation-start-date"
					label="Start date"
					value={startDate}
					onChange={(d) => setStartDate(d)}
				/>
				<Input
					id="edit-reservation-start-time"
					value={startTime}
					label="Starting at"
					type={InputType.Time}
					onChange={(e) => setStartTime(e.target.value)}
				/>
				<Input
					id="edit-reservation-end-time"
					value={endTime}
					label="Ending at"
					type={InputType.Time}
					onChange={(e) => setEndTime(e.target.value)}
				/>
				<DateInput
					id="edit-reservation-end-date"
					label="End date"
					value={endDate}
				/>
			</MenuGridLayout>
			<MenuGridLayout columns="1fr 2fr 4.75fr">
				<Input
					id="edit-reservation-room"
					value={room ? `${room}` : ""}
					label="Room"
					type={InputType.Number}
					onChange={(e) => {const v = e.target.value; v ? setRoom(Math.max(0, Number(v))) : 0}}
				/>
				<Input
					id="edit-reservation-state"
					label="State"
					value={state}
					type={InputType.Text}
				/>
				<Input
					id="edit-reservation-comment"
					value={comment}
					label="Comment"
					type={InputType.Text}
					onChange={(e) => setComment(e.target.value)}
				/>
			</MenuGridLayout>
			
			<p className="guest-information-label">Guest information</p>
			<MenuGridLayout columns="1fr 2fr 2fr 2fr">
				<Input
					id="edit-reservation-guest-id"
					label="ID"
					type={InputType.Text}
					value={`${guestId}`}
					onChange={(e) => setGuestId(Math.max(0, Number(e.target.value)))}
				/>
				<Input
					id="edit-reservation-guest-name"
					label="Name"
					type={InputType.Text}
					value={guestName}
					onChange={(e) => setGuestName(e.target.value)}
				/>
				<Input
					id="edit-reservation-guest-phone"
					label="Phone"
					type={InputType.Tel}
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
				/>
				<Input
					id="edit-reservation-guest-email"
					label="Email"
					type={InputType.Email}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</MenuGridLayout>
		</div>
		
		<div className="edit-reservation-controls">
			<Button
				backgroundColor={Colors.red}
				onClick={cancelReservation}
				disabled={state === "Cancelled"}
			>
				Cancel Reservation
			</Button>
			
			<div className="edit-reservation-right-btns">
				<Button onClick={() => navigate(`/reservations/billing?id=${id}`)}>Billing</Button>
				
				<Button
					onClick={
						canCheckin(state)
							? () => checkReservation("checkin")
							: canCheckout(state)
							? () => checkReservation("checkout")
							: undefined
					}
					disabled={!canCheckin(state) && !canCheckout(state)}
				>
					{canCheckin(state)
						? "Check in"
						: canCheckout(state)
						? "Check out"
						: "Check in/out"
					}
				</Button>
				
				<Button onClick={saveReservation}>Save</Button>
			</div>
		</div>
	</div>;
};

const canCheckin = (state: ReservationState) => state === "Arriving";
const canCheckout = (state: ReservationState) => state === "Active" || state === "Departing";

export default EditReservationScreen;
