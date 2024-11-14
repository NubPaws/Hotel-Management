import "./FormContainer.css";

interface FormContainerProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    children: React.ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({ onSubmit, children }) => (
    <div className="form-container">
        <form onSubmit={onSubmit}>
            {children}
        </form>
    </div>
);
