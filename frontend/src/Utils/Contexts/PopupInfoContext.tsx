import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import PopupMessage from "../../UIElements/PopupMessage";

type PopupInfoContextType = [
	show: (message: string) => void,
]

const PopupInfoContext = createContext<PopupInfoContextType | undefined>(undefined);

type PopupInfoContextProviderProps = {
	children: ReactNode;
}

export const PopupInfoContextProvider: FC<PopupInfoContextProviderProps> = ({ children }) => {
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
		<PopupInfoContext.Provider value={[ show ]}>
			{children}
			{currentMessage && (
				<PopupMessage type="Info">
					{currentMessage}
				</PopupMessage>
			)}
		</PopupInfoContext.Provider>
	);
};

export const usePopupInfo = (): PopupInfoContextType => {
	const context = useContext(PopupInfoContext);
	if (!context) {
		throw new Error("useInfo must be used within an InfoContextProvider");
	}
	return context;
};
