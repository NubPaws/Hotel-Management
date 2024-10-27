import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";

async function createRoom(
    event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomCreationSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomCreationErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    let roomTypeInput = document.getElementById("roomType") as HTMLInputElement;
    let roomNumberInput = document.getElementById("roomNumber") as HTMLInputElement;

    let roomCreateForm = document.getElementById("roomCreateForm") as HTMLFormElement;
    let url = roomCreateForm.action

    let createRoomData = {
        "type": roomTypeInput.value,
        "room": roomNumberInput.value
    }

    if (validateRoomCreation()) {
        let res = await authorizedPostRequestWithBody(token, JSON.stringify(createRoomData), url, setShowConnectionErrorMessage);
        if (res === null) {
            return;
        }
        let status = res.status;
        if (status === 201) {
            setShowRoomCreationSuccessMessage(true);
        } else {
            setShowRoomCreationErrorMessage(true);
        }
    }
}

function validateRoomCreation() {
    let roomTypeInput = document.getElementById("roomType") as HTMLInputElement;
    let roomNumberInput = document.getElementById("roomNumber") as HTMLInputElement;
    let roomTypeErrorMessage = document.getElementById("roomTypeErrorMessage") as HTMLInputElement;
    let roomNumberErrorMessage = document.getElementById("roomNumberErrorMessage") as HTMLInputElement;


    // Validation for only characters - both lowercase and uppercase allowed
    let regex = /^[a-zA-Z]+(-[a-zA-Z]+)?$/;

    if (!regex.test(roomTypeInput.value)) {
        roomTypeErrorMessage.innerText = "Room type must contain letters or dash only";
        return false;
    } else {
        roomTypeErrorMessage.innerText = "";
    }

    // Validation numbers
    let numbersRegex = /^[0-9]+$/;
    if (!numbersRegex.test(roomNumberInput.value)) {
        roomNumberErrorMessage.innerText = "Room number must numbers only";
        return false;
    } else {
        roomNumberErrorMessage.innerText = "";
    }
    return true;
}

export { createRoom };