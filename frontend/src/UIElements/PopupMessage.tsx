import React from "react";
import "./PopupMessage.css";

export type MessageType = "Error" | "Info";

interface PopupMessageProps {
	children: React.ReactNode;
	type: "Error" | "Info"
	duration?: number; // Duration in seconds.
}

const PopupMessage: React.FC<PopupMessageProps> = ({
	children,
	type,
	duration = 3,
}) => {
	return (
		<div
			className={`popup-message-box ${type.toLowerCase()}-popup`}
			style={{
				animation: `fadeInOut ${duration}s ease-in forwards`,
			}}
		>
			{children}
		</div>
	);
}

export default PopupMessage;
