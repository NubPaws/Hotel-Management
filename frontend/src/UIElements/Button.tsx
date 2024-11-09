import React from "react";
import "./Button.css";
import Colors from "../styles/Colors";

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

export function Button(props: ButtonProps) {
	const { backgroundColor, textColor, textSize, borderWidth, borderRadius } = props;
	
	return (
		<button
			className={`btn ${props.className}`}
			style={{
				backgroundColor,
				color: textColor,
				fontSize: textSize,
				borderWidth,
				borderRadius: borderRadius ? "5px" : 0,
			}}
			onClick={props.onClick}
		>{props.children}</button>
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

export interface IconButtonProps extends ButtonProps {
	
}

export function IconButton(_props: IconButtonProps) {
	return <button>Empty for now</button>;
}
