import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";

async function createGuests(
    event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowInvalidInputErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowGuestExistsErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowGuestCreatedSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    let identificationInput = document.getElementById("identification") as HTMLInputElement;
    let guestNameInput = document.getElementById("guestName") as HTMLInputElement;
    let guestEmailInput = document.getElementById("guestEmail") as HTMLInputElement;
    let guestPhoneInput = document.getElementById("guestPhone") as HTMLInputElement;
    let guestTitle = document.getElementById("guestTitle") as HTMLInputElement;

    let guestCreateForm = document.getElementById("guestCreateForm") as HTMLFormElement;
    let url = guestCreateForm.action

    let createGuestData = {
        "identification": identificationInput.value,
        "fullName": guestNameInput.value,
        "email": guestEmailInput.value,
        "phone": guestPhoneInput.value,
        "title": guestTitle.value
    }

    if (validateGuestCreation()) {
        let res = await authorizedPostRequestWithBody(token, JSON.stringify(createGuestData), url, setShowConnectionErrorMessage);
        if (res === null) {
            return;
        }
        let status = res.status;
        if (status === 201) {
            setShowGuestCreatedSuccessMessage(true);
        } else if (status === 400) {
            setShowInvalidInputErrorMessage(true);
        } else if (status === 409) {
            setShowGuestExistsErrorMessage(true);
        } else {
            setShowConnectionErrorMessage(true);
        }
    }
}

function validateGuestCreation() {
    let identificationInput = document.getElementById("identification") as HTMLInputElement;
    let identificationErrorMessage = document.getElementById("guestIdErrorMessage") as HTMLInputElement;

    let guestNameInput = document.getElementById("guestName") as HTMLInputElement;
    let guestNameErrorMessage = document.getElementById("guestNameErrorMessage") as HTMLInputElement;

    if (identificationInput.value === "") {
        identificationErrorMessage.innerText = "Guest id must be filled";
        return false;
    } else {
        identificationErrorMessage.innerText = "";
    }

    if (guestNameInput.value === "") {
        guestNameErrorMessage.innerText = "Guest name must be filled";
        return false;
    } else {
        guestNameErrorMessage.innerText = "";
    }

    return true;
}

export {createGuests}