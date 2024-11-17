import React from "react";
import "./Button.css";
import Colors from "../../styles/Colors";

export interface ButtonProps {
	className: string;
	
	backgroundColor: string;
	
	textColor: string;
	textSize: string
	
	borderWidth: string;
	borderRadius: boolean;
	
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (
	{ className, backgroundColor, textColor, textSize, borderWidth, borderRadius, onClick, children }
) => {
	const buttonStyles = {
		backgroundColor,
		color: textColor,
		fontSize: textSize,
		borderWidth,
		borderRadius: borderRadius ? "5px" : 0,
	}
	
	return (
		<button
			className={`btn ${className}`}
			style={buttonStyles}
			onClick={onClick}
		>{children}</button>
	);
}

Button.defaultProps = {
	className: "",
	
	backgroundColor: Colors.white,
	
	textColor: Colors.black,
	textSize: "16pt",
	
	borderWidth: "2px",
	borderRadius: false,
	
	onClick: () => {},
	children: "",
} as ButtonProps;

export default Button;
