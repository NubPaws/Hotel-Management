import React from "react"
import RadioButtonContainer from "../../UIElements/Forms/Radio/RadioButtonContainer"
import RadioButton from "../../UIElements/Forms/Radio/RadioButton";
import { RoomRadioButtonElementProps } from "./RoomRadioButtonsProps";

const RoomStateRadioButton: React.FC<RoomRadioButtonElementProps> = ({
    value, setValue
}) => (
    <RadioButtonContainer
        title="Select room state:"
        name="room-state"
        value={value}
        setValue={setValue}>
            <RadioButton>Clean</RadioButton>
            <RadioButton>Inspected</RadioButton>
            <RadioButton>Dirty</RadioButton>
            <RadioButton>Out of Order</RadioButton>
    </RadioButtonContainer>
);

export default RoomStateRadioButton;
