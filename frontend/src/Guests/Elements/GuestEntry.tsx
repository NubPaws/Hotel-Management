import { useNavigate } from "react-router-dom";
import { Guest } from "../../APIRequests/ServerData";
import IconButton from "../../UIElements/Buttons/IconButton";
import edit from "../../assets/edit.svg"
import Button from "../../UIElements/Buttons/Button";

import "./GuestEntry.css";

type GuestEntryProps = {
    guest: Guest;
};

const GuestEntry: React.FC<GuestEntryProps> = ({
    guest,
}) => {
    const { guestId, identification, email, phone, fullName, title } = guest;
    
    const navigate = useNavigate();
    const state: Partial<Guest> = { email, guestId, phone, fullName };
    return <div className="guest-entry">
        <IconButton
            className="guest-entry-button"
            iconUrl={edit}
            borderWidth="2px"
            borderRadius="5px"
            fontSize="10pt"
            onClick={() => navigate("/guests/update-guest", { state })}
        />
        <div className="guest-entry-cell" style={{width:"50px"}}>{identification}</div>
        <div className="guest-entry-cell" style={{width:"100px"}}>{fullName}</div>
        <div className="guest-entry-cell" style={{width:"50px"}}>{title}</div>
        <div className="guest-entry-cell" style={{width:"100px"}}>{email ? email : ""}</div>
        <div className="guest-entry-cell" style={{width:"100px"}}>{phone ? phone : ""}</div>
        <Button
            borderRadius="5px"
            borderWidth="2px"
            textSize="14pt"
        >
            Reservations
        </Button>
    </div>
}

export default GuestEntry;