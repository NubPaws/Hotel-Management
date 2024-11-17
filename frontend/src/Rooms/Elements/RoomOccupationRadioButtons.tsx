import RadioButton from "../../UIElements/Forms/Radio/RadioButton";
import RadioButtonContainer from "../../UIElements/Forms/Radio/RadioButtonContainer";
import { RoomStateRadioButtonProps } from "./RoomRadioButtonsProps";

const RoomOccupationRadioButton: React.FC<RoomStateRadioButtonProps> = ({
    value, setValue
}) => (
    <RadioButtonContainer
        title="Select room occupation:"
        name="room-occupation"
        value={value}
        setValue={setValue}>
            <RadioButton>Occupied</RadioButton>
            <RadioButton>Free</RadioButton>
    </RadioButtonContainer>
);

export default RoomOccupationRadioButton;
