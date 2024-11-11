import React from "react";
import "./RadioButtonContainer.css";

interface RadioButtonContainerProps {
	title: string;
	name: string;
	children: React.ReactNode;
}

const RadioButtonContainer: React.FC<RadioButtonContainerProps> = ({
	title, name, children
}) => {
	return (
		<div className={`${name}-container`}>
			<p className="radio-buttons-title">{title}</p>
			{React.Children.map(children, (child) =>
				React.isValidElement(child)
					? React.cloneElement(child as React.ReactElement<{ name: string }>, { name })
					: child
			)}
		</div>
	);
}

export default RadioButtonContainer;
