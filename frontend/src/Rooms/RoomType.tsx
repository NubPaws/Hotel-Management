import { authorizedPostRequestWithBody, authorizedPostRequestWithoutBody } from "../APIRequests/APIRequests";

async function createRoomType(
    event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomTypeCreationSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomTypeCreationErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    event.preventDefault();
    let roomTypeInput = document.getElementById("roomType") as HTMLInputElement;
    let roomDescriptionInput = document.getElementById("roomDescription") as HTMLInputElement;

    let roomTypeCreateForm = document.getElementById("roomTypeCreateForm") as HTMLFormElement;
    let url = roomTypeCreateForm.action + roomTypeInput.value;

    let roomCreationData = {
        "description": roomDescriptionInput.value
    }

    if (validateRoomTypeCreation()) {
        let res = await authorizedPostRequestWithBody(token, JSON.stringify(roomCreationData), url, setShowConnectionErrorMessage);
        if (res === null) {
            return;
        }
        let status = res.status;

        if (status === 201) {
            setShowRoomTypeCreationSuccessMessage(true);
        } else {
            setShowRoomTypeCreationErrorMessage(true);
        }
    }
}

function validateRoomTypeCreation() {
    let roomTypeInput = document.getElementById("roomType") as HTMLInputElement;
    let roomDescriptionInput = document.getElementById("roomDescription") as HTMLInputElement;
    let roomTypeErrorMessage = document.getElementById("roomTypeErrorMessage") as HTMLInputElement;
    let roomDescriptionErrorMessage = document.getElementById("roomDescriptionErrorMessage") as HTMLInputElement;

    // Validation for only characters - both lowercase and uppercase allowed
    let regex = /^[a-zA-Z]+(-[a-zA-Z]+)?$/;

    if (!regex.test(roomTypeInput.value)) {
        roomTypeErrorMessage.innerText = "Room type must contain letters or dash only";
        return false;
    } else {
        roomTypeErrorMessage.innerText = "";
    }

    if (roomDescriptionInput.value === "") {
        roomDescriptionErrorMessage.innerText = "Room description must not be empty";
    } else {
        roomDescriptionErrorMessage.innerText = ""
    }
    return true;
}

async function removeRoomType(
    event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomTypeRemovalSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomTypeRemovalErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,

) {
    event.preventDefault();
    let roomTypeToRemoveInput = document.getElementById("roomTypeToRemove") as HTMLInputElement;
    let roomNewTypeInput = document.getElementById("roomNewType") as HTMLInputElement;


    let roomTypeRemovalForm = document.getElementById("roomTypeRemovalForm") as HTMLFormElement;
    let url = roomTypeRemovalForm.action + roomTypeToRemoveInput.value;

    let roomRemovalData = {
        "newType": roomNewTypeInput.value
    }

    if (validateRoomTypeToRemove()) {
        let res = await authorizedPostRequestWithBody(token, JSON.stringify(roomRemovalData), url, setShowConnectionErrorMessage);
        if (res === null) {
            return;
        }
        let status = res.status;
        if (status === 200) {
            setShowRoomTypeRemovalSuccessMessage(true);
        } else {
            setShowRoomTypeRemovalErrorMessage(true);
        }
    }
}

function validateRoomTypeToRemove() {
    let roomTypeToRemoveInput = document.getElementById("roomTypeToRemove") as HTMLInputElement;
    let roomTypeToRemoveErrorMessage = document.getElementById("roomTypeToRemoveErrorMessage") as HTMLInputElement;

    let roomNewTypeInput = document.getElementById("roomNewType") as HTMLInputElement;
    let roomNewTypeErrorMessage = document.getElementById("roomNewTypeErrorMessage") as HTMLInputElement;


    // Validation for only characters - both lowercase and uppercase allowed
    let regex = /^[a-zA-Z]+(-[a-zA-Z]+)?$/;

    if (!regex.test(roomTypeToRemoveInput.value)) {
        roomTypeToRemoveErrorMessage.innerText = "Room type must contain letters or dash only";
        return false;
    } else {
        roomTypeToRemoveErrorMessage.innerText = "";
    }

    if (roomNewTypeInput.value === "") {
        roomNewTypeErrorMessage.innerText = "Room type must not be empty";
        return false;
    } else {
        roomNewTypeErrorMessage.innerText = "";
    }

    return true;
}
export { createRoomType, removeRoomType };