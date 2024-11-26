import { FC } from "react";
import { ReactSetStateDispatch } from "../../Utils/Types";
import RadioButtonContainer from "../../UIElements/Forms/Radio/RadioButtonContainer";
import RadioButton from "../../UIElements/Forms/Radio/RadioButton";

type RoleRadioButtonsProps = {
	value: string;
	setValue: ReactSetStateDispatch<string>;
};

const RoleRadioButtons: FC<RoleRadioButtonsProps> = ({
	value, setValue
}) => (
	<RadioButtonContainer
		title="Select Role:"
		name="role"
		value={value}
		setValue={setValue}
	>
		<RadioButton>User</RadioButton>
		<RadioButton>Admin</RadioButton>
	</RadioButtonContainer>
);

export default RoleRadioButtons;
