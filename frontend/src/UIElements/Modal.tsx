import { Button } from "./Button.js";
import React, { useEffect } from "react";

import "./Modal.css";

export interface ModalController {
	title: string;
	message: string;
}

interface ModalProps {
	title: string;
	onClose: () => void;
	onAccept?: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, onAccept, children }) => {
	useEffect(() => {
		const closeOnEscapeKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		
		document.body.addEventListener("keydown", closeOnEscapeKeyDown);
		return () => {
			document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
		};
	}, [onClose]);
	
	return (
		<div className="modal" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<span className="modal-title">{title}</span>
				</div>
				<div className="modal-body">{children}</div>
				<div className="modal-footer">
					{onAccept && (
						<Button
							textColor="black"
							onClick={() => {
								onAccept();
								onClose();
							}}
							backgroundColor="#28A745"
						>
							Accept
						</Button>
					)}
					<Button
						textColor="black"
						onClick={onClose}
						backgroundColor="#5C95FF"
					>
						Close
					</Button>
				</div>
			</div>
		</div>
	);
}

Modal.defaultProps = {
	onAccept: undefined,
	onClose: () => {},
}

export default Modal;
