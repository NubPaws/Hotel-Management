import RadioButton from "../../UIElements/Forms/Radio/RadioButton";
import RadioButtonContainer from "../../UIElements/Forms/Radio/RadioButtonContainer";
import { RoomRadioButtonElementProps } from "./RoomRadioButtonsProps";

const RoomOccupationRadioButton: React.FC<RoomRadioButtonElementProps> = ({
    value, setValue
}) => (
    <RadioButtonContainer
        title="Room occupation:"
        name="room-occupation"
        value={value}
        setValue={setValue}>
            <RadioButton>Occupied</RadioButton>
            <RadioButton>Vacant</RadioButton>
    </RadioButtonContainer>
);

export default RoomOccupationRadioButton;
