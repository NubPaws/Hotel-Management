import "./FormContainer.css";

interface FormContainerProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ onSubmit, children }) => (
    <div className="form-container">
        <form onSubmit={onSubmit}>
            {children}
        </form>
    </div>
);

export default FormContainer;
