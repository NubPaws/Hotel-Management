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
	onClick?: () => void;
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
			{children && (
				<>
					<img
						className="icon-btn-image"
						src={iconUrl}
						alt="icon"
						style={{
							width: fontSize,
							height: fontSize,
						}}
					></img>
					<span>{children}</span>
				</>
			)}
			{!children && (
				<img
					src={iconUrl}
					alt="icon"
					style={{
						width: fontSize,
						height: fontSize,
					}}
				></img>
			)}
		</button>
	);
}

export default IconButton;
