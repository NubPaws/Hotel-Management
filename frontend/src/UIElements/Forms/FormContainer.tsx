import { KeyboardEvent, useCallback } from "react";
import "./FormContainer.css";

interface FormContainerProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    children: React.ReactNode;
    width?: string;
    maxWidth?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
    onSubmit,
    children,
    width = "100%",
    maxWidth = "400px",
}) => {
    const handleKeydown = useCallback((event: KeyboardEvent<HTMLFormElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            onSubmit(event);
        }
    }, [onSubmit]);
    
    return <div className="form-container" style={{ width, maxWidth }}>
        <form onSubmit={onSubmit} onKeyDown={handleKeydown}>
            {children}
        </form>
    </div>
};

export default FormContainer;
