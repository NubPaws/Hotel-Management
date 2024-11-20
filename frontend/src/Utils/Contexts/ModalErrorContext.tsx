import { createContext, FC, ReactNode, useContext, useState } from "react";
import Modal, { ModalController } from "../../UIElements/Modal";

type ModalErrorContextType = [
	show: (title: string, message: string) => void,
]

const ModalErrorContext = createContext<ModalErrorContextType | undefined>(undefined);

type ModalErrorContextProviderProps = {
	children: ReactNode;
}

export const ModalErrorContextProvider: FC<ModalErrorContextProviderProps> = ({ children }) => {
	const [errorMessage, setErrorMessage] = useState<ModalController | null>(null);
	
	const show = (title: string, message: string) => {
		setErrorMessage({title, message});
	}
	
	return (
		<ModalErrorContext.Provider value={[ show ]}>
			{children}
			{errorMessage && (
				<Modal title={errorMessage.title} onClose={() => setErrorMessage(null)}>
					{errorMessage.message}
				</Modal>
			)}
		</ModalErrorContext.Provider>
	);
};

export const useModalError = (): ModalErrorContextType => {
	const context = useContext(ModalErrorContext);
	if (!context) {
		throw new Error("useError must be used within an ErrorContextProvider");
	}
	return context;
};
