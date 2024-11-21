import { useNavigate } from "react-router-dom";
import { Guest } from "../../APIRequests/ServerData";
import IconButton from "../../UIElements/Buttons/IconButton";
import edit from "../../assets/edit.svg"

import "./GuestEntry.css"
import { GuestUpdateState } from "../UpdateGuestState";
import Button from "../../UIElements/Buttons/Button";

const GuestEntry: React.FC<Guest> = ({
    guestId,
    identification,
    fullName,
    title,
    email,
    phone,
}) => {
    const navigate = useNavigate();
    const state: GuestUpdateState = { email, guestId, phone, fullName };
    return <div className="guest-entry">
        <IconButton
            className="guest-entry-button"
            iconUrl={edit}
            borderWidth="2px"
            borderRadius="5px"
            fontSize="10pt"
            onClick={() => navigate("/guests/update-guest", { state })}
        />
        <div>{guestId}</div>
        <div>{identification}</div>
        <div>{fullName}</div>
        <div>{title}</div>
        <div>{email ? email : "No email provided"}</div>
        <div>{phone ? phone : "No phone provided"}</div>
        <Button
            textSize="14pt"
        >
            View
        </Button>
    </div>
}

export default GuestEntry;