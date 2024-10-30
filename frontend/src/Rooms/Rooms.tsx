import { authorizedPostRequestWithBody, authorizedPostRequestWithoutBody } from "../APIRequests/APIRequests";
import { ROOM_TYPE_REGEX, ROOM_NUMBER_REGEX } from "./RoomsRegex";

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

    if (!ROOM_TYPE_REGEX.test(roomTypeInput.value)) {
        roomTypeErrorMessage.innerText = "Room type must contain letters or dash only";
        return false;
    } else {
        roomTypeErrorMessage.innerText = "";
    }

    if (!ROOM_NUMBER_REGEX.test(roomNumberInput.value)) {
        roomNumberErrorMessage.innerText = "Room number must numbers only";
        return false;
    } else {
        roomNumberErrorMessage.innerText = "";
    }
    return true;
}


async function removeRoom(
    event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomRemovalSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomRemovalErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    let roomNumberInput = document.getElementById("roomNumberToRemove") as HTMLInputElement;
    let roomRemovalForm = document.getElementById("roomRemovalForm") as HTMLFormElement;

    let url = roomRemovalForm.action + roomNumberInput.value;
    if (validateRoomRemoval()) {
        let res = await authorizedPostRequestWithoutBody(token, url, setShowConnectionErrorMessage);
        if (res === null) {
            return;
        }
        let status = res.status;
        if (status === 200) {
            setShowRoomRemovalSuccessMessage(true);
        } else {
            setShowRoomRemovalErrorMessage(true);
        }
    }
}

function validateRoomRemoval() {
    let roomNumberInput = document.getElementById("roomNumberToRemove") as HTMLInputElement;
    let roomNumberToRemoveErrorMessage = document.getElementById("roomNumberToRemoveErrorMessage") as HTMLInputElement;

    if (!ROOM_NUMBER_REGEX.test(roomNumberInput.value)) {
        roomNumberToRemoveErrorMessage.innerText = "Room number must numbers only";
        return false;
    } else {
        roomNumberToRemoveErrorMessage.innerText = "";
    }
    return true;
}

export { createRoom, removeRoom };