import React from "react";
import { InputType } from "../Input";
import "./RadioButton.css";

interface RadioButtonProps {
	name?: string;
	children: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
	name, children
}) => {
	return <label className="custom-radio">
		<input type={InputType.Radio} name={name} value={children} />
		<span className="radio-button"></span>
		{children}
	</label>;
};

export default RadioButton;
