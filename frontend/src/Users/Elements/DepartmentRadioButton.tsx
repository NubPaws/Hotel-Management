import { FC } from "react";
import { ReactSetStateDispatch } from "../../Utils/Types";
import RadioButtonContainer from "../../UIElements/Forms/Radio/RadioButtonContainer";
import RadioButton from "../../UIElements/Forms/Radio/RadioButton";

type DepartmentRadioButtonsProps = {
	value: string;
	setValue: ReactSetStateDispatch<string>;
};

const DepartmentRadioButtons: FC<DepartmentRadioButtonsProps> = ({
	value, setValue
}) => (
	<RadioButtonContainer
		title="Select Department:"
		name="department"
		value={value}
		setValue={setValue}
	>
		<RadioButton>General</RadioButton>
				<RadioButton>Front Desk</RadioButton>
				<RadioButton>Housekeeping</RadioButton>
				<RadioButton>Maintenance</RadioButton>
				<RadioButton>Food and Beverage</RadioButton>
				<RadioButton>Security</RadioButton>
				<RadioButton>Concierge</RadioButton>
	</RadioButtonContainer>
);

export default DepartmentRadioButtons;
