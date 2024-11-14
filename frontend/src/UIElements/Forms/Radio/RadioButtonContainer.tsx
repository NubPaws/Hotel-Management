import React from "react";
import "./RadioButtonContainer.css";

interface RadioButtonContainerProps {
	title: string;
	name: string;
	value: string;
	setValue: (value: string) => void;
	children: React.ReactNode;
}

interface ChildReactElement {
	name: string;
	value: string;
	setValue: (value: string) => void;
}

const RadioButtonContainer: React.FC<RadioButtonContainerProps> = ({ title, name, value, setValue, children }) => {
	return (
		<div className={`${name}-container`}>
			<p className="radio-buttons-title">{title}</p>
			{React.Children.map(children, (child) =>
				React.isValidElement(child)
					? React.cloneElement(
						child as React.ReactElement<ChildReactElement>, { name, value, setValue }
					)
					: child
			)}
		</div>
	);
}

export default RadioButtonContainer;
