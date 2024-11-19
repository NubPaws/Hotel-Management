import React, { useState } from "react";
import Modal from '../../UIElements/Modal';

type useModalReturnType = [
	false | React.ReactElement,
	(title: string, content: React.ReactNode | string) => void,
	() => void,
];

const useModal = (): useModalReturnType => {
	const [show, setShow] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState<React.ReactNode | string>("");
	
	const modal = show && (
		<Modal
			title={title}
			onClose={() => setShow(false)}
		>
			{content}
		</Modal>
	);
	
	const showModal = (title: string, content: React.ReactNode | string) => {
		setTitle(title);
		setContent(content);
		setShow(true);
	};
	
	const hideModal = () => {
		setShow(false);
	};
	
	return [modal, showModal, hideModal];
}

export default useModal;
