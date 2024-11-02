import { authorizedGetRequest } from "../APIRequests/APIRequests";

async function searchGuest(
    event: any,
    token: string,
    setShowGuestSearchErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setGuestNotFoundErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setGuests: React.Dispatch<React.SetStateAction<Guest[]>>
) {
    event.preventDefault();
    let url = buildSearchGuestURL();
    let res = await authorizedGetRequest(url, token);
    if (res === null) {
        return;
    }
    let status = res.status;
    if (status === 200) {
        let guests = await res.json();
        setGuests(guests);
        if (guests.length === 0) {
            setGuestNotFoundErrorMessage(true);
        }
    } else {
        setShowGuestSearchErrorMessage(true);
    }
}

function buildSearchGuestURL() {
    let guestIdInput = document.getElementById("guestId") as HTMLInputElement;
    let guestNameInput = document.getElementById("guestName") as HTMLInputElement;
    let guestEmailInput = document.getElementById("guestEmail") as HTMLInputElement;
    let guestPhoneInput = document.getElementById("guestPhone") as HTMLInputElement;
    let reservationIdInput = document.getElementById("reservationId") as HTMLInputElement;

    let guestSearchForm = document.getElementById("guestSearchForm") as HTMLFormElement;
    let url = guestSearchForm.action + "?";

    if (guestIdInput.value !== "") {
        url += "id=" + guestIdInput.value + "&";
    }

    if (guestNameInput.value !== "") {
        url += "name=" + guestNameInput.value + "&";
    }

    if (guestEmailInput.value !== "") {
        url += "email=" + guestEmailInput.value + "&";
    }

    if (guestPhoneInput.value !== "") {
        url += "phone=" + guestPhoneInput.value + "&";
    }

    if (reservationIdInput.value !== "") {
        url += "reservationId=" + reservationIdInput.value + "&";
    }

    return url;
}


export { searchGuest }
