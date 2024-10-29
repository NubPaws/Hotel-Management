import { authorizedPostRequestWithBody } from "../APIRequests/APIRequests";
import { validateRadioButton } from "../Authentication/Validation";
import { ROOM_NUMBER_REGEX } from "./RoomsRegex";

async function updateRoom(
    event: any,
    token: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomUpdateSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomUpdateErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowRoomNotFoundErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
) {
    event.preventDefault();
    let roomNumberInput = document.getElementById("roomNumber") as HTMLInputElement;
    let reservationIdInput = document.getElementById("reservationId") as HTMLInputElement;

    let roomUpdateForm = document.getElementById("roomUpdateForm") as HTMLFormElement;
    let url = roomUpdateForm.action

    let reservationId = null;

    if (validateRoomUpdate()) {
        if (reservationIdInput.value !== "") {
            reservationId = reservationIdInput.value;
        }

        const roomState: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="state"]');
        let roomStateIndex = 0;

        for (let i = 0; i < roomState.length; i++) {
            if (roomState[i].checked) {
                roomStateIndex = i;
            }
        }

        const roomOccupation: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="occupation"]');
        let roomOccupationIndex = 0;

        for (let i = 0; i < roomOccupation.length; i++) {
            if (roomOccupation[i].checked) {
                roomOccupationIndex = i;
            }
        }

        let updateRoomData = {
            "room": roomNumberInput.value,
            "state": roomState[roomStateIndex].value,
            "occupied": roomOccupation[roomOccupationIndex].value,
            "reservationId": reservationId
        }
        let res = await authorizedPostRequestWithBody(token, JSON.stringify(updateRoomData), url, setShowConnectionErrorMessage);
        if (res === null) {
            return;
        }
        let status = res.status;
        if (status === 200) {
            setShowRoomUpdateSuccessMessage(true);
        } else if (status === 400) {
            setShowRoomNotFoundErrorMessage(true);
        } else {
            setShowRoomUpdateErrorMessage(true);
        }
    }
}

function validateRoomUpdate() {
    let roomNumberInput = document.getElementById("roomNumber") as HTMLInputElement;
    let roomNumberErrorMessage = document.getElementById("roomNumberErrorMessage") as HTMLInputElement;

    if (!ROOM_NUMBER_REGEX.test(roomNumberInput.value)) {
        roomNumberErrorMessage.innerText = "Room number must numbers only";
        return false;
    } else {
        roomNumberErrorMessage.innerText = "";
    }

    if (!validateRadioButton("state", "roomStateErrorMessage", "Room state must be selected")) {
        return false;
    }

    if (!validateRadioButton("occupation", "roomOccupationErrorMessage", "Occupation must be selected")) {
        return false;
    }
    return true;
}

export { updateRoom }