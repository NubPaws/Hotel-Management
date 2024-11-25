import { FC, useState } from "react";
import "./InputModal..css";
import Input, { InputType } from "./Forms/Input";
import Button from "./Buttons/Button";

export type InputModalField = {
	name: string;
	label: string;
	type: InputType;
	placeholder?: string;
};

type InputModalProps = {
	fields: InputModalField[];
	title?: string;
	onConfirm: (formData: Record<string, any>) => void;
	onCancel: () => void;
};

const InputModal: FC<InputModalProps> = ({
	fields, title, onConfirm, onCancel
}) => {
	const [formData, setFormData] = useState<Record<string, any>>({});
	
	const handleChange = (name: string, value: any) => {
		setFormData(prevData => ({ ...prevData, [name]: value }));
	}
	
	const handleConfirm = () => {
		onConfirm(formData);
	}
	
	return (
		<div className="input-modal-overlay">
		<div className="input-modal">
			<div className="input-modal-content">
				{title && <p className="input-modal-title">{title}</p>}
				
				{fields.map(field => (
					<div key={field.name} className="input-modal-form-group">
						<label htmlFor={`input-modal-field-${field.name}`}>{field.label}</label>
						<Input
							id={`input-modal-field-${field.name}`}
							type={field.type}
							placeholder={field.placeholder}
							value={formData[field.name] || ""}
							onChange={(e) => handleChange(field.name, e.target.value)}
						/>
					</div>
				))}
			</div>
			<div className="input-modal-actions">
				<Button onClick={onCancel}>Cancle</Button>
				<Button onClick={handleConfirm}>OK</Button>
			</div>
		</div>
		</div>
	);
};

export default InputModal;
