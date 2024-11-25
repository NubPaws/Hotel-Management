import { MouseEventHandler } from "react";
import Colors from "../../styles/Colors";
import "./IconButton.css"

interface IconButtonProps {
	className?: string;
	children?: string;
	iconUrl: string;
	borderWidth?: string;
	borderRadius?: string;
	fontSize?: string;
	backgroundColor?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: React.FC<IconButtonProps> = ({
	className,
	children,
	iconUrl,
	borderWidth = "1px",
	borderRadius = "4px",
	fontSize = "16px",
	backgroundColor = Colors.white,
	onClick
}) => {
	return (
		<button
			onClick={onClick}
			className={`icon-btn ${className}`}
			style={{
				borderWidth,
				borderRadius,
				fontSize,
				backgroundColor,
			}}
		>
			<img
				src={iconUrl}
				alt="icon"
				style={{
					width: fontSize,
					height: fontSize,
				}}
			></img>
			{children && <span style={{marginLeft: "8px"}}>{children}</span>}
		</button>
	);
}

export default IconButton;
