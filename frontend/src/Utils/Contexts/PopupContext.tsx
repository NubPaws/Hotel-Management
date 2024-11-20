import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import PopupMessage from "../../UIElements/PopupMessage";

type PopupContextType = [
	showError: (message: string) => void,
	showInfo: (message: string) => void,
]

const PopupContext = createContext<PopupContextType | undefined>(undefined);

type PopupContextProviderProps = {
	children: ReactNode;
}

type MessageType = { type: "Error" | "Info"; message: string };

export const PopupContextProvider: FC<PopupContextProviderProps> = ({ children }) => {
	const [messageQueue, setMessageQueue] = useState<MessageType[]>([]);
	const [currentMessage, setCurrentMessage] = useState<MessageType | null>(null);
	
	useEffect(() => {
		if (!currentMessage && messageQueue.length > 0) {
			const nextMessage = messageQueue[0];
			setCurrentMessage(nextMessage);
			setMessageQueue((prevQueue) => prevQueue.slice(1));
			
			setTimeout(() => setCurrentMessage(null), 4000);
		}
	}, [currentMessage, messageQueue]);
	
	const showError = (message: string) => {
		setMessageQueue((prevQueue) => [...prevQueue, { type: "Error", message }]);
	};
	
	const showInfo = (message: string) => {
		setMessageQueue((prevQueue) => [...prevQueue, { type: "Info", message }]);
	};
	
	return (
		<PopupContext.Provider value={[ showError, showInfo ]}>
			{children}
			{currentMessage && (
				<PopupMessage type={currentMessage.type}>
					{currentMessage.message}
				</PopupMessage>
			)}
		</PopupContext.Provider>
	);
};

const usePopup = (): PopupContextType => {
	const context = useContext(PopupContext);
	if (!context) {
		throw new Error("usePopup must be used within an PopupContextProvider");
	}
	return context;
}

export default usePopup;
