import { createContext, FC, ReactNode, useContext, useState } from "react";
import PopupMessage from "../../UIElements/PopupMessage";

type PopupErrorContextType = [
	show: (message: string) => void,
]

const PopupErrorContext = createContext<PopupErrorContextType | undefined>(undefined);

type PopupErrorContextProviderProps = {
	children: ReactNode;
}

export const PopupErrorContextProvider: FC<PopupErrorContextProviderProps> = ({ children }) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	
	const show = (message: string) => {
		setErrorMessage(message);
		setTimeout(() => setErrorMessage(null), 5000);
	}
	
	return (
		<PopupErrorContext.Provider value={[ show ]}>
			{children}
			{errorMessage && (
				<PopupMessage type="Error">
					{errorMessage}
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
