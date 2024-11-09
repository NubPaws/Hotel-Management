import "./Input.css";

interface FormContainerProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    children: React.ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({ onSubmit, children }) => (
    <div className="input-fields-wrapper">
        <form className="form-container" onSubmit={onSubmit}>
            {children}
        </form>
    </div>
);
