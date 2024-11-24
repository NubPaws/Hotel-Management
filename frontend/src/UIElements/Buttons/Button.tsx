import React from "react";
import Colors from "../../styles/Colors";
import "./Button.css";

interface ButtonProps {
	className?: string;
	
	backgroundColor?: string;
	
	textColor?: string;
	textSize?: string
	
	borderWidth?: string;
	borderRadius?: string;
	
	disabled?: boolean;
	
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	className,
	backgroundColor = Colors.white,
	textColor = Colors.black,
	textSize = "16pt",
	borderWidth = "1px",
	borderRadius = "5px",
	disabled = false,
	onClick,
	children
}) => {
	
	const buttonStyles: React.CSSProperties = {
		backgroundColor,
		color: textColor,
		fontSize: textSize,
		borderWidth: borderWidth,
		borderRadius: borderRadius,
	}
	
	return (
		<button
			className={`btn ${className}`}
			style={buttonStyles}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}

export default Button;
