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
}) => (
    <div className="form-container" style={{ width, maxWidth }}>
        <form onSubmit={onSubmit}>
            {children}
        </form>
    </div>
);

export default FormContainer;
