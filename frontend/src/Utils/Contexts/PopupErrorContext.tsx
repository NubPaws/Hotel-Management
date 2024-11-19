import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import PopupMessage from "../../UIElements/PopupMessage";

type PopupErrorContextType = [
	show: (message: string) => void,
]

const PopupErrorContext = createContext<PopupErrorContextType | undefined>(undefined);

type PopupErrorContextProviderProps = {
	children: ReactNode;
}

export const PopupErrorContextProvider: FC<PopupErrorContextProviderProps> = ({ children }) => {
	const [messageQueue, setMessageQueue] = useState<string[]>([]);
	const [currentMessage, setCurrentMessage] = useState<string | null>(null);
	
	useEffect(() => {
		if (!currentMessage && messageQueue.length > 0) {
			const nextMessage = messageQueue[0];
			setCurrentMessage(nextMessage);
			setMessageQueue((prevQueue) => prevQueue.slice(1));
			
			setTimeout(() => setCurrentMessage(null), 4000);
		}
	}, [currentMessage, messageQueue]);
	
	const show = (message: string) => {
		setMessageQueue((prevQueue) => [...prevQueue, message]);
	}
	
	return (
		<PopupErrorContext.Provider value={[ show ]}>
			{children}
			{currentMessage && (
				<PopupMessage type="Error">
					{currentMessage}
				</PopupMessage>
			)}
		</PopupErrorContext.Provider>
	);
};

export const usePopupError = (): PopupErrorContextType => {
	const context = useContext(PopupErrorContext);
	if (!context) {
		throw new Error("useError must be used within an ErrorContextProvider");
	}
	return context;
};
