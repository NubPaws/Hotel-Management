import { authorizedGetRequest } from "../APIRequests/APIRequests";
import { Room } from "../APIRequests/ServerData";

async function searchRoom(
    event: any,
    token: string,
    setShowRoomSearchErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setRoomNotFoundErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>
) {
    event.preventDefault();
    let url = buildRoomInformationURL();
    let res = await authorizedGetRequest(url, token);
    if (res === null) {
        return;
    }
    let status = res.status;
    if (status === 200) {
        let rooms = await res.json();
        setRooms(rooms);
        if (rooms.length === 0) {
            setRoomNotFoundErrorMessage(true);
        }
    } else {
        setShowRoomSearchErrorMessage(true);
    }
}

function buildRoomInformationURL() {
    let roomTypeInput = document.getElementById("roomType") as HTMLInputElement;
    let reservationIdInput = document.getElementById("reservationId") as HTMLInputElement;
    let roomInformationForm = document.getElementById("roomInformationForm") as HTMLFormElement;
    let url = roomInformationForm.action + "?";

    // Checking for room type
    if (roomTypeInput.value !== "") {
        url += "type=" + roomTypeInput.value + "&";
    }

    const roomState: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="state"]');
    let roomStateIndex = -1;

    // Checking for room state
    for (let i = 0; i < roomState.length; i++) {
        if (roomState[i].checked) {
            roomStateIndex = i;
        }
    }

    if (roomStateIndex !== -1) {
        url += "state=" + roomState[roomStateIndex].value + "&";
    }

    // Checking for room occupation
    const roomOccupation: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="occupation"]');
    let roomOccupationIndex = -1;

    for (let i = 0; i < roomOccupation.length; i++) {
        if (roomOccupation[i].checked) {
            roomOccupationIndex = i;
        }
    }

    if (roomOccupationIndex !== -1) {
        url += "occupied=" + roomOccupation[roomOccupationIndex].value + "&";
    }

    // Checking for reservation id
    if (reservationIdInput.value !== "") {
        url += "reservationId=" + reservationIdInput.value + "&";
    }
    return url;
}

export { searchRoom }