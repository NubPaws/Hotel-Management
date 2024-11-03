import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";

async function updateGuest(
    event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowInvalidInputErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowGuestUpdatedMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowGuestNotFoundErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    let guestIdInput = document.getElementById("guestId") as HTMLInputElement;
    let guestIdErrorMessage = document.getElementById("guestIdErrorMessage") as HTMLInputElement;
    let guestNameInput = document.getElementById("guestName") as HTMLInputElement;
    let guestEmailInput = document.getElementById("guestEmail") as HTMLInputElement;
    let guestPhoneInput = document.getElementById("guestPhone") as HTMLInputElement;

    let guestUpdateForm = document.getElementById("guestUpdateForm") as HTMLFormElement;
    let url = guestUpdateForm.action;

    let updateGuestData = {
        "guestId": guestIdInput.value,
        "fullName": guestNameInput.value,
        "email": guestEmailInput.value,
        "phone": guestPhoneInput.value,
    }

    if (guestIdInput.value === "") {
        guestIdErrorMessage.innerText = "Guest Id must be filled";
        return;
    } else {
        guestIdErrorMessage.innerText = "";
    }

    let res = await authorizedPostRequestWithBody(token, JSON.stringify(updateGuestData), url, setShowConnectionErrorMessage);
    if (res === null) {
        return;
    }

    let status = res.status;
    if (status === 200) {
        setShowGuestUpdatedMessage(true);
    } else if (status === 400) {
        setShowInvalidInputErrorMessage(true);
    } else if (status === 409) {
        setShowGuestNotFoundErrorMessage(true);
    } else {
        setShowConnectionErrorMessage(true);
    }
}

export { updateGuest }