import React from "react";
import { InputType } from "../Input";
import "./RadioButton.css";

interface RadioButtonProps {
	name?: string;
	children: string;
	value?: string;
	setValue?: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
	name, children, value, setValue
}) => {
	const handleChange = () => {
		if (setValue) {
			setValue(children);
		}
	}
	
	return <label className="custom-radio">
		<input
			type={InputType.Radio}
			name={name}
			checked={value === children}
			value={children}
			onChange={handleChange}
		/>
		<span className="radio-button"></span>
		{children}
	</label>;
};

export default RadioButton;
