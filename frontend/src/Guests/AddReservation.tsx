import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";

async function addReservation(
    event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowAddReservationSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowInvalidInputMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowGuestNotFoundMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    let guestIdInput = document.getElementById("guestId") as HTMLInputElement;
    let reservationIdInput = document.getElementById("reservationId") as HTMLInputElement;

    let addReservationForm = document.getElementById("addReservationForm") as HTMLFormElement;
    let url = addReservationForm.action

    let addReservationData = {
        "guestId": guestIdInput.value,
        "reservationId": reservationIdInput.value,
    }

    if (validateAddReservation()) {
        let res = await authorizedPostRequestWithBody(token, JSON.stringify(addReservationData), url, setShowConnectionErrorMessage);
        if (res === null) {
            return;
        }
        let status = res.status;
        if (status === 200) {
            setShowAddReservationSuccessMessage(true);
        }
        else if (status === 400) {
            setShowInvalidInputMessage(true);
        } else if (status === 409) {
            setShowGuestNotFoundMessage(true);
        }
    }
}

function validateAddReservation() {
    let guestIdInput = document.getElementById("guestId") as HTMLInputElement;
    let guestIdErrorMessage = document.getElementById("guestIdErrorMessage") as HTMLInputElement;

    let reservationIdInput = document.getElementById("reservationId") as HTMLInputElement;
    let reservationIdErrorMessage = document.getElementById("reservationIdErrorMessage") as HTMLInputElement;

    if (guestIdInput.value === "") {
        guestIdErrorMessage.innerText = "Guest Id must be filled"
        return false;
    } else {
        guestIdErrorMessage.innerText = ""
    }

    if (reservationIdInput.value === "") {
        reservationIdErrorMessage.innerText = "Reservation Id must be filled"
        return false;
    } else {
        reservationIdErrorMessage.innerText = "";
    }
    return true;
}

export { addReservation }