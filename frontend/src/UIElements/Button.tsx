import "./Button.css";

export function Button(props: {className: string,
                       bgColor: string,
                       textColor: string,
                       borderWidth: string,
                       borderRadius: number,
                       onClick: React.MouseEventHandler<HTMLButtonElement>,
                       children: React.ReactNode,
}) {
	return (
		<button
			className={`btn ${props.className}`}
			style={{
				backgroundColor: props.bgColor,
				color: props.textColor,
				borderWidth: props.borderWidth,
				borderRadius: props.borderRadius,
			}}
			onClick={props.onClick}
		>{props.children}</button>
	);
}

Button.defaultProps = {
	bgColor: "white",
	color: "black",
	text: "",
	className: "",
	borderWidth: "2px",
	borderRadius: "7px",
};