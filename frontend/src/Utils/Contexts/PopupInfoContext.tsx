import { createContext, FC, ReactNode, useContext, useState } from "react";
import PopupMessage from "../../UIElements/PopupMessage";

type PopupInfoContextType = [
	show: (message: string) => void,
]

const PopupInfoContext = createContext<PopupInfoContextType | undefined>(undefined);

type PopupInfoContextProviderProps = {
	children: ReactNode;
}

export const PopupInfoContextProvider: FC<PopupInfoContextProviderProps> = ({ children }) => {
	const [InfoMessage, setInfoMessage] = useState<string | null>(null);
	
	const show = (message: string) => {
		setInfoMessage(message);
		setTimeout(() => setInfoMessage(null), 5000);
	}
	
	return (
		<PopupInfoContext.Provider value={[ show ]}>
			{children}
			{InfoMessage && (
				<PopupMessage type="Info">
					{InfoMessage}
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
